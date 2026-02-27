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
import { maskCep, maskCpfCnpj, maskPhone, unMask } from '@/utils/mask';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';

export default function Account() {
    const params = useLocalSearchParams();
    const { user, disconnect, setInfoCustomerToExcludeData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState<any>([]);
    const [message, setMessage] = useState<string | undefined>(undefined);

const userSelected = user ? user.cpfcnpj : params?.cpfcnpj;

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
                    return;
                }

                if (!success) {
                    setLoading(false);
                    setMessage(message)
                    return
                }
                setAccount(data);
                let infoCustomer = {
                    emailCliente: data.emailCliente,
                    celularCliente: data.celularCliente
                }
                setInfoCustomerToExcludeData(infoCustomer)
                const normalizedData = {
                    ...data,
                    cepCliente: data?.cepCliente
                        ? unMask(String(data.cepCliente))
                        : '',
                };
                reset(normalizedData)

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
            cepCliente: account?.cepCliente ? unMask(String(account?.cepCliente)) : '',
            ufCliente: account?.ufCliente,
            cidadeCliente: account?.cidadeCliente,
            celularCliente: account?.celularCliente,
            emailCliente: account?.emailCliente,
            nascimentoCliente: account?.nascimentoCliente,
        },
        resolver: zodResolver(accountSchema),
    })

    const onSubmit: SubmitHandler<AccountSchema> = async (data: AccountSchema) => {
        setLoading(true);
        try {
            const response = await appservice.get(`(WS_ALTERA_CLIENTE)?token=${user?.token}&nomeCliente=${data.nomeCliente}&enderecoCliente=${data.enderecoCliente}&cepCliente=${data.cepCliente}&cidadeCliente=${data.cidadeCliente}&ufCliente=${data.ufCliente}&celularCliente=${unMask(data.celularCliente)}&emailCliente=${data.emailCliente}&nascimentoCliente=${data.nascimentoCliente}`);
            const { message, success } = response.data?.resposta;
            if (success) {
                Alert.alert('Atenção', message, [
                    { text: 'Ok', onPress: () => router.replace('/') },
                ]);
            }
            if (!success) {
                Alert.alert('Atenção', message, [
                    { text: 'Ok' },
                ]);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
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
                                title="Meus dados"
                                subtitle="Confira seus dados abaixo"
                                description="Preencha ou altere conforme a necessidade."
                                icon={<User2Icon size={26} color="#1a9cd9" />}
                            />

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
                                            value={maskCep(value ? String(value) : '')}
                                            onChangeText={(text) => onChange(unMask(text))}
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