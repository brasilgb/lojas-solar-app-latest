import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Button } from '@/components/Button'

export default function AlterPassword() {
    return (
        <View>
            <Text>alterPassword</Text>
            <Link href="/account" asChild>
                <Button label="Alterar Senha" />
            </Link>
        </View>
    )
}