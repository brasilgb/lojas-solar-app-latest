import { Button } from '@/components/Button';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { maskMoney } from '@/utils/mask';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { BanknoteArrowDownIcon, CalendarDaysIcon, RotateCcwIcon, SendIcon } from 'lucide-react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

function isCashbackAplicado(item: any) {
    return item?.pixgerado === true || Number(item?.pixgerado) === 1;
}

function pedidoKey(item: any) {
    return `${item?.numpedido}-${item?.filial}`;
}

export default function HistoryCashback() {
    const { user } = useAuth();
    const params = useLocalSearchParams<{
        credTotal?: string | string[];
        porcent?: string | string[];
    }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value: any) => setShow(value), []);
    const [pdvCustomer, setPdvCustomer] = useState<any>([]);

    // Solicitar cashback (pedidos ainda sem cashback aplicado)
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [cashbackSolicitado, setCashbackSolicitado] = useState<any>(null);
    const [applyCashback, setApplyCashback] = useState<any>(0);
    const [loadingSolicitar, setLoadingSolicitar] = useState(false);

    // Estornar cashback (pedidos com cashback já aplicado)
    const [activeEstornoOrder, setActiveEstornoOrder] = useState<any>(null);
    const [cashbackEstorno, setCashbackEstorno] = useState<any>(null);
    const [loadingEstorno, setLoadingEstorno] = useState(false);
    const [erroEstorno, setErroEstorno] = useState<string | undefined>(undefined);
    // Pedidos que o backend recusou estornar (ex: já possuem nota fiscal) —
    // ficam inativos na lista pra não deixar tentar de novo.
    const [pedidosEstornoBloqueados, setPedidosEstornoBloqueados] = useState<Set<string>>(new Set());

    const getPdvCustomer = useCallback(async () => {
        setLoading(true);
        setActiveOrder(null);
        setActiveEstornoOrder(null);
        setPedidosEstornoBloqueados(new Set());
        await appservice.post('(LISTA_PDV_CASHBACK)', {
            codcli: user?.codigoCliente,
            meschave: moment(date).format('M'),
            anochave: moment(date).format('YYYY'),
        })
            .then((response) => {
                const dados = response?.data?.resposta?.dados;
                setPdvCustomer(
                    Array.isArray(dados) ? dados : dados ? [dados] : [],
                );
            })
            .catch((error) => {
                console.log('error', error);
                setPdvCustomer([]);
            })
            .finally(() => setLoading(false));
    }, [user, date]);

    useEffect(() => {
        getPdvCustomer();
    }, [getPdvCustomer]);

    const credTotal = useMemo(
        () => Number(
            Array.isArray(params.credTotal) ? params.credTotal[0] : params.credTotal,
        ) || 0,
        [params.credTotal],
    );

    const pdvDisponivel = useMemo(
        () => pdvCustomer.filter((item: any) => !isCashbackAplicado(item)),
        [pdvCustomer],
    );
    const pdvAplicado = useMemo(
        () => pdvCustomer.filter((item: any) => isCashbackAplicado(item)),
        [pdvCustomer],
    );

    const onValueChange = useCallback(
        (event: any, newDate: any) => {
            const selectedDate = newDate || date;
            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );

    const handleSelectCachback = (id: any, item: any) => {
        setActiveOrder(id);
        setCashbackSolicitado(item);

        const porcent = Number(
            Array.isArray(params.porcent) ? params.porcent[0] : params.porcent,
        ) || 0;
        const total = Number(item?.total) || 0;
        const maxCashbach = (total * porcent) / 100;
        const aapplyCashback =
            credTotal >= maxCashbach
                ? maxCashbach
                : credTotal;
        setApplyCashback(aapplyCashback);
    };

    const handleCashbackRequest = async () => {
        setLoadingSolicitar(true);
        await appservice.post('(WS_GRAVA_CASHBACK)', {
            datped: moment(`${cashbackSolicitado.dtpedido}`).format(
                'YYYYMMDD',
            ),
            filped: cashbackSolicitado.filial,
            numped: cashbackSolicitado.numpedido,
            codcli: user?.codigoCliente,
            vlrcash: applyCashback,
        })
            .then(response => {
                setDate(new Date());
                router.push({
                    pathname: '/cashback-requested',
                    params: cashbackSolicitado,
                });
            })
            .catch(error => {
                console.log('error', error);
            })
            .finally(() => setLoadingSolicitar(false));
    };

    const handleSelectEstorno = (id: any, item: any) => {
        setActiveEstornoOrder(id);
        setCashbackEstorno(item);
        setErroEstorno(undefined);
    };

    const handleCashbackEstorno = async () => {
        setLoadingEstorno(true);
        setErroEstorno(undefined);
        await appservice.post('(WS_ESTORNA_CASHBACK)', {
            datped: moment(`${cashbackEstorno.dtpedido}`).format('YYYYMMDD'),
            filped: cashbackEstorno.filial,
            numped: cashbackEstorno.numpedido,
            codcli: user?.codigoCliente,
        })
            .then(async (response) => {
                const resposta = response?.data?.respesto;

                if (!resposta?.success) {
                    // Backend recusou (ex: "Pedido possui nota fiscal.") — o pedido
                    // não pode mais ser estornado, então trava ele na lista e
                    // mostra o motivo em vez de deixar tentar de novo.
                    setPedidosEstornoBloqueados(prev => {
                        const next = new Set(prev);
                        next.add(pedidoKey(cashbackEstorno));
                        return next;
                    });
                    setErroEstorno(resposta?.message || 'Não foi possível estornar este cashback.');
                    setActiveEstornoOrder(null);
                    setCashbackEstorno(null);
                    return;
                }

                setActiveEstornoOrder(null);
                setCashbackEstorno(null);
                await getPdvCustomer();
                router.push({
                    pathname: '/cashback-requested',
                    params: { ...cashbackEstorno, mode: 'estorno' },
                });
            })
            .catch(error => {
                console.log('error', error);
                setErroEstorno('Não foi possível estornar este cashback. Tente novamente.');
            })
            .finally(() => setLoadingEstorno(false));
    };

    function OrderCard({
        item,
        isSelected,
        onPress,
        badgeLabel,
        badgeBgClasses,
        badgeTextClasses,
        selectedBorderClasses,
        checkColor,
        disabled,
    }: {
        item: any;
        isSelected: boolean;
        onPress: () => void;
        badgeLabel: string;
        badgeBgClasses: string;
        badgeTextClasses: string;
        selectedBorderClasses: string;
        checkColor: string;
        disabled?: boolean;
    }) {
        const total = Number(item.total) || 0;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                disabled={disabled}
                onPress={onPress}
                className={`p-4 rounded-2xl mb-3 border ${isSelected
                    ? selectedBorderClasses
                    : disabled
                        ? 'border-gray-200 bg-gray-100 opacity-60'
                        : 'border-gray-200 bg-white'
                    }`}
            >
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-sm text-gray-500">
                            Pedido #{item.numpedido}
                        </Text>

                        <Text className="text-xs text-gray-400 mt-1">
                            {moment(`${item.dtpedido}`).format('DD/MM/YYYY')} • Filial {item.filial}
                        </Text>
                    </View>

                    <Text className="text-lg font-bold text-solar-blue-secondary">
                        R$ {maskMoney(total.toFixed(2))}
                    </Text>
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                    <View className={`px-2 py-1 rounded-md ${badgeBgClasses}`}>
                        <Text className={`text-xs ${badgeTextClasses}`}>{badgeLabel}</Text>
                    </View>

                    {isSelected && (
                        <MaterialCommunityIcons name="check-circle" size={22} color={checkColor} />
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-4 gap-2'>

                <PageHeader
                    title="Cashback"
                    subtitle="Histórico de cashback"
                    description="Histórico de pedidos para solicitação de cashback."
                    icon={<BanknoteArrowDownIcon size={26} color="#1a9cd9" />}
                />

                {show && (
                    <MonthPicker
                        onChange={onValueChange}
                        value={date}
                        maximumDate={new Date()}
                        locale="pt"
                        okButton="Ok"
                        cancelButton="Cancelar"
                    />
                )}

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24, gap: 16 }}
                >
                    <TouchableOpacity
                        onPress={() => showPicker(true)}
                        className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    >
                        <Text className="text-base font-medium text-gray-700 capitalize">
                            {moment(date).locale('pt-br').format('MMMM [de] YYYY')}
                        </Text>

                        <CalendarDaysIcon size={22} color="#F99F1E" />
                    </TouchableOpacity>

                    {loading && (
                        <View className="items-center py-6">
                            <ActivityIndicator color="#1a9cd9" />
                        </View>
                    )}

                    {!loading && (
                        <>
                            {/* SOLICITAR CASHBACK */}
                            <View className="bg-white border border-gray-200 rounded-2xl p-4">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <View className="bg-green-100 p-2 rounded-full">
                                        <SendIcon size={16} color="#16a34a" />
                                    </View>
                                    <Text className="text-base font-semibold text-gray-800">
                                        Solicitar cashback
                                    </Text>
                                </View>

                                <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                                    <Text className="text-sm text-gray-500">
                                        Cashback disponível
                                    </Text>

                                    <Text className="text-2xl font-bold mt-1 text-solar-green-primary">
                                        R$ {maskMoney(Number(activeOrder !== null ? applyCashback : credTotal).toFixed(2))}
                                    </Text>
                                </View>

                                <Text className="text-xs text-gray-500 mb-3">
                                    {pdvDisponivel.length > 0
                                        ? 'Toque em um pedido disponível para solicitar o cashback'
                                        : 'Nenhum pedido disponível para solicitar cashback neste mês'}
                                </Text>

                                {pdvDisponivel.map((item: any, index: number) => (
                                    <OrderCard
                                        key={`disp-${item.numpedido}-${item.filial}-${index}`}
                                        item={item}
                                        isSelected={activeOrder === index}
                                        onPress={() => handleSelectCachback(index, item)}
                                        badgeLabel="Disponível"
                                        badgeBgClasses="bg-green-100"
                                        badgeTextClasses="text-green-700"
                                        selectedBorderClasses="border-solar-green-primary bg-green-50"
                                        checkColor="#16a34a"
                                    />
                                ))}

                                {activeOrder !== null && (
                                    <Button
                                        label={loadingSolicitar ? <ActivityIndicator color="white" size="small" /> : 'Solicitar Cashback'}
                                        onPress={handleCashbackRequest}
                                        disabled={loadingSolicitar}
                                        className="mt-1"
                                    />
                                )}
                            </View>

                            {/* ESTORNAR CASHBACK */}
                            <View className="bg-white border border-gray-200 rounded-2xl p-4">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <View className="bg-red-100 p-2 rounded-full">
                                        <RotateCcwIcon size={16} color="#dc2626" />
                                    </View>
                                    <Text className="text-base font-semibold text-gray-800">
                                        Estornar cashback
                                    </Text>
                                </View>

                                <Text className="text-xs text-gray-500 mb-3">
                                    {pdvAplicado.length > 0
                                        ? 'Toque em um pedido com cashback aplicado para estornar'
                                        : 'Nenhum pedido com cashback aplicado neste mês'}
                                </Text>

                                {pdvAplicado.map((item: any, index: number) => {
                                    const bloqueado = pedidosEstornoBloqueados.has(pedidoKey(item));

                                    return (
                                        <OrderCard
                                            key={`apl-${item.numpedido}-${item.filial}-${index}`}
                                            item={item}
                                            isSelected={activeEstornoOrder === index}
                                            onPress={() => handleSelectEstorno(index, item)}
                                            disabled={bloqueado}
                                            badgeLabel={bloqueado ? 'Não é possível estornar' : 'Cashback aplicado'}
                                            badgeBgClasses="bg-gray-200"
                                            badgeTextClasses="text-gray-500"
                                            selectedBorderClasses="border-solar-red-primary bg-red-50"
                                            checkColor="#dc2626"
                                        />
                                    );
                                })}

                                {erroEstorno && (
                                    <Text className="text-sm text-solar-red-primary mb-2">
                                        {erroEstorno}
                                    </Text>
                                )}

                                {activeEstornoOrder !== null && (
                                    <Button
                                        variant="destructive"
                                        label={loadingEstorno ? <ActivityIndicator color="white" size="small" /> : 'Estornar Cashback'}
                                        onPress={handleCashbackEstorno}
                                        disabled={loadingEstorno}
                                        className="mt-1"
                                    />
                                )}
                            </View>
                        </>
                    )}
                </ScrollView>
            </View>
        </ScreenLayout>
    );
};
