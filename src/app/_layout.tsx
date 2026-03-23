import '@/styles/global.css';
import { Platform, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  FirebaseMessagingTypes,
  getInitialNotification as getMessagingInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';

import notifee, { EventType } from '@notifee/react-native';
import {
  displayNotification,
  handleNotificationPress,
  parseRemoteMessage,
  setupNotificationChannel,
} from '@/lib/notifications';
import { getPersistentUniqueId } from '@/utils/deviceStorage';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

import { AuthProvider } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import VerifyVersion from '@/components/NewVersion';

LogBox.ignoreLogs(['Settings object size']);

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

        const response = await appservice.get('WS_VERSAO_APP');
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

    const messagingInstance = getMessaging();
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
        await notifee.requestPermission();
        await registerDeviceForRemoteMessages(messagingInstance);
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
          console.log('Clique em foreground detectado:', detail.notification?.data);
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
