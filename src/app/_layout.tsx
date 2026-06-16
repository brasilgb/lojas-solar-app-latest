import '@/styles/global.css';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import * as Updates from 'expo-updates';
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

const USER_STORAGE_KEY = 'user-data';

export default function AppRootLayout() {
  const [versionData, setVersionData] = useState<any>(null);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useNotifications();
  useOverTheAirUpdates();

  useEffect(() => {
    setupNotificationChannel();
  }, []);

  useEffect(() => {
    const getVersionCheck = async () => {
      try {
        const currentVersion =
          process.env.EXPO_PUBLIC_APP_VERSION ||
          Application.nativeApplicationVersion ||
          '0';

        const response = await appservice.get('(WS_VERSAO_APP)');
        const remoteVersion = getRemoteAppVersion(
          response.data?.resposta?.data,
        );

        if (!remoteVersion) {
          return;
        }

        if (compareAppVersions(remoteVersion, currentVersion) > 0) {
          const versionNew = formatAppVersion(remoteVersion);

          setVersionData({
            route: {
              params: {
                data: {
                  atual: currentVersion,
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

function compareAppVersions(remoteVersion: string | number, currentVersion: string | number) {
  const remoteParts = normalizeAppVersion(remoteVersion);
  const currentParts = normalizeAppVersion(currentVersion);
  const maxLength = Math.max(remoteParts.length, currentParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const remotePart = remoteParts[index] || 0;
    const currentPart = currentParts[index] || 0;

    if (remotePart > currentPart) return 1;
    if (remotePart < currentPart) return -1;
  }

  return 0;
}

function getRemoteAppVersion(versionData: any) {
  if (typeof versionData === 'string' || typeof versionData === 'number') {
    return versionData;
  }

  if (!versionData) {
    return undefined;
  }

  const platformVersion =
    Platform.OS === 'ios'
      ? versionData.ios || versionData.iOS || versionData.IOS
      : versionData.android || versionData.Android || versionData.ANDROID;

  return (
    platformVersion ||
    versionData.version ||
    versionData.versao ||
    versionData.appVersion ||
    versionData.versaoApp
  );
}

function normalizeAppVersion(version: string | number) {
  const versionValue = String(version).trim();

  if (versionValue.includes('.')) {
    return versionValue
      .split('.')
      .map(part => parseInt(part.replace(/\D/g, '') || '0', 10));
  }

  return parseCompactAppVersion(versionValue);
}

function formatAppVersion(version: string | number) {
  const versionValue = String(version).trim();

  if (versionValue.includes('.')) {
    return versionValue;
  }

  return parseCompactAppVersion(versionValue).join('.');
}

function parseCompactAppVersion(version: string) {
  const digits = version.replace(/\D/g, '');

  if (!digits) {
    return [0];
  }

  if (digits.length <= 3) {
    return digits.split('').map(part => parseInt(part, 10));
  }

  return [
    parseInt(digits.slice(0, 1), 10),
    parseInt(digits.slice(1, 2), 10),
    parseInt(digits.slice(2), 10),
  ];
}

function useOverTheAirUpdates() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (!update.isAvailable) {
          return;
        }

        const fetchedUpdate = await Updates.fetchUpdateAsync();

        if (fetchedUpdate.isNew) {
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error('Erro ao verificar atualizacao OTA:', error);
      }
    };

    checkForUpdates();
  }, []);
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

        await setupNotificationChannel();

        const fcmToken = await getFirebaseMessagingToken(messagingInstance);

        if (fcmToken) {
          const deviceId = await getPersistentUniqueId();
          await registerDevice(deviceId, fcmToken);
        } else {
          console.warn('FCM token nao foi gerado. Registro do device ignorado.');
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

async function getFirebaseMessagingToken(
  messagingInstance: ReturnType<typeof getMessaging>
) {
  const maxAttempts = Platform.OS === 'ios' ? 5 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (Platform.OS === 'ios') {
        const apnsToken = await getAPNSToken(messagingInstance);

        if (!apnsToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
      }

      const fcmToken = await getToken(messagingInstance);

      if (fcmToken) {
        console.log('FCM token gerado com sucesso');
        return fcmToken;
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        console.log('Erro ao gerar FCM token:', error);
        return undefined;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return undefined;
}

async function registerDevice(deviceId: string, pushToken: string) {
  try {
    const deviceos = Platform.OS;
    const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');
    const codcli = await getStoredCustomerCode();

    await appservice.get(
      `(WS_GRAVA_DEVICE)?deviceId=${encodeURIComponent(deviceId)}&pushToken=${encodeURIComponent(pushToken)}&deviceOs=${encodeURIComponent(deviceos)}&versaoApp=${encodeURIComponent(versaoapp || '')}&codcli=${encodeURIComponent(codcli)}`
    );

    console.log('Dispositivo registrado com sucesso');
  } catch (error) {
    console.log('Erro ao registrar dispositivo:', error);
  }
}

async function getStoredCustomerCode() {
  const userJson = await SecureStore.getItemAsync(USER_STORAGE_KEY);

  if (!userJson) {
    return '0';
  }

  try {
    const user = JSON.parse(userJson);
    const customerCode = String(user?.codigoCliente ?? '').replace(/\D/g, '');

    return customerCode || '0';
  } catch (error) {
    console.log('Erro ao ler codigo do cliente do storage:', error);
    return '0';
  }
}
