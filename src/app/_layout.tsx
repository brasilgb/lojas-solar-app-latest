import '@/styles/global.css';
import { Linking, Platform, LogBox } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import notifee, { EventType } from '@notifee/react-native';
import { displayNotification, setupNotificationChannel } from '@/lib/notifications';
import { getPersistentUniqueId } from '@/utils/deviceStorage';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

import { AuthProvider } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { Modalize } from 'react-native-modalize';
import VerifyVersion from '@/components/NewVersion';

LogBox.ignoreLogs(['Settings object size']);

/**
 * 🔥 Helper seguro para extrair dados
 */
function parseNotificationData(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  const data = remoteMessage.data ?? {};

  return {
    title: data.title ?? undefined,
    body: data.body ?? undefined,
    imageUrl: data.imageUrl ?? undefined,
    url: data.url ?? undefined,
    messageId: remoteMessage.messageId ?? undefined,
  };
}

/**
 * 🔥 BACKGROUND HANDLER
 */
messaging().setBackgroundMessageHandler(
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('FCM Background:', remoteMessage.messageId);

    if (!remoteMessage.notification && remoteMessage.data) {
      const parsed = parseNotificationData(remoteMessage) as any;
      await displayNotification(parsed);
    }
  }
);

/**
 * 🔥 CLICK BACKGROUND
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const url = detail.notification?.data?.url;

    if (typeof url === 'string' && url.length > 0) {
      await Linking.openURL(url);
    }
  }
});

export default function AppRootLayout() {
  const [versionData, setVersionData] = useState<any>(null);
  const modalizeRef = useRef<Modalize>(null);

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
        console.error('Erro ao verificar versão:', err);
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

/**
 * 🔥 HOOK
 */
function useNotifications() {
  useEffect(() => {
    const setup = async () => {
      await notifee.requestPermission();
      await messaging().registerDeviceForRemoteMessages();

      const fcmToken = await messaging().getToken();

      if (fcmToken) {
        const deviceId = await getPersistentUniqueId();
        await registerDevice(deviceId, fcmToken);
      }

      const initialNotification = await notifee.getInitialNotification();

      const url = initialNotification?.notification?.data?.url;

      if (typeof url === 'string' && url.length > 0) {
        setTimeout(() => {
          Linking.openURL(url);
        }, 800);
      }
    };

    setup();

    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // evita duplicação
        if (remoteMessage.notification) return;

        const parsed = parseNotificationData(remoteMessage) as any;
        await displayNotification(parsed);
      }
    );

    const unsubscribeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          const url = detail.notification?.data?.url;

          if (typeof url === 'string' && url.length > 0) {
            Linking.openURL(url);
          }
        }
      }
    );

    return () => {
      unsubscribeOnMessage();
      unsubscribeForeground();
    };
  }, []);
}

/**
 * 🔥 REGISTER
 */
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