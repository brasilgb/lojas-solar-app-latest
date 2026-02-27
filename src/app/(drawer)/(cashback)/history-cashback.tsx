import { Button } from '@/components/Button';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { maskMoney } from '@/utils/mask';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { BanknoteArrowDownIcon, CalendarDaysIcon } from 'lucide-react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

export default function HistoryCashback() {
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [cashbackSolicitado, setCashbackSolicitado] = useState<any>([]);
    const [applyCashback, setApplyCashback] = useState<any>(0);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value: any) => setShow(value), []);
    const [pdvCustomer, setPdvCustomer] = useState<any>([]);

    useEffect(() => {
        const getPdvCustomer = async () => {
            setLoading(true);
            setActiveOrder(null);
            await appservice.post('(LISTA_PDV_CASHBACK)', {
                codcli: user?.codigoCliente,
                meschave: moment(date).format('M'),
                anochave: moment(date).format('YYYY'),
            })
                .then((response) => {
                    setPdvCustomer(response.data.resposta.dados);
                })
                .catch((error) => {
                    console.log('error', error);
                })
                .finally(() => setLoading(false));
        };
        getPdvCustomer();
    }, [user, date]);

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

        let maxCashbach: number = ((item?.total * Number(params?.porcent)) /
            100) as number;
        const aapplyCashback =
            Number(params?.credTotal) >= Number(maxCashbach)
                ? maxCashbach
                : params?.credTotal;
        setApplyCashback(aapplyCashback);
    };

    const handleCashbackRequest = async () => {
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
            });
    };

    const renderItem = ({ item, index }: any) => {
        const isSelected = activeOrder === index;
        const isDisabled = item.pixgerado;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                disabled={isDisabled}
                onPress={() => handleSelectCachback(index, item)}
                className={`p-4 rounded-2xl mb-3 border ${isSelected
                    ? 'border-solar-green-primary bg-green-50'
                    : 'border-gray-200 bg-white'
                    } ${isDisabled ? 'opacity-50' : ''}`}
            >

                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-sm text-gray-500">
                            Pedido #{item.numpedido}
                        </Text>

                        <Text className="text-xs text-gray-400 mt-1">
                            {moment(item.dtpedido).format('DD/MM/YYYY')} • Filial {item.filial}
                        </Text>
                    </View>

                    <Text className="text-lg font-bold text-solar-blue-secondary">
                        R$ {maskMoney(item.total.toFixed(2))}
                    </Text>
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                    <View
                        className={`px-2 py-1 rounded-md ${isDisabled ? 'bg-gray-200' : 'bg-green-100'
                            }`}
                    >
                        <Text
                            className={`text-xs ${isDisabled ? 'text-gray-500' : 'text-green-700'
                                }`}
                        >
                            {isDisabled ? 'Em análise' : 'Disponível'}
                        </Text>
                    </View>

                    {isSelected && (
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={22}
                            color="#16a34a"
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const PdvList = () => {
        return <FlashList data={pdvCustomer} renderItem={renderItem} />;
    };

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-6'>

                <PageHeader
                    title="Cashback"
                    subtitle="Histórico de cashback"
                    description="Histórico de pedidos para solicitação de cashback."
                    icon={<BanknoteArrowDownIcon size={26} color="#1a9cd9" />}
                />

                <View className="flex-1 p-4 bg-gray-100 rounded-3xl h-full gap-4 mt-4">
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

                    <View className="px-2 flex-1">
                        <View className="flex-1 py-4 w-full">
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
                                    <Text className="text-base font-medium text-gray-700 pr-2">
                                        {moment(date).locale('pt-br').format('MMMM [de] YYYY')}
                                    </Text>

                                    <TouchableOpacity onPress={() => showPicker(true)}>
                                        <CalendarDaysIcon size={22} color="#F99F1E" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                {pdvCustomer.length > 0 ? (
                                    <Text className="text-xs text-gray-500 mb-2">
                                        Toque em um pedido para solicitar cashback
                                    </Text>
                                ) : (
                                    <Text className="text-sm text-center text-gray-400 mt-10">
                                        Nenhum pedido encontrado para este mês
                                    </Text>
                                )}
                            </View>
                            <View className="flex-1 w-full">
                                <PdvList />
                            </View>
                        </View>
                        <View className="my-6">
                            <View className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
                                <Text className="text-sm text-gray-500">
                                    Cashback disponível
                                </Text>

                                <Text
                                    className={`text-2xl font-bold mt-1 ${applyCashback > 0 && activeOrder !== null
                                        ? 'text-solar-green-primary'
                                        : 'text-gray-400'
                                        }`}
                                >
                                    R$ {maskMoney(activeOrder !== null ? String(applyCashback) : '0,00')}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Button
                                label="Solicitar Cashback"
                                onPress={handleCashbackRequest}
                                disabled={activeOrder === null}
                                className="mt-4"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};
