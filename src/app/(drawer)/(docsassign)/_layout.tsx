import React from 'react'
import { Stack } from 'expo-router'
import DrawerHeader from '@/components/layouts/DrawerHeader'

export default function DocsAssignLayout() {

    return (
        <Stack
            initialRouteName='docs-assign'
            screenOptions={{
                animation: 'fade'
            }}
        >
            <Stack.Screen
                name="docs-assign"
                options={{
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Stack.Screen
                name="view-doc"
                options={{
                    header: () => <DrawerHeader typel={'stack'} typer={''} />
                }}
            />

        </Stack>
    )

}