import { View, Text, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { HistoryIcon } from 'lucide-react-native'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import appservice from '@/services/appservice'
import { maskMoney } from '@/utils/mask'

export default function HistoryItems() {
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [historicoItems, setHistoricoItems] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getHistoricoItems = async () => {
            setLoading(true);
            await appservice
                .get(
                    `(WS_HISTORICO_ITENS)?token=${user?.token}&numero=${params?.numero}&filial=${params?.filial}&serie=${params?.serie}`,
                )
                .then(response => {
                    const { success, message, data } = response.data.resposta;
                    setLoading(false);
                    setHistoricoItems(data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getHistoricoItems();
    }, [user]);

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-6'>
                <PageHeader
                    title="Histórico"
                    subtitle="Detalhes da compras"
                    description={<Text>Detalhes da compra N°: <Text className='font-bold'>{params?.numero}</Text> de <Text className='font-bold'>{params?.data}</Text> com o valor total de <Text className='font-bold'>R$ {params?.valor}</Text></Text>}
                    icon={<HistoryIcon size={26} color="#1a9cd9" />}
                />
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >

                    {historicoItems?.map((item: any, index: number) => (
                        <View
                            key={index}
                            className="flex-row items-center bg-white my-2 p-3 rounded-2xl border border-gray-200 shadow-sm"
                        >

                            <Image
                                source={{ uri: item?.linkImagem }}
                                className="h-24 w-24 rounded-xl border border-gray-200 bg-gray-50/80"
                                resizeMode="cover"
                            />

                            <View className="flex-1 ml-3 justify-between">

                                <Text
                                    className="text-base font-semibold text-gray-800"
                                    numberOfLines={2}
                                >
                                    {item?.descricao}
                                </Text>

                                <Text className="text-sm text-gray-500 mt-1">
                                    {parseInt(item?.quantidade)} un × R${' '}
                                    {maskMoney(
                                        String(parseFloat(item?.unitario).toFixed(2))
                                    )}
                                </Text>

                                <Text className="text-lg font-bold text-solar-blue-secondary mt-2">
                                    R$ {maskMoney(item?.total)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScreenLayout>
    )
}