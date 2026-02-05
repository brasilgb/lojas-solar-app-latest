import { Button } from '@/components/Button'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View, Text, Image } from 'react-native'

export default function RecoverPassword() {
  const params = useLocalSearchParams()
  console.log(params)

  return (
    <ScreenLayout backgroundColor='bg-white'>
      <View className='flex-1 flex-col items-center justify-start'>
        <View className='py-8'>
          <Image
            className="self-center w-72 h-52"
            source={require('@/assets/images/new_password_logo.png')}
          />
        </View>
        <View className='px-8 mt-8'>
          <Text className='text-4xl text-center font-semibold text-gray-500 mb-4'>Enviamos uma nova senha para seu e-mail</Text>
          <Text className='text-center text-2xl font-medium text-solar-blue-primary'>{params?.email}</Text>
        </View>
        <View className='my-8 px-14 flex-1 flex-col items-center justify-center'>
          <Text className='text-center text-xl text-gray-500'>Acesse seu e-mail e entre com a sua nova senha, você poderá alterar sua senha no menu minha conta.</Text>
        </View>
      </View>
      <View className='w-full bg-white flex-row items-center justify-center p-8'>
        <Link href={'/sign-in'} asChild>
        <Button variant={'default'} label={'Entrar'} labelClasses='text-white' className='w-full' />
        </Link>
      </View>

    </ScreenLayout>
  )
}