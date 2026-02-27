import { View, Text } from 'react-native'
import React from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { PhoneCallIcon } from 'lucide-react-native'

export default function Contact() {
  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 flex-col items-center justify-start'>
        <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>
          <PageHeader
            title="Fale conosco"
            subtitle="Estamos aqui para ajudar"
            description="Utilize um dos meios abaixo para entrar em contato conosco, para dúvidas, reclamações ou observações"
            icon={<PhoneCallIcon size={26} color="#1a9cd9" />}
          />

          <View className='flex-1 w-full'>
            <View className="flex-col gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <Text className="text-base text-gray-600 text-center">
              51-3638-5000
            </Text>
            <Text className="text-base text-gray-600 text-center">
              sac@lojasolar.com.br
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Av. Duque de Caxias,385
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Centro - Salvador do Sul - RS
            </Text>
            <Text className="text-base text-gray-600 text-center">
              CEP: 95750-000
            </Text>
          </View>
          </View>
          <Text className="text-sm font-bold pt-4 text-center pb-2">
            v{process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>
      </View>
    </ScreenLayout>
  )
}