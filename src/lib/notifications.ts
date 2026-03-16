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

export async function createNotificationChannel() {
  // Otimização: Não precisa esperar o retorno se for apenas para garantir a existência
  return await notifee.createChannel({
    id: 'default',
    name: 'Canal Padrão',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    // Adicione sons ou vibração aqui se desejar
  });
}

export async function displayNotification(payload: NotificationPayload) {
  const { title, subtitle, body, imageUrl, url, messageId } = payload;

  const channelId = await createNotificationChannel();

  // Tratamento de imagem para evitar quebra no Headless JS
  const largeIcon = imageUrl ? imageUrl : undefined; 
  // Dica: Se quiser um ícone padrão, use o nome do recurso nativo (ex: 'ic_launcher') 
  // em vez de require do React Native para maior estabilidade em background.

  await notifee.displayNotification({
    title: title || 'Nova mensagem', // Fallback caso o data venha vazio
    subtitle,
    body,
    data: {
      url: url ?? "",
      messageId: messageId ?? "",
    },
    android: {
      channelId,
      // Se largeIcon for undefined, ele usará o ícone padrão do app configurado no AndroidManifest
      largeIcon: largeIcon, 
      importance: AndroidImportance.HIGH,
      style: imageUrl ? { 
        type: AndroidStyle.BIGPICTURE, 
        picture: imageUrl 
      } : {
        type: AndroidStyle.BIGTEXT,
        text: body || '',
      },
      pressAction: {
        id: 'default',
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
}