import React from 'react'
import { Stack } from 'expo-router'
import DrawerHeader from '@/components/layouts/DrawerHeader'

export default function AccountLayout() {

    return (
        <Stack initialRouteName='crediary'>
            <Stack.Screen
                name="crediary"
                options={{
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Stack.Screen
                name="load-images"
                options={{
                    header: () => <DrawerHeader typel={'stack'} typer={''} />
                }}
            />

            <Stack.Screen
                name="images-sent"
                options={{
                    header: () => <DrawerHeader typel={'stack'} typer={''} />
                }}
            />
        </Stack>
    )

}