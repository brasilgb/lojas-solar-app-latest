import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { HandshakeIcon, User2Icon } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { accountSchema, AccountSchema } from '@/schemas/account';
import { zodResolver } from '@hookform/resolvers/zod';
import appservice from '@/services/appservice';
import { Input } from '@/components/Input';
import { maskCep, maskCpfCnpj, maskPhone, unMask } from '@/utils/mask';
import { Link, router } from 'expo-router';
import { Button } from '@/components/Button';
import { crediarySchema, CrediarySchema } from '@/schemas/crediary';

export default function Crediary() {
    const { user, disconnect, setInfoCustomerToExcludeData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [crediary, setCrediary] = useState<any>([]);
    const [message, setMessage] = useState<string | undefined>(undefined);


    useEffect(() => {
        const getCrediary = async () => {
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
                }
                setCrediary(data);
                reset(data)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getCrediary();
    }, [user])

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CrediarySchema>({
        defaultValues: {
            nomeMae: crediary?.nomeMae,
            sexo: crediary?.sexo,
            escolaridade: crediary?.escolaridade,
            localTrabalho: crediary?.localTrabalho,
            estadoCivil: crediary?.estadoCivil,
            nomeConjuge: crediary?.nomeConjuge,
            cpfConjuge: crediary?.cpfConjuge,
            profissao: crediary?.profissao,
            renda: crediary?.renda,
        },
        resolver: zodResolver(crediarySchema),
    })

    const onSubmit: SubmitHandler<CrediarySchema> = async (data: CrediarySchema) => {
        setLoading(true);
        try {
            const response = await appservice.post(`(WS_CREDIARIO_CLIENTE)`, {
                token: user?.token,
                nomeMae: data.nomeMae,
                sexo: data.sexo,
                escolaridade: data.escolaridade,
                localTrabalho: data.localTrabalho,
                estadoCivil: data.estadoCivil,
                nomeConjuge: data.nomeConjuge,
                cpfConjuge: data.cpfConjuge,
                profissao: data.profissao,
                renda: data.renda,
            });
            const { message, success } = response.data?.resposta;
            if (success) {
                router.push('/load-images')
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
                            <View className=''>
                                <HandshakeIcon size={60} color={'#1a9cd9'} />
                            </View>
                            <View className="bg-white rounded-xl px-6 pb-4 flex-col justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-700">
                                    Crediário
                                </Text>
                                <Text className="text-gray-700">Preencha os dados corretamente</Text>
                                <Text className="text-gray-700">Se houver dados poderão ser alterados. </Text>
                            </View>
                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'nomeMae'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Nome da mãe'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.nomeMae ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.nomeMae && <Text className='text-red-500'>{errors.nomeMae.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'sexo'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Genero'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.sexo ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.sexo && <Text className='text-red-500'>{errors.sexo.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'escolaridade'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Endereço'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.escolaridade ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.escolaridade && <Text className='text-red-500'>{errors.escolaridade.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'localTrabalho'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Local do trabalho'}
                                            value={maskCep(value ? String(value) : '')}
                                            onChangeText={(text) => onChange(unMask(text))}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.localTrabalho ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.localTrabalho && <Text className='text-red-500'>{errors.localTrabalho.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'estadoCivil'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Estado civil'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.estadoCivil ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.estadoCivil && <Text className='text-red-500'>{errors.estadoCivil.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'nomeConjuge'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Nome do conjuge'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.nomeConjuge ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.nomeConjuge && <Text className='text-red-500'>{errors.nomeConjuge.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'cpfConjuge'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'CPF conjuge'}
                                            value={maskCpfCnpj(String(value))}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.cpfConjuge ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.cpfConjuge && <Text className='text-red-500'>{errors.cpfConjuge.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'profissao'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Profissão'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.profissao ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.profissao && <Text className='text-red-500'>{errors.profissao.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'renda'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Renda'}
                                            value={String(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.renda ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.renda && <Text className='text-red-500'>{errors.renda.message}</Text>}
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