import DrawerHeader from '@/components/layouts/DrawerHeader'
import { Stack } from 'expo-router'
import React from 'react'

export default function LocationLayout() {
    return (
        <Stack
            initialRouteName='initial-location'
            screenOptions={{
                animation: 'fade'
            }}
        >
            <Stack.Screen
                name="initial-location"
                options={{
                    headerShown: true,
                    title: 'Localização inicial',
                    header: () => <DrawerHeader typel='drawer' />,
                }}
            />
            <Stack.Screen
                name="store-selected"
                options={{
                    headerShown: true,
                    title: 'Localização selecionada',
                    header: () => <DrawerHeader typel='stack' />,
                }}
            />
        </Stack>
    )
}