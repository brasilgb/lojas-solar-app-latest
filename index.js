import 'expo-router/entry';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {
  displayNotification,
  handleNotifeeBackgroundEvent,
  parseRemoteMessage,
  setupNotificationChannel,
} from './src/lib/notifications';

const messagingInstance = getMessaging(getApp());

setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
  console.log('Mensagem recebida em background!', remoteMessage);

  if (remoteMessage.notification) {
    return;
  }

  await setupNotificationChannel();

  const payload = parseRemoteMessage(remoteMessage);
  await displayNotification(payload);
});

notifee.onBackgroundEvent(handleNotifeeBackgroundEvent);
