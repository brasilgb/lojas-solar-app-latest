import '@/styles/global.css';
import { Platform, LogBox } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

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
function parseNotificationData(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const data = remoteMessage.data ?? {};
  const notification = remoteMessage.notification ?? {};

  return {
    // Tenta pegar do objeto notification, se não tiver, tenta no data
    title: notification.title ?? data.title ?? 'Lojas Solar',
    body: notification.body ?? data.body ?? '',
    imageUrl: data.imageUrl ?? undefined, // URLs de imagem geralmente vêm no data
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

    if (!remoteMessage.notification) {
      const parsed = parseNotificationData(remoteMessage) as any;
      await displayNotification(parsed);
    }
  }
);

/**
 * 🔥 CLICK BACKGROUND
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification } = detail;

  if (type === EventType.PRESS) {
    const url = notification?.data?.url as string;

    if (url && url.startsWith('http')) {
      console.log('🔗 Tentativa de abertura externa:', url);

      // No Android, as vezes o Linking nativo falha se o app não estiver 
      // totalmente no topo. O 'expo-linking' resolve melhor isso.
      await Linking.openURL(url).catch(err => {
        console.error("Erro ao abrir link externo:", err);
      });
    }

    if (notification?.id) {
      await notifee.cancelNotification(notification.id);
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
      const url = initialNotification?.notification?.data?.url as string;

      if (url && url.startsWith('http')) {
        // Aumentamos para 2 segundos para garantir que o Android 
        // terminou de carregar o app antes de mandar abrir o Chrome
        setTimeout(async () => {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
          }
        }, 3000);
      }
    };

    setup();

    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // evita duplicação
        // if (remoteMessage.notification) return;

        const parsed = parseNotificationData(remoteMessage) as any;
        await displayNotification(parsed);
      }
    );

    const unsubscribeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          const url = detail.notification?.data?.url;

          if (typeof url === 'string' && url.length > 0) {
            console.log('📱 Clique em Foreground/Resume detectado:', url);
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