import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
} from '@notifee/react-native';

export interface NotificationPayload {
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  url?: string;
  messageId?: string;
}

/**
 * Inicializa o canal de notificações (chamar uma vez no app start)
 */
export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Canal Padrão',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });
}

/**
 * Exibe notificação local (usado para foreground ou data-only fallback)
 */
export async function displayNotification(payload: NotificationPayload) {
  try {
    const { title, subtitle, body, imageUrl, url, messageId } = payload;

    await notifee.displayNotification({
      id: messageId, // evita duplicação
      title: title || 'Nova mensagem',
      subtitle,
      body,
      data: {
        url: url ?? '',
        messageId: messageId ?? '',
      },
      android: {
        channelId: 'default',

        // Evita problemas com URL em background
        largeIcon: 'ic_launcher',

        importance: AndroidImportance.HIGH,

        style: imageUrl
          ? {
              type: AndroidStyle.BIGPICTURE,
              picture: imageUrl,
            }
          : {
              type: AndroidStyle.BIGTEXT,
              text: body || '',
            },

        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
      ios: {
        attachments: imageUrl ? [{ url: imageUrl }] : [],
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao exibir notificação:', error);
  }
}