import DrawerHeader from '@/components/layouts/DrawerHeader'
import { Stack } from 'expo-router'
import React from 'react'

export default function HistoryLayout() {
  return (
    <Stack
      initialRouteName='history'
      screenOptions={{
        animation: 'fade'
      }}
    >
      <Stack.Screen
        name="history"
        options={{
          header: () => <DrawerHeader typel='drawer' />,
          headerShown: true,
          title: 'History',
        }}
      />
    
      <Stack.Screen
        name="history-items"
        options={{
          header: () => <DrawerHeader typel='stack' />,
          headerShown: true,
          title: 'History',
        }}
      />
    </Stack>
  )
}