import { View, Text, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigInSchema, sigInSchema } from '@/schemas/signIn'
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, LockIcon } from 'lucide-react-native';
import { maskCpfCnpj, unMask } from '@/utils/mask';
import { softCardShadow } from '@/styles/shadows';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const LAST_AUTH_CUSTOMER_KEY = 'last-auth-customer';

type LastAuthCustomer = {
    cpfcnpj: string;
    nomeCliente: string;
    codigoCliente: string;
};

function getParamValue(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export default function SignIn() {
    const { signIn, loading, message } = useAuth();
    const params = useLocalSearchParams();
    const redirectTo = getParamValue(params?.redirectTo);
    const [loadingBack, setLoadingBack] = React.useState(false);
    const [checkingSavedCustomer, setCheckingSavedCustomer] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;

        async function redirectSavedCustomerWithBiometrics() {
            try {
                const hasHardware = await LocalAuthentication.hasHardwareAsync();
                const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                if (!hasHardware || !isEnrolled) {
                    return;
                }

                const storedCustomer = await SecureStore.getItemAsync(LAST_AUTH_CUSTOMER_KEY);

                if (!storedCustomer) {
                    return;
                }

                const customer = JSON.parse(storedCustomer) as Partial<LastAuthCustomer>;

                if (!customer.cpfcnpj || !customer.nomeCliente || !customer.codigoCliente) {
                    return;
                }

                router.replace({
                    pathname: '/check-password',
                    params: {
                        cpfcnpj: customer.cpfcnpj,
                        nomeCliente: customer.nomeCliente,
                        codigoCliente: customer.codigoCliente,
                        ...(redirectTo ? { redirectTo } : {}),
                    },
                });
            } catch (error) {
                console.log('Erro ao carregar cliente salvo para biometria:', error);
            } finally {
                if (mounted) {
                    setCheckingSavedCustomer(false);
                }
            }
        }

        redirectSavedCustomerWithBiometrics();

        return () => {
            mounted = false;
        };
    }, [redirectTo]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<SigInSchema>({
        defaultValues: {
            cpfcnpj: '',
        },
        resolver: zodResolver(sigInSchema),
    });

    const onSubmit = async (data: SigInSchema) => {
        Keyboard.dismiss();
        await signIn(unMask(data.cpfcnpj), redirectTo);
        reset();
    };

    const handleGoBack = () => {
        setLoadingBack(true);
        setTimeout(() => {
            setLoadingBack(false);
            router.replace('/');
        }, 500);
    }

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            {checkingSavedCustomer ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="white" size="large" />
                </View>
            ) : (
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
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className='flex-1 justify-center px-6 py-8'>

                            {/* LOGO */}
                            <View className='items-center mb-8'>
                                <Image
                                    source={require('@/assets/images/logo_lojas_solar.png')}
                                    style={{ width: 180, height: 32 }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* CARD */}
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
                                        <LockIcon size={28} color="white" />
                                    </View>

                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-800">
                                            Acessar sua conta
                                        </Text>

                                        <Text className="mt-1 text-xs text-gray-400">
                                            Informe seu CPF/CNPJ para continuar
                                        </Text>
                                    </View>
                                </View>

                                {/* INPUT */}
                                <View className='mb-4'>
                                    <Controller
                                        control={control}
                                        name={'cpfcnpj'}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                autoFocus
                                                placeholder='000.000.000-00 ou 00.000.000/0000-00'
                                                keyboardType='numeric'
                                                value={maskCpfCnpj(value)}
                                                onChangeText={(text) => onChange(unMask(text) ?? '')}
                                                onBlur={onBlur}
                                                maxLength={18}
                                                inputClasses={`${errors.cpfcnpj || message ? '!border-solar-orange-secondary' : ''} text-gray-800 placeholder:text-gray-400`}
                                            />
                                        )}
                                    />

                                    {message && <Text className='text-red-500'>{message}</Text>}
                                    {errors.cpfcnpj && <Text className='text-red-500'>{errors.cpfcnpj.message}</Text>}
                                </View>

                                {/* BOTÃO */}
                                <Button
                                    disabled={loading}
                                    label={
                                        loading
                                            ? <ActivityIndicator color={'white'} size={'small'} />
                                            : 'Continuar'
                                    }
                                    onPress={handleSubmit(onSubmit)}
                                    className="mt-3 rounded-xl py-3"
                                    labelClasses="text-white font-semibold"
                                />
                                </View>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
            )}
        </ScreenLayout>

    )
}
