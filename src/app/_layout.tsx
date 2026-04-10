import '@/styles/global.css';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { getApp, getApps } from '@react-native-firebase/app';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import {
  AuthorizationStatus,
  getAPNSToken,
  getMessaging,
  getInitialNotification as getMessagingInitialNotification,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  registerDeviceForRemoteMessages,
  requestPermission as requestMessagingPermission,
} from '@react-native-firebase/messaging';

import {
  displayNotification,
  handleNotificationPress,
  parseRemoteMessage,
  setupNotificationChannel,
} from '@/lib/notifications';
import { getPersistentUniqueId } from '@/utils/deviceStorage';
import notifee, { EventType } from '@notifee/react-native';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

import VerifyVersion from '@/components/NewVersion';
import { AuthProvider } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';

export default function AppRootLayout() {
  const [versionData, setVersionData] = useState<any>(null);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useNotifications();

  useEffect(() => {
    setupNotificationChannel();
  }, []);

  useEffect(() => {
    const getVersionCheck = async () => {
      try {
        const versionApp =
          process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '') || '0';

        const response = await appservice.get('(WS_VERSAO_APP)');
        const { android, ios } = response.data.resposta.data;

        const remoteVersion = Platform.OS === 'ios' ? ios : android;

        if (parseInt(remoteVersion, 10) > parseInt(versionApp, 10)) {
          const versionNew = remoteVersion.split('').join('.');

          setVersionData({
            route: {
              params: {
                data: {
                  atual: process.env.EXPO_PUBLIC_APP_VERSION,
                  nova: versionNew,
                },
              },
            },
          });
        }
      } catch (err) {
        console.error('Erro ao verificar versao:', err);
      }
    };

    getVersionCheck();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="bg-solar-blue-primary flex-1"
        edges={['top', 'bottom']}
      >
        <AuthProvider>
          {versionData && <VerifyVersion {...versionData} />}

          <Stack initialRouteName="(drawer)">
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function useNotifications() {
  useEffect(() => {
    if (getApps().length === 0) {
      console.warn('Firebase nao inicializado. Notificacoes FCM desativadas.');
      return;
    }

    const messagingInstance = getMessaging(getApp());
    let handledInitialUrl: string | null = null;

    const handlePendingNotification = async (data?: { url?: string }) => {
      const url = data?.url;

      if (!url || handledInitialUrl === url) {
        return;
      }

      handledInitialUrl = url;

      setTimeout(() => {
        handleNotificationPress({ url });
      }, 800);
    };

    const setup = async () => {
      try {
        const messagingStatus = await requestMessagingPermission(messagingInstance, {
          alert: true,
          badge: true,
          sound: true,
          carPlay: true,
          provisional: true,
        });

        if (
          messagingStatus !== AuthorizationStatus.AUTHORIZED &&
          messagingStatus !== AuthorizationStatus.PROVISIONAL &&
          messagingStatus !== AuthorizationStatus.EPHEMERAL
        ) {
          console.warn('Push notification permission not granted. Ignoring FCM registration.');
          return;
        }

        await notifee.requestPermission();

        await registerDeviceForRemoteMessages(messagingInstance);

        // On iOS, this gives the APNS token needed for FCM token exchange.
        const apnsToken = await getAPNSToken(messagingInstance);
        if (!apnsToken) {
          console.warn('APNS token not ready yet; waiting 2 seconds before getToken()');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        await setupNotificationChannel();

        const fcmToken = await getToken(messagingInstance);

        if (fcmToken) {
          const deviceId = await getPersistentUniqueId();
          await registerDevice(deviceId, fcmToken);
        }

        const initialNotification = await notifee.getInitialNotification();
        await handlePendingNotification(
          initialNotification?.notification?.data as
            | { url?: string }
            | undefined
        );

        const initialRemoteMessage = await getMessagingInitialNotification(
          messagingInstance
        );
        await handlePendingNotification(initialRemoteMessage?.data);
      } catch (error) {
        console.error('Erro ao inicializar notificacoes:', error);
      }
    };

    setup();

    const unsubscribeOnMessage = onMessage(
      messagingInstance,
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const parsed = parseRemoteMessage(remoteMessage);
        await displayNotification(parsed);
      }
    );

    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messagingInstance,
      async remoteMessage => {
        await handlePendingNotification(remoteMessage.data);
      }
    );

    const unsubscribeForeground = notifee.onForegroundEvent(
      async ({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log(
            'Clique em foreground detectado:',
            detail.notification?.data
          );
          await handlePendingNotification(
            detail.notification?.data as { url?: string }
          );
        }
      }
    );

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpenedApp();
      unsubscribeForeground();
    };
  }, []);
}

async function registerDevice(deviceId: string, pushToken: string) {
  try {
    const deviceos = Platform.OS;
    const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');
    console.log('fcmToken:', pushToken);

    await appservice.get(
      `(WS_GRAVA_DEVICE)?deviceId=${deviceId}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}`
    );

    console.log('Dispositivo registrado com sucesso');
  } catch (error) {
    console.log('Erro ao registrar dispositivo:', error);
  }
}
