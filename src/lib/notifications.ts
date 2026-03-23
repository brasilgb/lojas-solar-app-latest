import { Linking } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

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

  return {
    title: notification.title ?? data.title ?? 'Lojas Solar',
    subtitle: data.subtitle ?? undefined,
    body: notification.body ?? data.body ?? '',
    imageUrl: data.imageUrl ?? data.image ?? undefined,
    url: data.url ?? undefined,
    messageId: remoteMessage.messageId ?? data.messageId ?? undefined,
  } as any;
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

    await notifee.displayNotification({
      id: messageId,
      title: title || 'Nova mensagem',
      subtitle,
      body,
      data: {
        url: url ?? '',
        messageId: messageId ?? '',
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
        attachments: imageUrl ? [{ url: imageUrl }] : [],
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

export async function openNotificationUrl(url?: string) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  } catch (error) {
    console.error('Erro ao abrir URL da notificacao:', error);
  }
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
    console.log(
      'Notificacao pressionada em background:',
      detail.notification?.data
    );
  }
}
