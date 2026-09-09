import AppDateTimePicker from '@/components/AppDateTimePicker'
import { Button } from '@/components/Button'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/contexts/AuthContext'
import appservice from '@/services/appservice'
import { softCardShadow } from '@/styles/shadows'
import { maskMoney } from '@/utils/mask'
import { FlashList } from '@shopify/flash-list'
import { router, useFocusEffect } from 'expo-router'
import { BanknoteArrowDownIcon } from 'lucide-react-native'
import moment from 'moment'
import { useCallback, useState } from 'react'
import { Text, View } from 'react-native'

export default function Cashback() {

  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [historicoCashback, setHisoricoCashback] = useState<any>([]);

  let dataAtual = new Date();
  let dataAnterior = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth() - 6,
    dataAtual.getDate(),
  );
  const [dateIni, setDateIni] = useState(dataAnterior);
  const [dateFin, setDateFin] = useState(dataAtual);

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
        // Route params must be scalar values. Sending the complete response here
        // also sends `data` (an array of objects), which Expo Router cannot
        // serialize safely when there are cashback entries.
        params: {
          credTotal: String(historicoCashback?.credTotal ?? 0),
          porcent: String(historicoCashback?.porcent ?? 0),
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }

  };

  const renderItem = ({ item }: any) => {
    const isCredito = item.debcre === 'C';

    return (
      <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-2">
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
            {maskMoney(Number(item.valor).toFixed(2))}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 bg-white rounded-t-3xl p-4 gap-2'>

        <PageHeader
          title="Cashback"
          subtitle="Histórico de cashback"
          description="Selecione um intervalo de datas para visualizar o histórico de cashback."
          icon={<BanknoteArrowDownIcon size={26} color="#1a9cd9" />}
        />

        <View className="bg-white rounded-t-3xl flex-1">
          <View className="flex-col gap-4">
            <View className="bg-solar-blue-primary rounded-2xl p-2" style={softCardShadow}>
              <Text className="text-white text-sm opacity-80">
                Saldo disponível
              </Text>

              <Text className="text-white text-2xl font-bold mt-1">
                R$ {historicoCashback?.credTotal
                  ? maskMoney(String(historicoCashback.credTotal.toFixed(2)))
                  : '0,00'}
              </Text>
            </View>

            <View className="bg-white p-2 rounded-xl border border-gray-200">
              <View className="flex-row gap-2">
                <View className="min-w-0 flex-1">
                  <AppDateTimePicker value={dateIni} onChange={setDateIni} />
                </View>
                <View className="min-w-0 flex-1">
                  <AppDateTimePicker value={dateFin} onChange={setDateFin} />
                </View>
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

          <View className="min-h-0 flex-1">
            <FlashList
              style={{ flex: 1 }}
              data={historicoCashback?.data}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 10 }}
              keyboardShouldPersistTaps={'always'}
              showsVerticalScrollIndicator={false}
              onRefresh={getHistoricoCashback}
              refreshing={loading}
            />
          </View>

          <View className="shrink-0 pt-2 pb-1">
            <Button
              label="Solicitar Cashback"
              onPress={handleHistoricoCachback}
              disabled={!historicoCashback?.data?.length}
            />
          </View>
        </View>

      </View>
    </ScreenLayout>
  )
}
