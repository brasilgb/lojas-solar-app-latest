import '@/styles/global.css';
import { Linking, Platform, LogBox } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import appservice from '@/services/appservice';
import { Modalize } from 'react-native-modalize';
import VerifyVersion from '@/components/NewVersion';

// Ignore logs desnecessários em produção
LogBox.ignoreLogs(['Settings object size']);

/**
 * LÓGICA DE BACKGROUND (FORA DO COMPONENTE)
 * Essencial para o funcionamento com o APP FECHADO (Quit State).
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('FCM Background:', remoteMessage.messageId);
    
    // Se for data-only, nós exibimos manualmente via Notifee
    if (remoteMessage.data) {
        const { title, body, imageUrl, url } = remoteMessage.data;
        await displayNotification({
            title: title as string,
            body: body as string,
            imageUrl: imageUrl as string,
            url: url as string,
            messageId: remoteMessage.messageId,
        });
    }
});

// Handler para eventos de background do Notifee (Ex: Clicar na notificação com app fechado)
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data?.url) {
        // O Linking.openURL aqui tentará abrir o app na rota específica
        await Linking.openURL(detail.notification.data.url as string);
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

    // Hook separado para organizar a lógica de notificação
    useNotifications();

    useEffect(() => {
        const getVersionCheck = async () => {
            try {
                const versionApp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '') || "0";
                const response = await appservice.get('WS_VERSAO_APP');
                const { android, ios } = response.data.resposta.data;
                const remoteVersion = Platform.OS === 'ios' ? ios : android;

                if (parseInt(remoteVersion, 10) > parseInt(versionApp, 10)) {
                    const versionNew = remoteVersion.split('').join('.');
                    setVersionData({ 
                        route: { params: { data: { atual: process.env.EXPO_PUBLIC_APP_VERSION, nova: versionNew } } } 
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
            <SafeAreaView className='bg-solar-blue-primary flex-1' edges={['top', 'bottom']}>
                <AuthProvider>
                    {versionData && <VerifyVersion {...versionData} />}
                    <Stack initialRouteName='(drawer)'>
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                    </Stack>
                </AuthProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

/**
 * HOOK CUSTOMIZADO PARA NOTIFICAÇÕES (FOREGROUND & INITIAL)
 */
function useNotifications() {
    useEffect(() => {
        const setup = async () => {
            // 1. Permissões e Canal
            await notifee.requestPermission();
            await createNotificationChannel();

            // 2. Token e Registro
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                const deviceId = await getPersistentUniqueId();
                await registerDevice(deviceId, fcmToken);
            }

            // 3. Lógica para quando o App estava TOTALMENTE FECHADO e foi aberto pelo clique
            const initialNotification = await notifee.getInitialNotification();
            if (initialNotification?.notification?.data?.url) {
                setTimeout(() => {
                    Linking.openURL(initialNotification.notification.data?.url as string);
                }, 1000); // Pequeno delay para a navegação estar pronta
            }
        };

        setup();

        // 4. Listener Foreground (App aberto)
        const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
            if (remoteMessage.data) {
                const { title, body, imageUrl, url } = remoteMessage.data;
                await displayNotification({
                    title: title as string,
                    body: body as string,
                    imageUrl: imageUrl as string,
                    url: url as string,
                    messageId: remoteMessage.messageId,
                });
            }
        });

        // 5. Listener de clique com app em Foreground ou Background (não morto)
        const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS && detail.notification?.data?.url) {
                Linking.openURL(detail.notification.data.url as string);
            }
        });

        return () => {
            unsubscribeOnMessage();
            unsubscribeForeground();
        };
    }, []);
}

async function registerDevice(deviceId: string, pushToken: string) {
    try {
        const deviceos = Platform.OS;
        const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');
        await appservice.get(`(WS_GRAVA_DEVICE)?deviceId=${deviceId}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}`);
        console.log('Dispositivo registrado com sucesso');
    } catch (error) {
        console.log('Erro ao registrar dispositivo:', error);
    }
}