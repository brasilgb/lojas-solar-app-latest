import React from 'react'
import { Stack } from "expo-router";
import DrawerHeader from '@/components/layouts/DrawerHeader';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="sign-in"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="check-password"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="recover-password"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="register-password"
                options={{
                    header: () => <DrawerHeader typel={'stack'} />
                }}
            />

            <Stack.Screen
                name="not-registered"
                options={{
                    header: () => <DrawerHeader typel={'stack'} />
                }}
            />
        </Stack>
    )
}