import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/contexts/AuthContext'
import appservice from '@/services/appservice'
import { maskMoney } from '@/utils/mask'
import { FlashList } from '@shopify/flash-list'
import { router, useFocusEffect } from 'expo-router'
import { CalendarDaysIcon, HistoryIcon } from 'lucide-react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native'
import MonthPicker from 'react-native-month-year-picker'
import * as SecureStore from 'expo-secure-store'

const HISTORY_MONTH_KEY = 'purchase-history-month';

interface HistoryProps {
  numero: string;
  serie: string;
  filial: string;
  data: string;
  valor: string;
}

export default function History() {
  const { user, expiredSession } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());
  const [dateRestored, setDateRestored] = useState(false);
  const [show, setShow] = useState(false);
  const [historicos, setHistoricos] = useState<HistoryProps[]>([]);
  const showPicker = useCallback((value: any) => setShow(value), []);

  React.useEffect(() => {
    SecureStore.getItemAsync(HISTORY_MONTH_KEY)
      .then(savedMonth => {
        if (!savedMonth) return;
        const restoredDate = moment(savedMonth, 'YYYY-MM', true);
        if (restoredDate.isValid() && !restoredDate.isAfter(moment(), 'month')) {
          setDate(restoredDate.toDate());
        }
      })
      .finally(() => setDateRestored(true));
  }, []);

  const onValueChange = useCallback((event: any, newDate: any) => {
    const selectedDate = newDate || date;

    showPicker(false);
    setDate(selectedDate);
    SecureStore.setItemAsync(
      HISTORY_MONTH_KEY,
      moment(selectedDate).format('YYYY-MM'),
    );
  },
    [date, showPicker],
  );

  const getHistoricos = useCallback(async () => {
    if (!user?.token || !dateRestored) return;

    setLoading(true);

    try {
      const response = await appservice.get(
        `(WS_HISTORICO_COMPRAS)?token=${user.token}&dataInicial=${moment(date).startOf('month').format('YYYYMMDD')}&dataFinal=${moment(date).endOf('month').format('YYYYMMDD')}`,
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
      setHistoricos(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.log(err);
      setHistoricos([]);
    } finally {
      setLoading(false);
    }
  }, [user?.token, date, dateRestored, expiredSession]);

  useFocusEffect(
    useCallback(() => {
      getHistoricos();
    }, [getHistoricos]),
  );

  const RenderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: '/history-items',
            params: item,
          })
        }
        className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-500">
            Nota fiscal
          </Text>
          <Text className="text-lg font-bold text-gray-800">
            {item.numero}
          </Text>
        </View>

        {/* Info grid */}
        <View className="flex-row justify-between mb-3">
          <View>
            <Text className="text-xs text-gray-400">Série</Text>
            <Text className="text-sm font-semibold text-gray-700">
              {item.serie}
            </Text>
          </View>

          <View>
            <Text className="text-xs text-gray-400">Filial</Text>
            <Text className="text-sm font-semibold text-gray-700">
              {item.filial}
            </Text>
          </View>

          <View>
            <Text className="text-xs text-gray-400">Data</Text>
            <Text className="text-sm font-semibold text-gray-700">
              {item.data}
            </Text>
          </View>
        </View>

        {/* Valor */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-400">
            Valor total
          </Text>

          <Text className="text-xl font-bold text-solar-blue-secondary">
            R$ {maskMoney(Number(item.valor).toFixed(2))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 bg-white rounded-t-3xl p-4 gap-2'>

        <PageHeader
          title="Histórico"
          subtitle="Histórico de compras"
          description="Selecione o mês para navegar pelo seu histórico de compras."
          icon={<HistoryIcon size={26} color="#1a9cd9" />}
        />
        <View className="bg-white rounded-t-3xl flex-1">

          <View className="px-4 p-4">
            <TouchableOpacity
              onPress={() => showPicker(true)}
              className="w-full flex-row items-center justify-between bg-white border border-gray-200 rounded-xl py-3 px-4 shadow-sm"
            >
              <Text className="text-base text-gray-700 font-medium">
                {moment(date).locale('pt-br').format('MMMM [de] YYYY')}
              </Text>

              <CalendarDaysIcon size={24} color="#F99F1E" />
            </TouchableOpacity>
          </View>

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

          <View className="flex-1 rounded-3xl px-4">

            {(!dateRestored || loading) && historicos.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1a9cd9" />
                <Text className="mt-3 text-sm text-gray-500">Carregando histórico...</Text>
              </View>
            ) : historicos.length === 0 ? (
              <View className="flex-1 items-center justify-center px-6">
                <CalendarDaysIcon size={48} color="#9CA3AF" />

                <Text className="text-base text-gray-500 font-medium mt-4 text-center">
                  Nenhum histórico encontrado
                </Text>

                <Text className="text-sm text-gray-400 text-center mt-1">
                  Selecione outro mês para visualizar compras
                </Text>
              </View>
            ) : (
              <FlashList
                data={historicos}
                renderItem={({ item }: any) => (
                  <RenderItem item={item} />
                )}
                keyExtractor={(item: any) => item.numero}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onRefresh={getHistoricos}
                refreshing={loading}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenLayout>
  )
}
