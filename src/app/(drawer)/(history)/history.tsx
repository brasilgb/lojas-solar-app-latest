import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { CalendarDaysIcon, HistoryIcon } from 'lucide-react-native'
import MonthPicker from 'react-native-month-year-picker';
import { useAuth } from '@/contexts/AuthContext'
import appservice from '@/services/appservice'
import { maskMoney } from '@/utils/mask'
import { router, useFocusEffect } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import moment from 'moment'
import 'moment/locale/pt-br'

interface HistoryProps {
  numero: string;
  serie: string;
  filial: string;
  data: string;
  valor: string;
}

export default function History() {
  const { user,disconnect } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [historicos, setHistoricos] = useState<HistoryProps[]>([]);
  const showPicker = useCallback((value: any) => setShow(value), []);

  const onValueChange = useCallback((event: any, newDate: any) => {
    const selectedDate = newDate || date;
    console.log(moment(date).format('YYYYMM'));
    
    showPicker(false);
    setDate(selectedDate);
  },
    [date, showPicker],
  );

    const getHistoricos = useCallback(async () => {
        setLoading(true);

        try {
            const response = await appservice.get(
                `(WS_HISTORICO_COMPRAS)?token=${user?.token}&dataInicial=${moment(date).format('YYYYMM')}01&dataFinal=${moment(date).format('YYYYMM')}31`,
            );
            const {data, token, message} = response.data.resposta;
                    if (!token) {
                      Alert.alert('Atenção', message, [
                        {
                          text: 'Ok',
                          onPress: () => {
                            router.replace('/');
                            disconnect();
                          },
                        },
                      ]);
                      return;
                    }
            setHistoricos(data);
        } catch (err) {
            console.log(err);
            setHistoricos([]);
        } finally {
            setLoading(false);
        }
    }, [user, date]);

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
        className="bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-3 shadow-sm"
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
            R$ {maskMoney(item.valor)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1'>

        <View className='flex-1 bg-white rounded-t-3xl p-6'>

          <PageHeader
            title="Histórico"
            subtitle="Histórico de compras"
            description="Selecione o mês para navegar pelo seu histórico de compras."
            icon={<HistoryIcon size={26} color="#1a9cd9" />}
          />
          <View className="flex-1 bg-gray-100 rounded-lg my-4">

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

              {historicos.length === 0 ? (
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
      </View>
    </ScreenLayout>
  )
}