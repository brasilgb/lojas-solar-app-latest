import { Card, CardContent, CardHeader } from '@/components/Card';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { WrenchIcon } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

type Protocol = {
  nProtocolo: string;
  produto: string;
  dtEmissao?: string;
  [key: string]: any;
};

const AssistanceProtocol = () => {
  const { user, expiredSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [protocols, setProtocols] = useState<Protocol[]>([]);

  const getProtocols = useCallback(async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await appservice.get(
        `(WS_PROTOCOLO_ASSISTENCIA)?token=${user.token}`
      );

      const { data, token, message } = response.data?.resposta ?? {};
      if (!token) {
        Alert.alert('Atenção', message, [
          {
            text: 'Ok',
            onPress: () => {
              expiredSession();
            },
          },
        ]);
        return;
      }

      setProtocols(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.log(error);
      setProtocols([]);
    } finally {
      setLoading(false);
    }
  }, [user?.token, expiredSession]);

  useFocusEffect(
    useCallback(() => {
      getProtocols();
    }, [getProtocols]),
  );

  const renderItem = ({ item }: { item: Protocol }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(drawer)/(assistance)/assistance-detail',
          params: item,
        })
      }
    >
      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
        <CardHeader className="border-b border-gray-200 mb-3 pb-2">
          <Text className="text-lg font-bold text-gray-700">
            Protocolo {item.nProtocolo}
          </Text>
        </CardHeader>

        <CardContent>
          <Text className="text-gray-600">
            {item.produto}
          </Text>
          <Text className="mt-2 text-sm text-gray-400">
            Emissão: {item.dtEmissao || '-'}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );

  return (
    <ScreenLayout backgroundColor="bg-solar-blue-primary">
      <View className="flex-1 bg-white rounded-t-3xl p-4">

        <PageHeader
          title="Assistência Técnica"
          subtitle="Equipamentos enviados a garantia"
          description="Aqui consta todos os seus equipamentos enviados para garantia."
          icon={<WrenchIcon size={26} color="#1a9cd9" />}
        />
        <View className='flex-1 mt-4'>
          <FlashList
            data={protocols}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.nProtocolo?.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onRefresh={getProtocols}
            refreshing={loading && protocols.length > 0}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              loading ? (
                <View className="items-center py-12">
                  <ActivityIndicator size="large" color="#1a9cd9" />
                  <Text className="mt-3 text-gray-500">Carregando protocolos...</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-gray-400">
                    Nenhum protocolo encontrado
                  </Text>
                </View>
              )
            }
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default AssistanceProtocol;
