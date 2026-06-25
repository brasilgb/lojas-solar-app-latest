import { View, Text, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckPasswordSchema, checkPasswordSchema } from '@/schemas/signIn'
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, EyeClosedIcon, EyeIcon, FingerprintIcon } from 'lucide-react-native';
import { Checkbox } from '@/components/Checkbox';
import { unMask } from '@/utils/mask';
import { softCardShadow } from '@/styles/shadows';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const LAST_AUTH_CUSTOMER_KEY = 'last-auth-customer';

function getParamValue(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function maskDocument(value: string | string[] | undefined) {
    const digits = unMask(String(getParamValue(value) ?? '').trim());

    if (digits.length <= 5) {
        return digits;
    }

    return `${'*'.repeat(3)}${digits.slice(3, -2)}${'*'.repeat(2)}`;
}

function getInitials(value: string | string[] | undefined) {
    const name = String(getParamValue(value) ?? '').trim();
    const parts = name.split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return '--';
    }

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function SignIn() {
    const params = useLocalSearchParams()
    const { checkPassword, loginWithBiometrics, recoverPasswordSubmit, loading, message } = useAuth();
    const [isSecure, setIsSecure] = useState<boolean>(true);
    const [loadingBack, setLoadingBack] = React.useState(false);
    const [biometricsAvailable, setBiometricsAvailable] = useState(false);

    React.useEffect(() => {
        let mounted = true;

        async function loadBiometricsAvailability() {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (mounted) {
                setBiometricsAvailable(hasHardware && isEnrolled);
            }
        }

        loadBiometricsAvailability();

        return () => {
            mounted = false;
        };
    }, []);

    React.useEffect(() => {
        async function saveLastAuthCustomer() {
            const cpfcnpj = unMask(String(getParamValue(params?.cpfcnpj) ?? '').trim());
            const nomeCliente = getParamValue(params?.nomeCliente);
            const codigoCliente = getParamValue(params?.codigoCliente);

            if (!biometricsAvailable || !cpfcnpj || !nomeCliente || !codigoCliente) {
                return;
            }

            await SecureStore.setItemAsync(
                LAST_AUTH_CUSTOMER_KEY,
                JSON.stringify({
                    cpfcnpj,
                    nomeCliente,
                    codigoCliente,
                }),
            );
        }

        saveLastAuthCustomer();
    }, [biometricsAvailable, params?.codigoCliente, params?.cpfcnpj, params?.nomeCliente]);

    const { control, handleSubmit, formState: { errors } } = useForm<CheckPasswordSchema>({
        defaultValues: {
            senha: '',
            connected: false,
        },
        resolver: zodResolver(checkPasswordSchema),
    });

    const onSubmit: SubmitHandler<CheckPasswordSchema> = async (data: CheckPasswordSchema) => {

        const credentials = {
            codigoCliente: getParamValue(params?.codigoCliente),
            nomeCliente: getParamValue(params?.nomeCliente),
            cpfcnpj: unMask(String(getParamValue(params?.cpfcnpj) ?? '').trim()),
            senha: data.senha,
            connected: biometricsAvailable ? true : data.connected,
            redirectTo: getParamValue(params?.redirectTo),
        };
        await checkPassword(credentials);
    };

    const recoverPasswordHandle = async () => {
        await recoverPasswordSubmit(unMask(String(getParamValue(params?.cpfcnpj) ?? '').trim()));
    }

    const handleBiometricLogin = async () => {
        await loginWithBiometrics({
            codigoCliente: getParamValue(params?.codigoCliente),
            nomeCliente: getParamValue(params?.nomeCliente),
            cpfcnpj: unMask(String(getParamValue(params?.cpfcnpj) ?? '').trim()),
            redirectTo: getParamValue(params?.redirectTo),
        });
    }

    const handleGoBack = () => {
        setLoadingBack(true);
        setTimeout(() => {
            setLoadingBack(false);
            router.replace('/');
        }, 500);
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
                    <View className='flex-1 justify-center px-6 py-8'>

                        <View className='items-center mb-8'>
                            <Image
                                source={require('@/assets/images/logo_lojas_solar.png')}
                                style={{ width: 180, height: 32 }}
                                resizeMode="contain"
                            />
                        </View>

                        <View className='overflow-hidden rounded-[28px] bg-white' style={softCardShadow}>
                            <View className="p-6">
                            <View className='absolute top-4 left-4 z-10 flex-row items-center gap-1'>
                                <TouchableOpacity
                                    onPress={() => handleGoBack()}
                                    className="h-10 w-10 items-center justify-center rounded-full bg-blue-50"
                                >
                                    {loadingBack ?
                                        <View className='flex-1 justify-center items-center'>
                                            <ActivityIndicator size={'small'} color={'#1a9cd9'} />
                                        </View>
                                        :
                                        <ArrowLeftIcon size={22} color={'#1a9cd9'} />
                                    }
                                </TouchableOpacity>
                            </View>

                            <View className="mb-6 mt-10 rounded-2xl bg-blue-50 p-4 flex-row items-center">
                                <View className="mr-3 h-14 w-14 items-center justify-center rounded-full bg-solar-blue-primary">
                                    <Text className="text-lg font-bold text-white">
                                        {getInitials(params?.nomeCliente)}
                                    </Text>
                                </View>

                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
                                        {getParamValue(params?.nomeCliente)}
                                    </Text>

                                    <Text className="mt-1 text-xs text-gray-400">
                                        CPF/CNPJ: <Text className="font-medium text-gray-500">{maskDocument(params?.cpfcnpj)}</Text>
                                    </Text>
                                </View>
                            </View>

                            <View className="w-full mb-4">
                                <View className="relative">

                                    <Controller
                                        control={control}
                                        name="senha"
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                autoFocus
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

                            <View className={`flex-row items-center mb-6 ${biometricsAvailable ? 'justify-end' : 'justify-between'}`}>
                                {!biometricsAvailable && (
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
                                )}

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
                                className="py-3 rounded-xl"
                                labelClasses="text-white font-semibold"
                            />

                            {biometricsAvailable && (
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={handleBiometricLogin}
                                    className="mt-3 h-12 flex-row items-center justify-center rounded-xl border border-solar-blue-primary bg-blue-50"
                                >
                                    <FingerprintIcon size={20} color="#1a9cd9" />
                                    <Text className="ml-2 text-base font-semibold text-solar-blue-primary">
                                        Entrar com biometria
                                    </Text>
                                </TouchableOpacity>
                            )}
                            </View>

                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    )
}
