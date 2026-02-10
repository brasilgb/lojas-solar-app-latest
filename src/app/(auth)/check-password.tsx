import { View, Text, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckPasswordSchema, checkPasswordSchema } from '@/schemas/signIn'
import { Link, useLocalSearchParams } from 'expo-router';
import { EyeClosedIcon, EyeIcon, KeyRoundIcon } from 'lucide-react-native';
import { Checkbox } from '@/components/Checkbox';
import { unMask } from '@/utils/mask';

export default function SignIn() {
    const params = useLocalSearchParams()
    const { checkPassword, recoverPasswordSubmit, loading, message } = useAuth();
    const [isSecure, setIsSecure] = useState<boolean>(true);

    const { control, handleSubmit, formState: { errors } } = useForm<CheckPasswordSchema>({
        defaultValues: {
            senha: '',
            connected: false,
        },
        resolver: zodResolver(checkPasswordSchema),
    });

    const onSubmit: SubmitHandler<CheckPasswordSchema> = async (data: CheckPasswordSchema) => {

        const credentials = {
            codigoCliente: params?.codigoCliente,
            nomeCliente: params?.nomeCliente,
            cpfcnpj: unMask(String(params?.cpfcnpj).trim()),
            senha: data.senha,
            connected: data.connected,
        };
        await checkPassword(credentials);
    };

    const recoverPasswordHandle = async () => {
        await recoverPasswordSubmit(params?.cpfcnpj as string);
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
                        <View className='h-60 w-full flex-row items-center justify-center'>
                            <Image source={require('@/assets/images/logo_lojas_solar.png')} style={{ width: 220, height: 40 }} />
                        </View>
                        <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>
                            <View className=''>
                                <KeyRoundIcon size={60} color={'#1a9cd9'} />
                            </View>
                            <View className="bg-white rounded-xl px-6 pb-4 flex-col justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-700">
                                    Acessar Conta
                                </Text>
                                <Text className="text-gray-700 text-sm font-medium">CPF/CNPJ: <Text className='font-bold'>{params?.cpfcnpj}</Text></Text>
                                <Text className="text-gray-700">Quase lá <Text className='font-bold capitalize'>{(String(params?.nomeCliente).split(" ")[0]).toLowerCase()}</Text>, digite agora sua senha</Text>
                            </View>
                            <View className='w-full mt-10'>
                                <View className='relative'>
                                    <Controller
                                        control={control}
                                        name={'senha'}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                secureTextEntry={isSecure}
                                                placeholder='Senha'
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                inputClasses={`${errors.senha ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                            />
                                        )}
                                    />
                                    {message && <Text className='text-red-500'>{message}</Text>}
                                    {errors.senha && <Text className='text-red-500'>{errors.senha.message}</Text>}
                                </View>
                                <View className='absolute right-0 -top-1'>
                                    <Button variant={'link'} label={isSecure ? <EyeIcon /> : <EyeClosedIcon />} onPress={() => setIsSecure(!isSecure)} />
                                </View>
                            </View>
                            <View className='flex-row items-center justify-between w-full'>
                                <View>
                                    <Controller
                                        control={control}
                                        name="connected"
                                        render={({ field: { onChange, value } }) => (
                                            <Checkbox
                                                label="Continuar logado"
                                                checkboxClasses="w-5 h-5"
                                                isSelected={value}
                                                onValueChange={onChange}
                                                labelClasses="text-base text-gray-500 font-medium"
                                            />
                                        )}
                                    />
                                </View>
                                <View>
                                    <Button
                                        variant={'link'}
                                        label={'Esqueci minha senha'}
                                        className='p-0'
                                        labelClasses="text-base text-gray-500"
                                        onPress={recoverPasswordHandle}
                                    />
                                </View>
                            </View>
                            <View className='w-full py-4'>
                                <Button
                                    disabled={loading}
                                    label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Entrar'}
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