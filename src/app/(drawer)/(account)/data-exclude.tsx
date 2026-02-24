import { View, Text, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { User2Icon } from 'lucide-react-native';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { maskPhone } from '@/utils/mask';
import { router } from 'expo-router';
import { excludeDataSchema, ExcludeDataSchema } from '@/schemas/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '@/components/PageHeader';

export default function DataExclude() {
  const [loading, setLoading] = useState(false);
  const { infoCustomerToExcludeData } = useAuth();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ExcludeDataSchema>({
    defaultValues: {
      motivo: '',
      emailCliente: infoCustomerToExcludeData?.emailCliente,
      celularCliente: maskPhone(infoCustomerToExcludeData?.celularCliente),
    },
    resolver: zodResolver(excludeDataSchema)
  });

  const onSubmit: SubmitHandler<ExcludeDataSchema> = async (data: ExcludeDataSchema) => {
    try {
      setLoading(true);
      router.replace({
        pathname: '/data-analise',
        params: { email: data?.emailCliente }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className='flex-1 flex-col items-center justify-start'>
            <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>

              <PageHeader
                title="Exclusão de dados"
                subtitle="Preencha o formulário abaixo corretamente"
                description="Após o envio dos dados iniciarmos o processo de exclusão de dados."
                icon={<User2Icon size={26} color="#1a9cd9" />}
              />

              <View className='w-full'>
                <Controller
                  control={control}
                  name={'motivo'}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      label={'Conte-nos o motivo'}
                      value={value}
                      multiline
                      numberOfLines={4}
                      textAlignVertical='top'
                      onChangeText={onChange}
                      onBlur={onBlur}
                      inputClasses={`${errors.motivo ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                      style={{ height: 145 }}
                    />
                  )}
                />
                {errors.motivo && <Text className='text-red-500'>{errors.motivo.message}</Text>}
              </View>
              <View className='w-full'>
                <Controller
                  control={control}
                  name={'emailCliente'}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      label={'E-mail'}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      inputClasses={`${errors.emailCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                    />
                  )}
                />
                {errors.emailCliente && <Text className='text-red-500'>{errors.emailCliente.message as string}</Text>}
              </View>

              <View className='w-full'>
                <Controller
                  control={control}
                  name={'celularCliente'}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      label={'Celular'}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      inputClasses={`${errors.celularCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                    />
                  )}
                />
                {errors.celularCliente && <Text className='text-red-500'>{errors.celularCliente.message}</Text>}
              </View>

              <View className='w-full py-4'>
                <Button
                  disabled={loading}
                  label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Alterar'}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
}