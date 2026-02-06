import React from 'react'
import { Stack } from 'expo-router'
import DrawerHeader from '@/components/layouts/DrawerHeader'

export default function AccountLayout() {

    return (
        <Stack initialRouteName='account'>
            <Stack.Screen
                name="account"
                options={{
                    header: () => <DrawerHeader typel={'stack'} typer={''} />
                }}
            />

            <Stack.Screen
                name="data-exclude"
                options={{
                    header: () => <DrawerHeader typel={'stack'} typer={''} />
                }}
            />

            <Stack.Screen
                name="data-analise"
                options={{
                    header: () => <DrawerHeader typel={'stack'} typer={''} />
                }}
            />
        </Stack>
    )

}