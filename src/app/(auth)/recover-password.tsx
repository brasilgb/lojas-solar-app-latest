import { Button } from '@/components/Button'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { router, useLocalSearchParams } from 'expo-router'
import { KeyRoundIcon } from 'lucide-react-native'
import React from 'react'
import { View, Text } from 'react-native'

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default function RecoverPassword() {
  const params = useLocalSearchParams()
  const email = getParamValue(params?.email)

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
            Enviamos para o seu e-mail uma nova senha temporária.
          </Text>

          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <Text className="text-sm text-gray-600 text-center">
              Acesse seu e-mail e copie a senha temporária recebida. Depois, entre no app com ela e acesse "Alterar senha" para escolher uma nova senha.
            </Text>
          </View>

          {!!email && (
            <Text className="text-sm text-gray-500 text-center mb-6">
              E-mail: {email}
            </Text>
          )}

          <Button
            onPress={() => router.replace('/sign-in')}
            label="Voltar para o login"
            className="w-full py-3 rounded-lg"
            labelClasses="text-white font-semibold"
          />

        </View>
      </View>
    </ScreenLayout>
  )
}
