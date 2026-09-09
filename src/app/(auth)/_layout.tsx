import DrawerHeader from '@/components/layouts/DrawerHeader';
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
                    animation: 'slide_from_right',
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