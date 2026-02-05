import React from 'react'
import { Stack } from "expo-router";

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
        </Stack>
    )
}