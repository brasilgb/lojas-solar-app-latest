import { View, Text, Image } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { BanknoteArrowDownIcon } from 'lucide-react-native';

export default function CashbackRequested() {
    const params = useLocalSearchParams();

    return (
        <ScreenLayout backgroundColor="bg-solar-blue-primary">
            <View className="flex-1 bg-white rounded-t-3xl p-6 justify-between">

                <PageHeader
                    title="Cashback"
                    subtitle="Solicitação realizada"
                    description=""
                    icon={<BanknoteArrowDownIcon size={26} color="#1a9cd9" />}
                />

                <View className="flex-1 items-center justify-center">

                    <View className="bg-green-100 rounded-full p-4 mb-4">
                        <BanknoteArrowDownIcon size={40} color="#16a34a" />
                    </View>

                    <Text className="text-xl font-semibold text-gray-800 text-center">
                        Cashback solicitado com sucesso
                    </Text>

                    <Text className="text-sm text-gray-500 text-center mt-2 px-6">
                        Seu pedido foi enviado para processamento
                    </Text>

                    <View className="bg-gray-100 rounded-2xl px-6 py-4 mt-6 items-center">
                        <Text className="text-xs text-gray-500">
                            Número do pedido
                        </Text>

                        <Text className="text-3xl font-bold text-solar-blue-secondary mt-1">
                            {params?.numpedido}
                        </Text>
                    </View>

                    <Text className="text-sm text-gray-500 text-center mt-6 px-6">
                        Dirija-se ao caixa para concluir a validação do cashback
                    </Text>
                </View>

                <Button
                    size="default"
                    label="Continuar"
                    onPress={() => router.replace('/cashback')}
                />

            </View>
        </ScreenLayout>
    );
}
