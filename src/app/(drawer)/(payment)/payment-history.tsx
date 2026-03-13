import AppDateTimePicker from '@/components/AppDateTimePicker';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { maskMoney } from '@/utils/mask';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';

const PaymentHistory = () => {
    const { user } = useAuth();
    const [crediarios, setCrediarios] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    let dataAtual = new Date();
    let dataAnterior = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() - 6,
        dataAtual.getDate(),
    );
    const [dateIni, setDateIni] = useState(dataAnterior);
    const [dateFin, setDateFin] = useState(dataAtual);

    const getCrediarios = async () => {
        setLoading(true);
        await appservice
            .get(
                `(WS_CARREGA_CREDIARIO)?token=${user?.token}&tipo=H&dataInicial=${moment(
                    dateIni,
                ).format('YYYYMMDD')}&dataFinal=${moment(dateFin).format(
                    'YYYYMMDD',
                )}`,
            )
            .then(response => {
                const { success, message, token, data } = response.data.resposta;
                setLoading(false);
                setCrediarios(data.historico);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getCrediarios();
        }, []),
    );

    const RenderItem = ({ item }: any) => {
        return ( 
            <View className="flex-row items-center justify-between mx-1 bg-white border-gray-200 p-4 mb-3 shadow-sm px-4 py-4 my-2 rounded-2xl border">
                <View className="flex-row items-center justify-center w-full">
                    <View className="flex-1 flex-col items-start">
                        <View className="flex-row">
                            <View className="w-3/5 pl-2">
                                <Text className="text-sm font-normal pb-1">
                                    Parcela da compra
                                </Text>
                                <Text className="text-lg font-medium">
                                    {item?.numeroCarne}
                                </Text>
                                <Text className="text-sm font-normal">
                                    {item?.pagamento}
                                </Text>
                            </View>
                            <View className="w-2/5 flex items-center justify-between">
                                <View />
                                <View className="flex items-end">
                                    <Text className="text-base font-normal pt-1">
                                        Parcela {item?.parcela}
                                    </Text>
                                    <Text className="text-xl font-Poppins_700Bold font-semibold mt-2 text-solar-blue-dark">
                                        R${' '}
                                        {maskMoney(
                                            parseFloat(item?.vPago).toFixed(2),
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const totalCrediario = crediarios
        ?.reduce(
            (total: any, valor: any) => (total += parseFloat(valor.vPago)),
            0,
        )
        .toFixed(2);

    return (
        <>
            <View className="mt-4">

                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-400 mb-1">
                            Data inicial
                        </Text>
                        <AppDateTimePicker value={dateIni} onChange={setDateIni} />
                    </View>

                    <View className="flex-1">
                        <Text className="text-xs text-gray-400 mb-1">
                            Data final
                        </Text>
                        <AppDateTimePicker value={dateFin} onChange={setDateFin} />
                    </View>
                </View>
            </View>

            {crediarios && crediarios.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <Image
                        source={require('@/assets/images/no_payments_logo.png')}
                        className="w-[160px] h-[130px]"
                    />

                    <Text className="text-lg font-semibold text-solar-blue-secondary mt-4 text-center">
                        Nenhum pagamento encontrado
                    </Text>

                    <Text className="text-sm text-gray-500 mt-2 text-center">
                        Tente ajustar o período para visualizar outros pagamentos.
                    </Text>
                </View>
            ) : (
                <View className="flex-1 mt-4">

                    <View className="bg-solar-blue-primary rounded-2xl p-4 flex-row justify-between items-center">
                        <View>
                            <Text className="text-xs text-white/70">
                                Total no período
                            </Text>
                            <Text className="text-xl font-bold text-white mt-1">
                                R$ {maskMoney(totalCrediario)}
                            </Text>
                        </View>
                    </View>

                    <FlashList
                        data={crediarios}
                        renderItem={RenderItem}
                        keyExtractor={(item: any) =>
                            item.numeroCarne + item.parcela
                        }
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        onRefresh={getCrediarios}
                        refreshing={loading}
                        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
                    />
                </View>
            )}
        </>
    );
};

export default PaymentHistory;
