import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { CreditCardIcon, HandCoinsIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { maskMoney } from '@/utils/mask';
import { PageHeader } from '@/components/PageHeader';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';

const methods = () => {
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);

    const { dataOrder, totalAmount } = params;
    const order = JSON.parse(dataOrder as any);
    const mtoken = user?.token;

    const pixPaymentMethod = async () => {
        setLoading(true);
        try {
            const response = await appservice.post('(WS_ORDEM_PAGAMENTO)', {
                token: `${mtoken}`,
                valor: totalAmount,
                parcela: order,
                tipoPagamento: 4,
                validaDados: 'S',
                dadosCartao: {
                    numeroCartao: '',
                    nomeCartao: '',
                    validadeCartao: '',
                    cvvCartao: '',
                },
            });
            const { success, message, data, token } = response.data.resposta;

            router.push({
                pathname: '/(drawer)/(payment)/pixpayment',
                params: { valueOrder: totalAmount },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-6'>
                <PageHeader
                    title="Pagamento"
                    subtitle="Métodos de pagamento"
                    description="Escolha como deseja pagar."
                    icon={<HandCoinsIcon size={26} color="#1a9cd9" />}
                />

                <View className="flex-1 bg-white rounded-t-3xl px-5 py-6 mt-4">

                    <View className="items-center mb-6">
                        <Text className="text-sm text-gray-400">
                            Total a pagar
                        </Text>

                        <Text className="text-4xl font-extrabold text-solar-blue-secondary mt-1">
                            R$ {maskMoney(parseFloat(totalAmount as string).toFixed(2))}
                        </Text>
                    </View>

                    <Text className="text-lg font-semibold text-gray-700 mb-4">
                        Escolha a forma de pagamento
                    </Text>

                    <View className="gap-4">

                        <TouchableOpacity
                            onPress={pixPaymentMethod}
                            className="flex-row items-center justify-between bg-gray-100 p-4 rounded-2xl active:opacity-70"
                        >
                            <View className="flex-row items-center gap-4 h-10">
                                <Image
                                    source={require('@/assets/images/pix.png')}
                                    className="w-10 h-10"
                                />
                                <Text className="text-base font-semibold text-gray-800">
                                    PIX
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/(drawer)/(payment)/cartpayment',
                                    params: {
                                        dataOrder: JSON.stringify(order),
                                        totalAmount: totalAmount,
                                    },
                                })
                            }
                            className="flex-row items-center justify-between bg-gray-100 p-4 rounded-2xl active:opacity-70"
                        >
                            <View className="flex-row items-center gap-4 h-10">
                                <CreditCardIcon size={32} color="#0d3b85" />
                                <Text className="text-base font-semibold text-gray-800">
                                    Cartão de crédito
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

export default methods;
