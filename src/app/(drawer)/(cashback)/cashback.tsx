import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { BanknoteArrowDownIcon, X } from 'lucide-react-native'
import appservice from '@/services/appservice'
import { router, useFocusEffect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'
import { maskMoney } from '@/utils/mask'
import { Button } from '@/components/Button'
import { FlashList } from '@shopify/flash-list'
import AppDateTimePicker from '@/components/AppDateTimePicker'

export default function Cashback() {

  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [historicoCashback, setHisoricoCashback] = useState<any>([]);
  const [itemsModal, setItemsModal] = useState<any>([]);
  const [itensNota, setItensNota] = useState<any>([]);

  let dataAtual = new Date();
  let dataAnterior = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth() - 6,
    dataAtual.getDate(),
  );
  const [dateIni, setDateIni] = useState(dataAnterior);
  const [dateFin, setDateFin] = useState(dataAtual);

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  const getHistoricoCashback = async () => {
    setLoading(true);
    await appservice
      .post('(WS_CONSULTA_CASHBACK)', {
        codcli: user?.codigoCliente,
        dataInicial: moment(dateIni).format('YYYYMMDD'),
        dataFinal: moment(dateFin).format('YYYYMMDD'),
      })
      .then(response => {
        setHisoricoCashback(response?.data?.respcash);
      })
      .catch(error => {
        console.log('error', error);
      })
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      getHistoricoCashback();
    }, []),
  );

  const handleHistoricoCachback = () => {
    setLoading(true)
    try {
      setDateIni(dataAnterior);
      setDateFin(new Date());
      router.push({
        pathname: '/history-cashback',
        params: historicoCashback,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }

  };

  useEffect(() => {
    const getItensNota = async () => {
      setLoading(true);
      await appservice
        .post('(WS_CONSULTA_NF_CASHBACK)', {
          orige: itemsModal.orige,
          serie: itemsModal.serie,
          numnf: itemsModal.numnf,
        })
        .then(response => {
          setItensNota(response.data.respnfcash.data);
        })
        .catch(error => {
          console.log('error', error);
        })
        .finally(() => setLoading(false));
    };
    getItensNota();
  }, [itemsModal]);

  const renderItem = ({ item }: any) => {
    const isCredito = item.debcre === 'C';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (isCredito) {
            setItemsModal(item);
            onOpen();
          }
        }}
        className="bg-white p-4 rounded-2xl border border-gray-200 mb-2"
      >
        <View className="flex-row justify-between items-center">

          {/* LADO ESQUERDO */}
          <View className="flex-1">
            <Text className="text-sm text-gray-500">
              NF {item.numnf} • Série {item.serie}
            </Text>

            <Text className="text-xs text-gray-400 mt-1">
              Origem: {item.orige}
            </Text>
          </View>

          {/* VALOR */}
          <Text
            className={`text-lg font-bold ${isCredito
              ? 'text-solar-green-primary'
              : 'text-solar-red-primary'
              }`}
          >
            {isCredito ? '+' : '-'} R${' '}
            {maskMoney(String(item.valor))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderItemsNota = ({ item }: any) => (
    <View className="bg-gray-100 rounded-xl p-3 mb-2 mx-4">

      <View className="flex-row justify-between mb-1">
        <Text className="text-sm font-medium text-gray-700">
          Item {item.item}
        </Text>

        <Text className="text-sm font-bold text-solar-blue-primary">
          R$ {maskMoney(String(item.valor))}
        </Text>
      </View>

      <Text className="text-xs text-gray-500">
        {item.desite}
      </Text>
    </View>
  );

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 bg-white rounded-t-3xl p-6'>

        <PageHeader
          title="Cashback"
          subtitle="Histórico de cashback"
          description="Selecione um intervalo de datas para visualizar o histórico de cashback."
          icon={<BanknoteArrowDownIcon size={26} color="#1a9cd9" />}
        />

        <View className="p-4 bg-gray-100 rounded-3xl flex-1 gap-4 mt-4">
          <View className="flex-col gap-4">
            <View className="bg-solar-blue-primary rounded-2xl p-5 shadow-md">
              <Text className="text-white text-sm opacity-80">
                Saldo disponível
              </Text>

              <Text className="text-white text-3xl font-bold mt-1">
                R$ {historicoCashback?.credTotal
                  ? maskMoney(String(historicoCashback.credTotal.toFixed(2)))
                  : '0,00'}
              </Text>
            </View>

            <View className="bg-white p-4 rounded-xl border border-gray-200">
              <Text className="text-sm text-gray-500 mb-2">
                Período
              </Text>

              <View className="flex-row justify-between">
                <AppDateTimePicker value={dateIni} onChange={setDateIni} />
                <AppDateTimePicker value={dateFin} onChange={setDateFin} />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-row items-center gap-2">
                <View className="bg-solar-green-primary w-3 h-3 rounded-full" />
                <Text className="text-sm text-gray-600">Disponível</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="bg-solar-red-primary w-3 h-3 rounded-full" />
                <Text className="text-sm text-gray-600">Utilizado</Text>
              </View>
            </View>
          </View>

          <View className="flex-1">
            <FlashList
              data={historicoCashback?.data}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 10 }}
              keyboardShouldPersistTaps={'always'}
              showsVerticalScrollIndicator={false}
              onRefresh={getHistoricoCashback}
              refreshing={loading}
            />
          </View>

          <View>
            <Button
              label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Solicitar Cashback'}
              onPress={handleHistoricoCachback}
              disabled={!historicoCashback?.data?.length}
            />
          </View>
        </View>

        <Modalize
          modalHeight={Dimensions.get('window').height - 150}
          modalTopOffset={80}
          ref={modalizeRef}
          HeaderComponent={
            <View className="items-center py-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-700">
                Nota Fiscal
              </Text>

              <Text className="text-2xl font-bold text-solar-blue-primary mt-1">
                {itemsModal?.numnf}
              </Text>
            </View>
          }
          flatListProps={{
            data: itensNota,
            keyExtractor: (item: any, index: any) => `${item}-${index}`,
            renderItem: ({ item, index }: { item: any; index: number }) => (
              <RenderItemsNota item={item} index={index} />
            ),
            keyboardShouldPersistTaps: 'handled',
            showsVerticalScrollIndicator: false,
          }}
        />

      </View>
    </ScreenLayout>
  )
}