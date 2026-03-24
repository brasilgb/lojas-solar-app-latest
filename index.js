import notifee from '@notifee/react-native';
import firebase, { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import 'expo-router/entry';

import {
    displayNotification,
    handleNotifeeBackgroundEvent,
    parseRemoteMessage,
    setupNotificationChannel,
} from './src/lib/notifications';

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAoS4j1-tu5uofMCbOlYhV1Oj_vwt3Ej_4',
    authDomain: 'applojassolar.firebaseapp.com',
    projectId: 'applojassolar',
    storageBucket: 'applojassolar.firebasestorage.app',
    messagingSenderId: '639262521508',
    appId: '1:639262521508:ios:fc6fa1841be87274318e31',
    databaseURL: 'https://applojassolar-default-rtdb.firebaseio.com/',
  });
}

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
