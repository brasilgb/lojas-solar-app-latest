import { View, Text, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { UserLockIcon } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext'
import appservice from '@/services/appservice'
import { router } from 'expo-router'
import { Switch } from '@/components/Switch'
import { Button } from '@/components/Button'

export default function PrivacySettings() {
  const { disconnect, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [autorizaCliente, setAutorizaCliente] = useState<any[]>([]);

  const [isEnabledNotify, setIsEnabledNotify] = useState(false);
  const [isEnabledEmail, setIsEnabledEmail] = useState(false);

  const toggleNotify = () => setIsEnabledNotify(prev => !prev);
  const toggleEmail = () => setIsEnabledEmail(prev => !prev);

  useEffect(() => {
    const getAutorizaCliente = async () => {
      try {
        setLoading(true);

        const response = await appservice.get(`(WS_AUTORIZA_CLIENTE)?token=${user?.token}`);
        const { token, message, data } = response.data.resposta;

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

        const perguntas = data?.pergunta || [];

        setAutorizaCliente(perguntas);
        setIsEnabledNotify(perguntas[0]?.resposta === 'S');
        setIsEnabledEmail(perguntas[1]?.resposta === 'S');

      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    getAutorizaCliente();
  }, [user]);

  const handleSubmitPrivacity = async () => {
    try {
      setSaving(true);

      const response = await appservice.get(
        `(WS_RESPOSTA_AUTORIZA)?token=${user?.token}&resposta1=${isEnabledNotify ? 'S' : 'N'}&resposta2=${isEnabledEmail ? 'S' : 'N'}`
      );

      const { success, message } = response.data.resposta;

      if (!success) {
        Alert.alert('Atenção', message);
        return;
      }

      Alert.alert('Sucesso', 'Configurações atualizadas com sucesso');

    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 bg-white rounded-t-3xl p-6'>
        <PageHeader
          title="Privacidade"
          subtitle="Configurações de privacidade"
          description="Controle como seus dados serão utilizados."
          icon={<UserLockIcon size={26} color="#1a9cd9" />}
        />

        {loading ? (
          <View className="flex-1 items-center justify-center mt-10">
            <ActivityIndicator size="large" color="#F99F1E" />
          </View>
        ) : (
          <>

            <View className="gap-4 mt-4">

              <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-gray-800">
                    {autorizaCliente?.[0]?.texto || 'Notificações'}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Receber atualizações via WhatsApp ou Push
                  </Text>
                </View>

                <Switch
                  value={isEnabledNotify}
                  onValueChange={toggleNotify}
                />
              </View>

              <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-gray-800">
                    {autorizaCliente?.[1]?.texto || 'E-mail'}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Receber comunicações por e-mail
                  </Text>
                </View>

                <Switch
                  value={isEnabledEmail}
                  onValueChange={toggleEmail}
                />
              </View>

            </View>

            <View className="mt-auto pt-8 pb-4">
              <Button
                disabled={saving}
                label={
                  saving
                    ? <ActivityIndicator color="white" />
                    : 'Salvar configurações'
                }
                onPress={handleSubmitPrivacity}
              />
            </View>
          </>
        )}

      </View>
    </ScreenLayout>
  )
}
