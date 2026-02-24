import { View, Text, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { HandshakeIcon, ImagePlusIcon, User2Icon, UserMinus2Icon } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function ImagesSent() {

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

          <View className="flex-1 bg-gray-100 justify-center px-4">
            <View className="w-full bg-white rounded-2xl p-6">

              <View className="items-center mb-4">
                <View className="bg-blue-100 p-4 rounded-full">
                  <HandshakeIcon size={32} color="#1a9cd9" />
                </View>
              </View>

              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                Registro efetuado
              </Text>

              <Text className="text-sm text-gray-600 text-center leading-5 mb-4">
                Obrigado por registrar-se no crediário das Lojas Solar.
              </Text>

              <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <Text className="text-sm text-gray-600 text-center">
                  Suas informações serão analisadas pela equipe das Lojas Solar e entraremos em contato.
                </Text>
              </View>

              <Text className="text-sm text-gray-500 text-center mb-6">
              </Text>

              <Button
                onPress={() => router.replace('/crediary')}
                label="Continuar"
                className="w-full py-3 rounded-lg"
                labelClasses="text-white font-semibold"
              />

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
}