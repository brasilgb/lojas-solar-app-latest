import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { User2Icon } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { accountSchema, AccountSchema } from '@/schemas/account';
import { zodResolver } from '@hookform/resolvers/zod';
import appservice from '@/services/appservice';
import { Input } from '@/components/Input';
import { maskCep, maskCpfCnpj, maskPhone } from '@/utils/mask';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';

export default function Account() {
    const { user, disconnect } = useAuth();
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState<any>([]);
    const [message, setMessage] = useState<string | undefined>(undefined);


    useEffect(() => {
        const getAccount = async () => {
            setLoading(true)
            try {
                const response = await appservice.get(`(WS_CARREGA_CLIENTE)?token=${user?.token}`);
                const { data, message, success, token } = response.data?.resposta;
                if (!token) {
                    Alert.alert('Atenção', message, [
                        {
                            text: 'Ok',
                            onPress: () => {
                                disconnect();
                            },
                        },
                    ]);
                }

                if (!success) {
                    setLoading(false);
                    setMessage(message)
                    return
                } else {
                    setMessage(undefined);
                }

                setAccount(data);
                reset(data)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getAccount();
    }, [])

    const { control, handleSubmit, reset, formState: { errors } } = useForm<AccountSchema>({
        defaultValues: {
            cpfcnpj: maskCpfCnpj(String(user?.cpfcnpj)),
            nomeCliente: account?.nomeCliente,
            enderecoCliente: account?.enderecoCliente,
            cepCliente: account?.cepCliente,
            ufCliente: account?.ufCliente,
            cidadeCliente: account?.cidadeCliente,
            celularCliente: account?.celularCliente,
            emailCliente: account?.emailCliente,
            nascimentoCliente: account?.nascimentoCliente,
        },
        resolver: zodResolver(accountSchema),
    })

    const onSubmit: SubmitHandler<AccountSchema> = async (data: AccountSchema) => {
        console.log(data)
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
                            <View className=''>
                                <User2Icon size={60} color={'#1a9cd9'} />
                            </View>
                            <View className="bg-white rounded-xl px-6 pb-4 flex-col justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-700">
                                    Meus dados
                                </Text>
                                <Text className="text-gray-700">Confira seus dados abaixo </Text>
                                <Text className="text-gray-700">Preencha ou altere conforme a necessidade</Text>
                            </View>
                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'cpfcnpj'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'CPF ou CNPJ'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.cpfcnpj ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.cpfcnpj && <Text className='text-red-500'>{errors.cpfcnpj.message}</Text>}
                            </View>
                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'nomeCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Nome completo'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.nomeCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.nomeCliente && <Text className='text-red-500'>{errors.nomeCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'enderecoCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Endereço'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.enderecoCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.enderecoCliente && <Text className='text-red-500'>{errors.enderecoCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'cepCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'CEP'}
                                            value={maskCep(String(value))}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.cepCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.cepCliente && <Text className='text-red-500'>{errors.cepCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'ufCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'UF'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.ufCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.ufCliente && <Text className='text-red-500'>{errors.ufCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'cidadeCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Cidade'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.cidadeCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.cidadeCliente && <Text className='text-red-500'>{errors.cidadeCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'celularCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Celular'}
                                            value={maskPhone(String(value))}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.celularCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.celularCliente && <Text className='text-red-500'>{errors.celularCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'emailCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'E-mail'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.emailCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.emailCliente && <Text className='text-red-500'>{errors.emailCliente.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'nascimentoCliente'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Nascimento'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.nascimentoCliente ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.nascimentoCliente && <Text className='text-red-500'>{errors.nascimentoCliente.message}</Text>}
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