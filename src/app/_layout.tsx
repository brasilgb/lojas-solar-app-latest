import '@/styles/global.css'
import { Linking, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react'
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { createNotificationChannel, displayNotification } from '@/lib/notifications';
import { getPersistentUniqueId } from '@/utils/deviceStorage';

import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';

import { AuthProvider } from '@/contexts/AuthContext';
import { getDeviceId } from '@/services/device';
import appservice from '@/services/appservice';
import { Modalize } from 'react-native-modalize';
import VerifyVersion from '@/components/NewVersion';

/**
 * Retorna a hora atual formatada como "[HH:MM]".
 */
const getCurrentTimeFormatted = () => {
    const now = new Date();
    // Obtém horas e minutos e garante que tenham dois dígitos (ex: 09:05)
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Firebase: Notificação FCM recebida (Background/Quit):', remoteMessage);

    if (remoteMessage.data) {
        // Extrai os dados do payload "data-only"
        const { title, body, imageUrl, url } = remoteMessage.data as any;

        const notificationSubtitle = getCurrentTimeFormatted();

        await displayNotification({
            title,
            subtitle: notificationSubtitle,
            body,
            imageUrl,
            url,
            messageId: remoteMessage.messageId,
        });
    }
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification } = detail;

    // Evento de clique na notificação
    if (type === EventType.PRESS && notification?.data?.url) {
        // Abre o link associado
        await Linking.openURL(notification.data.url as string);
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

    useEffect(() => {
        (async () => {
            const deviceId = await getDeviceId();
            await registerDevice(deviceId, 'este é o token do firebase');
        })();
    }, []);

    useEffect(() => {
        const getVersionCheck = async () => {
            let versionApp: any = process.env.EXPO_PUBLIC_APP_VERSION?.replace(
                /\./g,
                '',
            );

            await appservice
                .get('WS_VERSAO_APP')
                .then((response: any) => {
                    const { android, ios } = response.data.resposta.data;
                    const version = Platform.OS === 'ios' ? ios : android;

                    if (parseInt(version, 10) > parseInt(versionApp, 10)) {
                        let versionNew: any = version?.split('').join('.');
                        const data = {
                            atual: process.env.EXPO_PUBLIC_APP_VERSION,
                            nova: versionNew,
                        };
                        setVersionData({ route: { params: { data } } });
                        modalizeRef.current?.open();
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                });
        };
        getVersionCheck();
    }, []);

    useNotifications();

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            {versionData && (
                <VerifyVersion
                    {...versionData}
                />
            )}
            <SafeAreaView className='bg-solar-blue-primary flex-1' edges={['top', 'bottom']}>
                <AuthProvider>
                    <Stack
                        initialRouteName='(drawer)'
                    >
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                    </Stack>
                </AuthProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

function useNotifications() {
    useEffect(() => {
        const initializeNotifications = async () => {
            // 1. Solicita permissão para notificações (iOS e Android 13+)
            await notifee.requestPermission();

            // 2. Cria o canal de notificação para Android (obrigatório)
            await createNotificationChannel();

            // 3. Obtém o token FCM e registra o dispositivo
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('Firebase: FCM Token obtido:', fcmToken);
                const deviceId = await getPersistentUniqueId();
                await registerDevice(deviceId, fcmToken);
            }

            // 4. Listener para quando o app é aberto a partir de uma notificação (estado quit)
            const initialNotification = await notifee.getInitialNotification();
            if (initialNotification && initialNotification.notification.data?.url) {
                Linking.openURL(initialNotification.notification.data.url as string);
            }
        };

        initializeNotifications();

        // 5. Listener para notificações recebidas com o app em FOREGROUND
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('Firebase: Notificação FCM recebida (Foreground):', remoteMessage);
            if (remoteMessage.data) {
                // Extrai os dados do payload "data-only"
                const { title, body, imageUrl, url } = remoteMessage.data as any;

                const notificationSubtitle = getCurrentTimeFormatted();

                await displayNotification({ title, subtitle: notificationSubtitle, body, imageUrl, url, messageId: remoteMessage.messageId });
            }
        });

        // Limpeza dos listeners ao desmontar o componente
        return () => {
            unsubscribeOnMessage();
        };
    }, []);

    // 6. Listener para eventos de INTERAÇÃO com a notificação (app em foreground/background)
    useEffect(() => {
        const handleNotificationInteraction = (eventType: EventType, url: string | undefined) => {
            if (eventType === EventType.PRESS && url) {
                Linking.openURL(url);
            }
        };

        const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
            handleNotificationInteraction(type, detail.notification?.data?.url as string | undefined);
        });

        return () => {
            unsubscribeForeground();
        };
    }, []);
};

// registerDevice: envia deviceId + pushToken ao backend
async function registerDevice(deviceId: string, pushToken: any) {
    try {

        const deviceos = Platform.OS;
        const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');

        const response = await appservice.get(`(WS_GRAVA_DEVICE)?deviceId=${deviceId}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}`);

        if (response) {
            console.log('Dispositivo registrado');
        }

    } catch (error) {
        console.log('Erro ao registrar dispositivo:', error);
    }
}
