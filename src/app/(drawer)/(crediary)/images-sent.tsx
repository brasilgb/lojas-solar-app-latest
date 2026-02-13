import { View, Text, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { HandshakeIcon, ImagePlusIcon, User2Icon, UserMinus2Icon } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function ImagesSent() {
  const params = useLocalSearchParams();

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className='flex-1 flex-col items-center justify-start'>
            <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>
              <View className=''>
                <HandshakeIcon size={60} color={'#1a9cd9'} />
              </View>
              <View className="bg-white rounded-xl px-4 pb-4 flex-col justify-center items-center">
                <Text className="text-2xl font-bold text-gray-700">
                  Registro efetuado
                </Text>
                <Text className="text-gray-700">Obrigado por registrar-se </Text>
                <Text className="text-gray-700">No crediário das Lojas Solar.</Text>
              </View>
              <View className='w-full'>
                <Text className="text-lg text-gray-500 font-medium mt-8 text-center">
                  Suas informações serão analisadas pela equipe das Lojas Solar e entraremos em contato.
                </Text>
              </View>
              <View className='w-full py-4'>
                <Button
                  onPress={() => router.replace('/account')}
                  label={'Continuar'}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
}