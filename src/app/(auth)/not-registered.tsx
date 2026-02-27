import { Button } from '@/components/Button';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { router, useLocalSearchParams } from 'expo-router';
import { UserMinusIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

const NotRegistered = () => {
  const params = useLocalSearchParams();
  return (
    <ScreenLayout backgroundColor='bg-white'>
      <View className="flex-1 bg-gray-100 justify-center px-4">
        <View className="w-full bg-white rounded-2xl p-6">

          <View className="items-center mb-4">
            <View className="bg-blue-100 p-4 rounded-full">
              <UserMinusIcon size={32} color="#1a9cd9" />
            </View>
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            Usuário não registrado
          </Text>

          <Text className="text-sm text-gray-600 text-center leading-5 mb-4">
            Você ainda não possui um cadastro nas lojas solar
          </Text>

          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <Text className="text-sm text-gray-600 text-center">
              Você poderá efetuar seu cadastro aqui, e ter em sua
              mão todas as facilidades através de nosso
              aplicativo.
            </Text>
          </View>

          <View>
            <Button
              onPress={() =>
                router.push({
                  pathname: '/account',
                  params: {
                    cpfcnpj: params?.cpfcnpj,
                  },
                })
              }
              labelClasses="text-xl font-medium"
              label="Quero me cadastrar agora"
              variant="secondary"
            />
            <Button
              onPress={() => router.push('/')}
              label="Quero deixar para depois"
              variant="link"
              labelClasses="text-sm text-gray-600"
            />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

export default NotRegistered;
