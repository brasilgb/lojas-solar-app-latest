import DrawerHeader from '@/components/layouts/DrawerHeader'
import { Stack } from 'expo-router'
import React from 'react'

export default function QuestionLayout() {
    return (
        <Stack
            initialRouteName='questions'
            screenOptions={{
                animation: 'fade'
            }}
        >
            <Stack.Screen
                name="questions"
                options={{
                    headerShown: true,
                    title: 'Perguntas frequentes',
                    header: () => <DrawerHeader typel='drawer' />,
                }}
            />
        </Stack>
    )
}