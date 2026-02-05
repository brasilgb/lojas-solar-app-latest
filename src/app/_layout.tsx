import '@/styles/global.css'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';

import { AuthProvider } from '@/contexts/AuthContext';
import { getDeviceId } from '@/services/device';
import { Platform } from 'react-native';
import appservice from '@/services/appservice';

export default function AppRootLayout() {

    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    useEffect(() => {
        (async () => {
            const deviceId = await getDeviceId();
            console.log(deviceId);
            await registerDevice(deviceId, 'este é o token do firebase');
        })();
    }, []);

    async function registerDevice(deviceId: string, pushToken: any) {
        try {
            const deviceos = Platform.OS;
            const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');

            const response = await appservice.get(
                `(WS_GRAVA_DEVICE)?deviceId=${deviceId}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}`,
            );

            if (response) {
                console.log('✅ Dispositivo registrado');
            }

        } catch (error) {
            console.log('❌ Erro ao registrar dispositivo:', error);
        }
    }

    if (!fontsLoaded) {
        return null;
    }
    return (
        <SafeAreaProvider>
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