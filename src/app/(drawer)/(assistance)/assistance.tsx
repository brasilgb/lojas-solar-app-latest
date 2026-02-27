import { Card, CardContent, CardHeader } from '@/components/Card';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { WrenchIcon } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Protocol = {
  nProtocolo: string;
  produto: string;
  [key: string]: any;
};

const AssistanceProtocol = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [protocols, setProtocols] = useState<Protocol[]>([]);

  const getProtocols = useCallback(async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const response = await appservice.get(
        `(WS_PROTOCOLO_ASSISTENCIA)?token=${user.token}`
      );

      const { data } = response.data.resposta;
      setProtocols(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

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
      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 mx-2">
        <CardHeader className="border-b border-gray-200 mb-3 pb-2">
          <Text className="text-lg font-bold text-gray-700">
            Protocolo {item.nProtocolo}
          </Text>
        </CardHeader>

        <CardContent>
          <Text className="text-gray-600">
            {item.produto}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );

  return (
    <ScreenLayout backgroundColor="bg-solar-blue-primary">
      <View className="flex-1 bg-white rounded-t-3xl p-6">

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
            estimatedItemSize={20}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onRefresh={getProtocols}
            refreshing={loading}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              !loading ? (
                <View className="items-center">
                  <Text className="text-gray-400">
                    Nenhum protocolo encontrado
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default AssistanceProtocol;
