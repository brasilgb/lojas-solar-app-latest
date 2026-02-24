import { View, Text, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native'
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
                    keyboardShouldPersistTaps="always"
                >
                    <View className='flex-1 justify-center px-6'>

                        <View className='items-center mb-10'>
                            <Image
                                source={require('@/assets/images/logo_lojas_solar.png')}
                                style={{ width: 180, height: 32 }}
                                resizeMode="contain"
                            />
                        </View>

                        <View className='bg-white rounded-3xl p-6 shadow-sm'>

                            <View className="items-center mb-6">
                                <View className="bg-blue-100 p-3 rounded-full mb-3">
                                    <KeyRoundIcon size={28} color="#1a9cd9" />
                                </View>

                                <Text className="text-xl font-bold text-gray-900">
                                    Acessar conta
                                </Text>

                                <Text className="text-sm text-gray-500 mt-1 text-center">
                                    {String(params?.nomeCliente).split(" ")[0]}, digite sua senha para continuar
                                </Text>

                                <Text className="text-xs text-gray-400 mt-1">
                                    CPF/CNPJ: <Text className="font-medium text-gray-600">{params?.cpfcnpj}</Text>
                                </Text>
                            </View>

                            <View className="w-full mb-4">
                                <View className="relative">

                                    <Controller
                                        control={control}
                                        name="senha"
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                secureTextEntry={isSecure}
                                                placeholder="Sua senha"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                inputClasses={`pr-12 ${errors.senha ? '!border-red-500' : ''
                                                    } text-gray-800 placeholder:text-gray-400`}
                                            />
                                        )}
                                    />

                                    <Pressable
                                        onPress={() => setIsSecure(!isSecure)}
                                        className="absolute right-3 top-3"
                                    >
                                        {isSecure ? <EyeIcon color={'#6b7280'} /> : <EyeClosedIcon color={'#6b7280'} />}
                                    </Pressable>

                                </View>

                                {message && (
                                    <Text className="text-red-500 text-sm mt-1">{message}</Text>
                                )}
                                {errors.senha && (
                                    <Text className="text-red-500 text-sm mt-1">
                                        {errors.senha.message}
                                    </Text>
                                )}
                            </View>

                            <View className="flex-row items-center justify-between mb-6">
                                <Controller
                                    control={control}
                                    name="connected"
                                    render={({ field: { onChange, value } }) => (
                                        <Checkbox
                                            checkboxClasses="w-5 h-5"
                                            label="Continuar logado"
                                            isSelected={value}
                                            onValueChange={onChange}
                                            labelClasses="text-sm text-gray-500"
                                        />
                                    )}
                                />

                                <Button
                                    variant="link"
                                    label="Esqueci minha senha"
                                    className="p-0"
                                    labelClasses="text-sm text-gray-500"
                                    onPress={recoverPasswordHandle}
                                />

                            </View>

                            <Button
                                disabled={loading}
                                label={
                                    loading
                                        ? <ActivityIndicator color="white" size="small" />
                                        : 'Entrar'
                                }
                                onPress={handleSubmit(onSubmit)}
                                className="py-3 rounded-lg"
                                labelClasses="text-white font-semibold"
                            />

                            <View className="items-center mt-6">
                                <Link href="/sign-in" asChild>
                                    <Button
                                        variant="link"
                                        label="Voltar"
                                        labelClasses="text-blue-600"
                                    />
                                </Link>
                            </View>

                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    )
}