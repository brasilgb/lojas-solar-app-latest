import { Button } from '@/components/Button';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Link, useLocalSearchParams } from 'expo-router';
import { UserMinus2Icon } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

export default function DataAnalise() {
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

          <View className="flex-1 bg-gray-100 justify-center px-4">
            <View className="w-full bg-white rounded-2xl p-6">

              <View className="items-center mb-4">
                <View className="bg-blue-100 p-4 rounded-full">
                  <UserMinus2Icon size={32} color="#1a9cd9" />
                </View>
              </View>

              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                Remoção de dados
              </Text>

              <Text className="text-sm text-gray-600 text-center leading-5 mb-4">
                Nossa equipe iniciará o processo de exclusão dos seus dados.
              </Text>

              <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <Text className="text-sm text-gray-600 text-center">
                  Aguarde nosso contato por e-mail ou telefone para dar continuidade ao processo.
                </Text>
              </View>

              <Text className="text-sm text-gray-500 text-center mb-6">
                Seu e-mail para contato:
                <Text className="text-gray-900 font-medium"> {params?.email}</Text>
              </Text>

              <Link href="/account" asChild>
                <Button
                  label="Continuar"
                  className="w-full py-3 rounded-lg"
                  labelClasses="text-white font-semibold"
                />
              </Link>

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
}