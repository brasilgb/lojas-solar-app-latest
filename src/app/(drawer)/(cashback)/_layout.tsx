import DrawerHeader from '@/components/layouts/DrawerHeader'
import { Stack } from 'expo-router'
import React from 'react'

export default function CashbackLayout() {
  return (
    <Stack
      initialRouteName='cashback'
      screenOptions={{
        animation: 'fade'
      }}
    >
      <Stack.Screen
        name="cashback"
        options={{
          header: () => <DrawerHeader typel='drawer' />,
          headerShown: true,
          title: 'Cashback',
        }}
      />
    </Stack>
  )
}