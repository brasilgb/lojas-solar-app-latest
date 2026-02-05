import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Button } from '@/components/Button'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'

export default function Account() {
    return (
        <ScreenLayout backgroundColor='bg-solar-blue-secondary'>
            <Text>Account</Text>
            <Link href="/alter-password" asChild>
                <Button label="Alterar Senha" />
            </Link>
        </ScreenLayout>
    )
}

