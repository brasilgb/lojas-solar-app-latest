import { View, Text, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigInSchema, sigInSchema } from '@/schemas/signIn'
import { Link, router } from 'expo-router';
import { ArrowLeftIcon, UserRoundCheckIcon } from 'lucide-react-native';
import { maskCpfCnpj, unMask } from '@/utils/mask';
import { softCardShadow } from '@/styles/shadows';

export default function SignIn() {
    const { signIn, loading, message } = useAuth();
    const [loadingBack, setLoadingBack] = React.useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<SigInSchema>({
        defaultValues: {
            cpfcnpj: '',
        },
        resolver: zodResolver(sigInSchema),
    });

    const onSubmit = async (data: SigInSchema) => {
        Keyboard.dismiss();
        await signIn(unMask(data.cpfcnpj));
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
                        <View className='flex-1 justify-center px-6'>

                            {/* LOGO */}
                            <View className='items-center mb-10'>
                                <Image
                                    source={require('@/assets/images/logo_lojas_solar.png')}
                                    style={{ width: 180, height: 32 }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* CARD */}
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

                                {/* ÍCONE */}
                                <View className='items-center mb-4'>
                                    <UserRoundCheckIcon size={48} color={'#1a9cd9'} />
                                </View>

                                {/* TEXTO */}
                                <View className='items-center mb-6'>
                                    <Text className="text-2xl font-bold text-gray-800">
                                        Acessar conta
                                    </Text>
                                    <Text className="text-gray-500 text-center mt-1">
                                        Digite seu CPF ou CNPJ para continuar
                                    </Text>
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
                                    className="mt-2"
                                />

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>

    )
}
