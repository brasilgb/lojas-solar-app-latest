import { View, Text } from 'react-native';
import React from 'react';
import { CheckCircleIcon } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';

const CardBillPaid = () => {
    const params = useLocalSearchParams();

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl px-6 pt-10 pb-8 flex-col justify-between'>

                {/* PARTE SUPERIOR: Ícone e Título Principal */}
                <View className="items-center">
                    <CheckCircleIcon size={80} color="#22c55e" />
                    <Text className="text-2xl font-bold text-gray-800 mt-4">
                        Pagamento Aprovado!
                    </Text>
                    <Text className="text-base text-gray-500 text-center mt-2">
                        Sua cobrança foi processada com sucesso.
                    </Text>
                </View>

                {/* PARTE CENTRAL: O "Recibo" da Transação */}
                <View className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 my-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-500 text-base">Valor total</Text>
                        <Text className="text-gray-800 text-lg font-bold">{params?.value}</Text>
                    </View>

                    {/* Linha divisória */}
                    <View className="h-[1px] bg-gray-200 w-full mb-4" />

                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-500 text-sm">Método</Text>
                        <Text className="text-gray-800 text-sm font-medium">Cartão de Crédito</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-500 text-sm">Cartão</Text>
                        <Text className="text-gray-800 text-sm font-medium">Final •••• {params?.lastCardNumber}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-500 text-sm">Data</Text>
                        <Text className="text-gray-800 text-sm font-medium">{params?.dateTransaction}</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-500 text-sm">ID da Transação</Text>
                        <Text className="text-gray-800 text-sm font-medium">{params?.payamentId}</Text>
                    </View>
                </View>

                {/* PARTE INFERIOR: Botões de Ação */}
                <View className="w-full gap-3 mt-auto">

                    <Button
                        size="lg"
                        label="Concluído"
                        className="w-full"
                        onPress={() => router.replace('/payment')}
                    />
                </View>

            </View>
        </ScreenLayout>
    );
};

export default CardBillPaid;
