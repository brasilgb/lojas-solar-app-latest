import UserNotifications

/// Downloads and attaches the notification's image so push notifications show it while the app
/// is backgrounded or fully closed — the same image the JS side (`src/lib/notifications.ts`)
/// already attaches when the app is in the foreground via `notifee`.
///
/// This only runs at all if the push's `aps` dictionary includes `"mutable-content": 1`; without
/// that flag iOS never launches this extension. Firebase adds it automatically when the server
/// sends the message with FCM's `notification.imageUrl` field. If the server instead sends the
/// image as a plain custom data field, that flag has to be added on the server explicitly.
class NotificationService: UNNotificationServiceExtension {

  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?

  override func didReceive(
    _ request: UNNotificationRequest,
    withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
  ) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)

    guard let bestAttemptContent = bestAttemptContent else {
      contentHandler(request.content)
      return
    }

    guard let imageURL = Self.extractImageURL(from: request.content.userInfo) else {
      contentHandler(bestAttemptContent)
      return
    }

    let task = URLSession.shared.downloadTask(with: imageURL) { location, response, error in
      defer { contentHandler(bestAttemptContent) }

      guard let location = location, error == nil else { return }

      let fileExtension: String
      switch response?.mimeType {
      case "image/png": fileExtension = "png"
      case "image/gif": fileExtension = "gif"
      case "image/webp": fileExtension = "webp"
      default: fileExtension = "jpg"
      }

      let tempFile = FileManager.default.temporaryDirectory
        .appendingPathComponent(UUID().uuidString)
        .appendingPathExtension(fileExtension)

      do {
        try FileManager.default.moveItem(at: location, to: tempFile)
        let attachment = try UNNotificationAttachment(identifier: "image", url: tempFile, options: nil)
        bestAttemptContent.attachments = [attachment]
      } catch {
        // Deliver without the image rather than dropping the notification entirely.
      }
    }
    task.resume()
  }

  override func serviceExtensionTimeWillExpire() {
    // The system enforces a hard ~30s budget. Deliver whatever we have — with or without the
    // image — rather than let the notification fail to show at all.
    if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }

  /// Checks, in order: FCM's own `fcm_options.image` (set automatically when the server uses
  /// FCM's `notification.imageUrl` field) and the flat `imageUrl` / `image` custom data keys
  /// that `parseRemoteMessage` in `src/lib/notifications.ts` already reads on the JS side.
  private static func extractImageURL(from userInfo: [AnyHashable: Any]) -> URL? {
    if let fcmOptions = userInfo["fcm_options"] as? [AnyHashable: Any],
      let urlString = fcmOptions["image"] as? String,
      let url = URL(string: urlString) {
      return url
    }

    for key in ["imageUrl", "image"] {
      if let urlString = userInfo[key] as? String, let url = URL(string: urlString) {
        return url
      }
    }

    return nil
  }
}
