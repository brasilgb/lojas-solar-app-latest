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
import { ArrowLeftIcon, EyeClosedIcon, EyeIcon, FingerprintIcon, KeyRoundIcon } from 'lucide-react-native';
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

    return `${digits.slice(0, 3)}${'*'.repeat(digits.length - 5)}${digits.slice(-2)}`;
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
                    <View className='flex-1 justify-center px-6'>

                        <View className='items-center mb-10'>
                            <Image
                                source={require('@/assets/images/logo_lojas_solar.png')}
                                style={{ width: 180, height: 32 }}
                                resizeMode="contain"
                            />
                        </View>

                        <View className='bg-white rounded-3xl p-6' style={softCardShadow}>
                            <View className='absolute top-4 left-4 flex-row items-center gap-1'>
                                <TouchableOpacity
                                    onPress={() => handleGoBack()}
                                    className="p-2"
                                >
                                    {loadingBack ?
                                        <View className='flex-1 justify-center items-center'>
                                            <ActivityIndicator size={'large'} color={'#1a9cd9'} />
                                        </View>
                                        :
                                        <ArrowLeftIcon size={25} color={'#1a9cd9'} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View className="items-center mb-6">
                                <View className="bg-blue-100 p-3 rounded-full mb-3">
                                    <KeyRoundIcon size={28} color="#1a9cd9" />
                                </View>

                                <Text className="text-xl font-bold text-gray-900">
                                    Acessar conta
                                </Text>

                                <Text className="text-sm text-gray-500 mt-1 text-center">
                                    {String(getParamValue(params?.nomeCliente) ?? '').split(" ")[0]}, digite sua senha para continuar
                                </Text>

                                <Text className="text-xs text-gray-400 mt-1">
                                    CPF/CNPJ: <Text className="font-medium text-gray-600">{maskDocument(params?.cpfcnpj)}</Text>
                                </Text>
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
                                className="py-3 rounded-lg"
                                labelClasses="text-white font-semibold"
                            />

                            {biometricsAvailable && (
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={handleBiometricLogin}
                                    className="mt-3 h-12 flex-row items-center justify-center rounded-lg border border-solar-blue-primary"
                                >
                                    <FingerprintIcon size={20} color="#1a9cd9" />
                                    <Text className="ml-2 text-base font-semibold text-solar-blue-primary">
                                        Entrar com biometria
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    )
}
