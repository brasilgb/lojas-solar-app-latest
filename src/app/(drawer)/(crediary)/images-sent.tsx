import { View, Text, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { User2Icon, UserMinus2Icon } from 'lucide-react-native';
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
                <UserMinus2Icon size={60} color={'#1a9cd9'} />
              </View>
              <View className="bg-white rounded-xl px-4 pb-4 flex-col justify-center items-center">
                <Text className="text-2xl font-bold text-gray-700">
                  Remoção de dados
                </Text>
                <Text className="text-gray-700">Nossa equipe proceguirá com o </Text>
                <Text className="text-gray-700">processo para a exclusão de dados.</Text>
              </View>
              <View className='w-full'>
                <Text className="text-lg text-gray-500 font-medium mt-8 text-center">
                  Aguarde nosso e-mail ou ligação para prosseguir com o
                  processo de exclusão de dados.
                </Text>
                <Text className="mt-8 text-lg text-gray-500 font-medium text-center">Seu e-mail para contato {params?.email}</Text>
              </View>
              <View className='w-full py-4'>
                <Link href={'/account'} asChild>
                  <Button
                    label={'Continuar'}
                  />
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
}