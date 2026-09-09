import notifee, {
    AndroidImportance,
    AndroidStyle,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { File, Paths } from 'expo-file-system';
import { Linking, Platform } from 'react-native';

export interface NotificationPayload {
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  url?: string;
  messageId?: string;
}

export function parseRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): NotificationPayload {
  const data = remoteMessage.data ?? {};
  const notification = remoteMessage.notification ?? {};

  const remoteMessageId =
    typeof remoteMessage.messageId === 'string' &&
      remoteMessage.messageId.trim()
      ? remoteMessage.messageId.trim()
      : undefined;

  const dataMessageId =
    typeof data.messageId === 'string' && data.messageId.trim()
      ? data.messageId.trim()
      : undefined;

  return {
    title: notification.title ?? (typeof data.title === 'string' ? data.title : undefined),
    subtitle: typeof data.subtitle === 'string' ? data.subtitle : undefined,
    body: notification.body ?? (typeof data.body === 'string' ? data.body : ''),
    imageUrl:
      typeof data.imageUrl === 'string'
        ? data.imageUrl
        : typeof data.image === 'string'
          ? data.image
          : undefined,
    url: typeof data.url === 'string' ? data.url : undefined,
    messageId: remoteMessageId ?? dataMessageId,
  };
}


export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Canal Padrão',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });
}

export async function displayNotification(payload: NotificationPayload) {
  try {
    const { title, subtitle, body, imageUrl, url, messageId } = payload;

    const notificationId =
      typeof messageId === 'string' && messageId.trim()
        ? messageId
        : `local-${Date.now()}`;

    const iosImageUrl = Platform.OS === 'ios' && imageUrl
      ? await downloadNotificationImage(imageUrl, notificationId)
      : undefined;

    await notifee.displayNotification({
      id: notificationId,
      title: title || 'Nova mensagem',
      subtitle,
      body,
      data: {
        url: url ?? '',
        imageUrl: imageUrl ?? '',
        messageId: notificationId,
      },
      android: {
        channelId: 'default',
        largeIcon: 'ic_launcher',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        style: imageUrl
          ? {
            type: AndroidStyle.BIGPICTURE,
            picture: imageUrl,
          }
          : {
            type: AndroidStyle.BIGTEXT,
            text: body || '',
          },
      },
      ios: {
        attachments: iosImageUrl ? [{ url: iosImageUrl }] : [],
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao exibir notificacao:', error);
  }
}

async function downloadNotificationImage(imageUrl: string, notificationId: string) {
  if (!/^https?:\/\//i.test(imageUrl)) {
    return undefined;
  }

  try {
    const extension = imageUrl.split('?')[0].split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'jpg';
    const file = new File(Paths.cache, `notification-${notificationId}.${extension}`);
    const downloadedFile = await File.downloadFileAsync(imageUrl, file, { idempotent: true });
    return downloadedFile.uri;
  } catch (error) {
    console.error('Erro ao baixar imagem da notificacao:', error);
    return undefined;
  }
}

export async function openNotificationUrl(url?: string) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return;
  }

  const normalizedUrl = normalizeNotificationUrl(url);

  if (!normalizedUrl) {
    return;
  }

  try {
    await Linking.openURL(normalizedUrl);
  } catch (error) {
    console.error('Erro ao abrir URL da notificacao:', error);
  }
}

function normalizeNotificationUrl(url: string) {
  const trimmedUrl = url.trim().replace(/\s/g, '%20');

  if (!trimmedUrl) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  if (/^\/\//.test(trimmedUrl)) {
    return `https:${trimmedUrl}`;
  }

  if (/^[\w.-]+\.[a-z]{2,}(?::\d+)?(?:[/?#]|$)/i.test(trimmedUrl)) {
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
}

export async function handleNotificationPress(data?: { url?: string }) {
  await openNotificationUrl(data?.url);
}

export async function handleNotifeeBackgroundEvent({
  type,
  detail,
}: {
  type: EventType;
  detail: { notification?: { data?: { url?: string } } };
}) {
  if (type === EventType.PRESS) {
    await openNotificationUrl(detail.notification?.data?.url);
  }
}
