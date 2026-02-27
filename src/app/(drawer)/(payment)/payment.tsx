import { Button } from '@/components/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { CheckIcon, ClockIcon, HandCoinsIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaymentHistory from './payment-history';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { maskMoney } from '@/utils/mask';
import { PageHeader } from '@/components/PageHeader';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';

const OpenPayments = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const mtoken = user?.token;
    const [crediarios, setCrediarios] = useState<any>([]);
    const [selectedPayments, setSelectedPayments] = useState<any>([]);
    const [isAllChecked, setAllChecked] = useState(false);

    const getCrediarios = async () => {
        setAllChecked(false);
        setSelectedPayments([]);
        setLoading(true);
        await appservice
            .get(`(WS_CARREGA_CREDIARIO)?token=${mtoken}`)
            .then((response: any) => {
                const { data } = response.data.resposta;
                setCrediarios(data.aberto || []); // Ensure crediarios is always an array
            })
            .catch((error: any) => {
                // Interceptor will show an alert and redirect.
                console.log('Failed to load crediarios:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getCrediarios();
        }, []),
    );

    // Lidar com a seleção de um único pagamento
    const handleSelectPayment = (payment: any) => {
        setSelectedPayments((prevSelected: any) => {
            const isSelected = prevSelected.some(
                (p: any) =>
                    p.numeroCarne === payment.numeroCarne &&
                    p.parcela === payment.parcela,
            );
            if (isSelected) {
                return prevSelected.filter(
                    (p: any) =>
                        !(
                            p.numeroCarne === payment.numeroCarne &&
                            p.parcela === payment.parcela
                        ),
                );
            } else {
                return [...prevSelected, payment];
            }
        });
    };

    // Lidar com a seleção de todos os pagamentos
    const handleSelectAll = () => {
        if (isAllChecked) {
            setSelectedPayments([]);
        } else {
            const allSelectable = crediarios.filter(
                (c: any) => c.status !== 'P',
            );
            setSelectedPayments(allSelectable);
        }
    };

    // Sincronizar o estado de 'isAllChecked' com as seleções
    useEffect(() => {
        const allSelectable = crediarios.filter((c: any) => c.status !== 'P');
        if (
            allSelectable.length > 0 &&
            selectedPayments.length === allSelectable.length
        ) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [selectedPayments, crediarios]);

    // Calcular totais dos pagamentos selecionados
    const { totalAmount, installmentsCount } = useMemo(() => {
        const total = selectedPayments.reduce(
            (acc: any, payment: any) => acc + parseFloat(payment.total),
            0,
        );
        return {
            totalAmount: total,
            installmentsCount: selectedPayments.length,
        };
    }, [selectedPayments]);

    const RenderItem = ({ crediario }: any) => {
        const isSelected = selectedPayments.some(
            (p: any) =>
                p.numeroCarne === crediario.numeroCarne &&
                p.parcela === crediario.parcela,
        );

        return (
            <TouchableOpacity
                onPress={() => handleSelectPayment(crediario)}
                disabled={crediario.status === 'P'}
                className={`flex-row items-center justify-between px-4 py-4 my-2 rounded-2xl border ${isSelected
                    ? 'border-solar-orange-primary bg-orange-50'
                    : 'border-gray-200 bg-white'
                    } active:opacity-80`}
            >

                {/* CHECK / STATUS */}
                <View className="mr-3">
                    {crediario.status === 'P' ? (
                        <ClockIcon size={22} color="#5d71af" />
                    ) : (
                        <View
                            className={`h-6 w-6 rounded-full border-2 items-center justify-center ${isSelected
                                ? 'bg-solar-orange-primary border-solar-orange-primary'
                                : 'border-gray-400'
                                }`}
                        >
                            {isSelected && <CheckIcon size={16} color="white" />}
                        </View>
                    )}
                </View>

                {/* CONTEÚDO */}
                <View className="flex-1">

                    {/* LINHA 1 */}
                    <View className="flex-row justify-between items-center">
                        <Text className="text-base font-semibold text-gray-800">
                            Parcela {crediario.parcela.replace('/', ' de ')}
                        </Text>

                        {/* BADGE */}
                        {crediario.status === 'P' ? (
                            <View className="bg-solar-violet px-2 py-1 rounded-full">
                                <Text className="text-xs text-white font-medium">
                                    Processando
                                </Text>
                            </View>
                        ) : crediario.atraso > 0 ? (
                            <View className="bg-red-500 px-2 py-1 rounded-full">
                                <Text className="text-xs text-white font-medium">
                                    Atrasada
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {/* LINHA 2 */}
                    <Text className="text-sm text-gray-500 mt-1">
                        Contrato {crediario.numeroCarne}
                    </Text>

                    {/* LINHA 3 */}
                    <Text className="text-sm text-gray-500">
                        Vence em {crediario.vencimento}
                    </Text>

                    {/* VALORES */}
                    <View className="flex-row justify-between items-end mt-3">

                        <View>
                            {crediario.acrescimo > 0 && (
                                <Text className="text-xs text-red-500">
                                    + Juros R$ {maskMoney(crediario.acrescimo)}
                                </Text>
                            )}
                        </View>

                        <Text className="text-xl font-bold text-solar-blue-dark">
                            R$ {maskMoney(crediario.total)}
                        </Text>

                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    const FooterPaymentTotal = () => (
        <View
            className="absolute bottom-0 left-0 right-0 bg-solar-blue-primary px-4 pt-4 pb-6 border-t border-white/10"
            style={{
                elevation: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
            }}
        >

            {/* RESUMO */}
            <View className="mb-4">
                <Text className="text-sm text-white/70">
                    {installmentsCount}{' '}
                    {installmentsCount > 1
                        ? 'parcelas selecionadas'
                        : 'parcela selecionada'}
                </Text>

                <Text className="text-3xl font-extrabold text-white mt-1">
                    R$ {maskMoney(String((totalAmount || 0).toFixed(2)))}
                </Text>
            </View>

            {/* BOTÃO FULL WIDTH */}
            <Button
                size="lg"
                variant="secondary"
                label={`Pagar agora`}
                className="w-full"
                onPress={() =>
                    router.push({
                        pathname: '/methods',
                        params: {
                            dataOrder: JSON.stringify(selectedPayments),
                            totalAmount: totalAmount,
                        },
                    })
                }
            />

        </View>
    );

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-6'>

                <PageHeader
                    title="Pagamentos"
                    subtitle="Gerencie seus pagamentos"
                    description="Selecione cobranças em aberto ou consulte seu histórico."
                    icon={<HandCoinsIcon size={26} color="#1a9cd9" />}
                />

                <View className="bg-white rounded-t-3xl flex-1 mt-4">

                    <Tabs defaultValue="opened">

                        <TabsList className="px-4 pt-4">
                            <TabsTrigger id="opened" title="Em aberto" value="opened" />
                            <TabsTrigger id="history" title="Histórico" value="history" />
                        </TabsList>

                        <TabsContent value="opened" className="flex-1 border-0">

                            <View className="flex-1 px-4">

                                <View className="mt-4 mb-2">
                                    <Text className="text-sm text-gray-400">
                                        {crediarios.length} pagamentos em aberto
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    className="flex-row items-center justify-between bg-gray-100 p-4 rounded-2xl mt-2 active:opacity-70"
                                    onPress={handleSelectAll}
                                >
                                    <View className="flex-row items-center">
                                        <View
                                            className={`h-6 w-6 items-center justify-center rounded-full border-2 border-solar-orange-primary ${isAllChecked
                                                ? 'bg-solar-orange-primary'
                                                : 'bg-transparent'
                                                }`}
                                        >
                                            {isAllChecked && (
                                                <CheckIcon size={18} color="white" />
                                            )}
                                        </View>

                                        <Text className="ml-3 text-base font-medium text-gray-700">
                                            Selecionar todos
                                        </Text>
                                    </View>

                                    {installmentsCount > 0 && (
                                        <Text className="text-sm text-solar-blue-primary font-semibold">
                                            {installmentsCount} selecionados
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <FlashList
                                    data={crediarios}
                                    renderItem={({ item }) => (
                                        <RenderItem crediario={item} />
                                    )}
                                    keyExtractor={(item: any) =>
                                        item.numeroCarne + item.parcela
                                    }
                                    extraData={selectedPayments}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 120 }}
                                    keyboardShouldPersistTaps="always"
                                    onRefresh={getCrediarios}
                                    refreshing={loading}
                                />

                            </View>
                        </TabsContent>
                        <TabsContent value="history" className="flex-1 border-0">
                            <PaymentHistory />
                        </TabsContent>
                    </Tabs>
                </View>
            </View>
            {installmentsCount > 0 && (
                <FooterPaymentTotal />
            )}
        </ScreenLayout>
    );
};

export default OpenPayments;
