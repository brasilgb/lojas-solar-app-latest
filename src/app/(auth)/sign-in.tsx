import { View, Text, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
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
import { maskCpfCnpj, unMask } from '@/utils/mask';
import { softCardShadow } from '@/styles/shadows';

export default function SignIn() {
    const { signIn, loading, message } = useAuth();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<SigInSchema>({
        defaultValues: {
            cpfcnpj: '',
        },
        resolver: zodResolver(sigInSchema),
    });

    const onSubmit = async (data: SigInSchema) => {
        Keyboard.dismiss();
        await signIn(data.cpfcnpj);
        reset();
    };

// {
// 	"MerchantOrderId": "21241113105",
// 	"Payment": {
// 		"Type": "CreditCard",
// 		"Amount": 100,
// 		"Currency": "BRL",
// 		"Country": "BRA",
// 		"Provider": "Cielo",
// 		"ServiceTaxAmount": 0,
// 		"Installments": 1,
// 		"Interest": "ByMerchant",
// 		"Capture": true,
// 		"Authenticate": false,
// 		"Recurrent": false,
// 		"SoftDescriptor": "123456789ABCD",
// 		"CreditCard": {
// 			"CardNumber": "4985810092486672",
// 			"Holder": "TESTE",
// 			"ExpirationDate": "02/2032",
// 			"SecurityCode": "775",
// 			"SaveCard": false,
// 			"Brand": "visa"
// 		}
// 	}
// }



// {
// 	"response": {
// 		"success": true,
// 		"MerchantOrderId": "21241113105",
// 		"PaymentId": "93d32b80-67ff-43ec-b7b1-974e1a698370",
// 		"Tid": "11316610415HHJCA6INE",
// 		"AuthorizationCode": "D2S7ZR",
// 		"ReturnCode": "00",
// 		"ReturnMessage": "Transacao capturada com sucesso",
// 		"Amount": 100,
// 		"ReceivedDate": "2026-04-10 11:23:52",
// 		"Status": 0
// 	}
// }

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
                                                onChangeText={onChange}
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
