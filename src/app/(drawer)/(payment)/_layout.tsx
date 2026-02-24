import DrawerHeader from '@/components/layouts/DrawerHeader'
import { Stack } from 'expo-router'
import React from 'react'

export default function PaymentLayout() {
  return (
    <Stack
      initialRouteName='payment'
      screenOptions={{
        animation: 'fade'
      }}
    >
      <Stack.Screen
        name="payment"
        options={{
          header: () => <DrawerHeader typel='drawer' />,
          headerShown: true,
          title: 'Pagamentos',
        }}
      />
    </Stack>
  )
}