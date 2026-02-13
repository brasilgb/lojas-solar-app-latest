import { View, Text, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigInSchema, sigInSchema } from '@/schemas/signIn'
import { Link } from 'expo-router';
import { UserRoundCheckIcon } from 'lucide-react-native';
import { maskCpfCnpj } from '@/utils/mask';

export default function SignIn() {
    const { signIn, loading, message } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<SigInSchema>({
        defaultValues: {
            cpfcnpj: '',
        },
        resolver: zodResolver(sigInSchema),
    });

    const onSubmit = async (data: SigInSchema) => {
        await signIn(data.cpfcnpj);
    };

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
                        <View className='h-60 w-full flex-row items-center justify-center'>
                            <Image source={require('@/assets/images/logo_lojas_solar.png')} style={{ width: 220, height: 40 }} />
                        </View>
                        <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>
                            <View className=''>
                                <UserRoundCheckIcon size={60} color={'#1a9cd9'} />
                            </View>
                            <View className="bg-white rounded-xl px-6 pb-4 flex-col justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-700">
                                    Acessar Conta
                                </Text>
                                <Text className="text-gray-700">Para acessar sua conta digite seu CPF/CNPJ</Text>
                            </View>
                            <View className='w-full mt-10'>
                                <Controller
                                    control={control}
                                    name={'cpfcnpj'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            placeholder='CPF ou CNPJ'
                                            keyboardType='numeric'
                                            value={maskCpfCnpj(value)}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.cpfcnpj ? '!border-solar-orange-secondary' : ''} text-gray-800 placeholder:text-gray-400`}
                                        />
                                    )}
                                />
                                {message && <Text className='text-red-500'>{message}</Text>}
                                {errors.cpfcnpj && <Text className='text-red-500'>{errors.cpfcnpj.message}</Text>}
                            </View>
                            <View className='w-full py-4'>
                                <Button
                                    disabled={loading}
                                    label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Avançar'}
                                    onPress={handleSubmit(onSubmit)}
                                />
                            </View>
                        </View>
                        <View className='w-full bg-white flex-row items-center justify-center p-8'>
                            <Link href={'/'} asChild>
                                <Button variant={'link'} label={'Voltar'} labelClasses='text-solar-blue-secondary' />
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    )
}