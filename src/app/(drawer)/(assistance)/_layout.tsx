import DrawerHeader from '@/components/layouts/DrawerHeader'
import { Stack } from 'expo-router'
import React from 'react'

export default function AssistanceLayout() {
  return (
    <Stack
      initialRouteName='assistance'
      screenOptions={{
        animation: 'fade'
      }}
    >
      <Stack.Screen
        name="assistance"
        options={{
          header: () => <DrawerHeader typel='drawer' />,
          headerShown: true,
          title: 'Assistance',
        }}
      />
    </Stack>
  )
}
