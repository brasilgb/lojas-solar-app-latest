import React from 'react';
import { View, Text, Platform, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from './Button';

const VerifyVersion = ({ route }: any) => {
  const { data } = route.params;

  const handlerVersioning = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.loja.solar',
      );
    }

    if (Platform.OS === 'ios') {
      Linking.openURL(
        'https://apps.apple.com/br/app/loja-solar/id6468680373',
      );
    }
  };

  return (
    <View
      className="absolute top-0 right-0 bottom-0 left-0 bg-white justify-between"
      style={{ zIndex: 1000 }}
    >
      {/* Conteúdo */}
      <View className="flex-1 justify-center items-center px-8">

        <FontAwesome
          name="gears"
          size={90}
          color="#bccf00"
        />

        <Text className="text-2xl font-bold text-solar-blue-secondary text-center mt-6">
          Nova versão disponível
        </Text>

        <Text className="text-base text-solar-blue-dark text-center mt-4">
          Atualize o aplicativo para continuar utilizando todos os recursos com segurança.
        </Text>

        {/* Versões */}
        <View className="bg-gray-100 rounded-xl px-6 py-4 mt-6 w-full">
          <Text className="text-sm text-gray-600 text-center">
            Versão atual: <Text className="font-semibold">{data.atual}</Text>
          </Text>

          <Text className="text-sm text-gray-600 text-center mt-1">
            Nova versão: <Text className="font-semibold">{data.nova}</Text>
          </Text>
        </View>
      </View>

      {/* Ação */}
      <View className="px-6 pb-10">
        <Button
          label="Atualizar aplicativo"
          onPress={handlerVersioning}
        />
      </View>
    </View>
  );
};

export default VerifyVersion;