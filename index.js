import 'expo-router/entry';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {
  displayNotification,
  handleNotifeeBackgroundEvent,
  parseRemoteMessage,
  setupNotificationChannel,
} from './src/lib/notifications';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Mensagem recebida em background!', remoteMessage);

  if (remoteMessage.notification) {
    return;
  }

  await setupNotificationChannel();

  const payload = parseRemoteMessage(remoteMessage);
  await displayNotification(payload);
});

notifee.onBackgroundEvent(handleNotifeeBackgroundEvent);
