import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { accountSchema, AccountSchema } from '@/schemas/account';
import appservice from '@/services/appservice';
import { maskCep, maskCpfCnpj, maskPhone, unMask } from '@/utils/mask';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { User2Icon, UserMinus2Icon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'user-data';

export default function Account() {
    const params = useLocalSearchParams();
    const { user, setUser, expiredSession, setInfoCustomerToExcludeData } = useAuth();
    const [loadingAccount, setLoadingAccount] = useState(true);
    const [saving, setSaving] = useState(false);
    const [account, setAccount] = useState<any>([]);
    const [message, setMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const getAccount = async () => {
            setLoadingAccount(true)
            setMessage(undefined)
            try {
                const response = await appservice.get(`(WS_CARREGA_CLIENTE)?token=${user?.token}`);
                const { data, message, success, token } = response.data?.resposta;
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

                if (!success) {
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
                setMessage('Não foi possível carregar seus dados. Tente novamente.')
            } finally {
                setLoadingAccount(false)
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
        setSaving(true);
        setMessage(undefined);
        try {
            const query = new URLSearchParams({
                token: String(user?.token ?? ''),
                nomeCliente: data.nomeCliente,
                enderecoCliente: data.enderecoCliente,
                cepCliente: data.cepCliente,
                cidadeCliente: data.cidadeCliente,
                ufCliente: data.ufCliente,
                celularCliente: unMask(data.celularCliente),
                emailCliente: data.emailCliente,
                nascimentoCliente: data.nascimentoCliente ?? '',
            });
            const response = await appservice.get(`(WS_ALTERA_CLIENTE)?${query.toString()}`);
            const { message, success, token } = response.data?.resposta;
            if (success) {
                const updatedAccount = {
                    ...account,
                    ...data,
                    cpfcnpj: user?.cpfcnpj ?? params?.cpfcnpj,
                    cepCliente: data.cepCliente,
                    celularCliente: unMask(data.celularCliente),
                };
                const updatedUser = user
                    ? {
                        ...user,
                        nomeCliente: data.nomeCliente,
                        token: token ?? user.token,
                    }
                    : user;

                setAccount(updatedAccount);
                reset(updatedAccount);

                if (updatedUser) {
                    setUser(updatedUser);
                    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
                }

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
            setMessage('Não foi possível alterar seus dados. Tente novamente.')
        } finally {
            setSaving(false);
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
                        <View className='w-full flex-1 bg-white rounded-t-3xl p-4 flex-col justify-start items-center gap-4'>

                            <PageHeader
                                title="Meus dados"
                                subtitle="Confira seus dados abaixo"
                                description="Preencha ou altere conforme a necessidade."
                                icon={<User2Icon size={26} color="#1a9cd9" />}
                                rightElement={
                                    (
                                        <TouchableOpacity
                                            onPress={() =>
                                                Alert.alert(
                                                    'Exclusão de dados',
                                                    'Vamos direcioná-lo para o processo de exclusão de dados.',
                                                    [
                                                        { text: 'Cancelar', style: 'cancel' },
                                                        { text: 'Ok', onPress: () => router.push('/data-exclude') },
                                                    ]
                                                )
                                            }
                                            className="p-2"
                                        >
                                            <UserMinus2Icon color="#1a9cd9" size={26} />
                                        </TouchableOpacity>
                                    )
                                }
                            />

                            {loadingAccount ? (
                                <View className="flex-1 w-full items-center justify-center py-16">
                                    <ActivityIndicator size="large" color="#1a9cd9" />
                                    <Text className="mt-3 text-sm text-gray-500">Carregando seus dados...</Text>
                                </View>
                            ) : (
                            <>
                            {message && (
                                <View className="w-full rounded-lg bg-red-50 border border-red-200 p-3">
                                    <Text className="text-sm text-red-600">{message}</Text>
                                </View>
                            )}

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
                                            editable={false}
                                            inputClasses={`${errors.cpfcnpj ? '!border-solar-orange-secondary' : ''} bg-gray-100 text-gray-500`}
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
                                    disabled={saving}
                                    label={saving ? <ActivityIndicator color={'white'} size={'small'} /> : 'Alterar'}
                                    onPress={handleSubmit(onSubmit)}
                                />
                            </View>
                            </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    )
}
