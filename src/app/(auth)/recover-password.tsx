import { Button } from '@/components/Button'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { KeyRoundIcon } from 'lucide-react-native'
import React from 'react'
import { View, Text, Image } from 'react-native'

export default function RecoverPassword() {
  const params = useLocalSearchParams()

  return (
    <ScreenLayout backgroundColor='bg-white'>
      <View className="flex-1 bg-gray-100 justify-center px-4">
        <View className="w-full bg-white rounded-2xl p-6">

          <View className="items-center mb-4">
            <View className="bg-blue-100 p-4 rounded-full">
              <KeyRoundIcon size={32} color="#1a9cd9" />
            </View>
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            Recuperação de senha
          </Text>

          <Text className="text-sm text-gray-600 text-center leading-5 mb-4">
            Enviamos uma nova senha para seu e-mail
          </Text>

          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <Text className="text-sm text-gray-600 text-center">
              Acesse seu e-mail e entre com a sua nova senha, você poderá alterar sua senha no menu minha conta.
            </Text>
          </View>

          <Text className="text-sm text-gray-500 text-center mb-6">
            Seu e-mail: {params?.email}
          </Text>

          <Button
            onPress={() => router.replace('/sign-in')}
            label="Continuar"
            className="w-full py-3 rounded-lg"
            labelClasses="text-white font-semibold"
          />

        </View>
      </View>
    </ScreenLayout>
  )
}