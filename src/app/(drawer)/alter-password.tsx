import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import { Button } from '@/components/Button'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { EyeClosedIcon, EyeIcon, KeyRoundIcon } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/Input'
import { AlterPasswordSchema, alterPasswordSchema } from '@/schemas/signIn'
import { zodResolver } from '@hookform/resolvers/zod'

export default function AlterPassword() {
    const { user, loading, message, alterPassword } = useAuth();
    const [isSecure, setIsSecure] = useState<boolean>(true);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<AlterPasswordSchema>({
        defaultValues: {
            senha: '',
            repitaSenha: '',
            senhaAnterior: ''
        },
        resolver: zodResolver(alterPasswordSchema),
    });

    const onSubmit: SubmitHandler<AlterPasswordSchema> = async (data: AlterPasswordSchema) => {
        const alterData = {
            cpfcnpj: user?.cpfcnpj,
            token: user?.token,
            senha: data.senha,
            senhaAnterior: data.senhaAnterior
        }
        await alterPassword(alterData)
        reset()
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
                                <KeyRoundIcon size={60} color={'#1a9cd9'} />
                            </View>
                            <View className="bg-white rounded-xl px-6 pb-4 flex-col justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-700">
                                    Alterar sua senha
                                </Text>
                                <Text className="text-gray-700">Para alterar sua senha </Text>
                                <Text className="text-gray-700">digite a senha antiga e a nova senha</Text>
                            </View>
                            <View className='w-full mt-2'>
                                <View className='relative'>
                                    <Controller
                                        control={control}
                                        name={'senhaAnterior'}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                secureTextEntry={isSecure}
                                                label={'Senha anterior'}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                inputClasses={`${errors.senhaAnterior ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                            />
                                        )}
                                    />
                                    {message && <Text className='text-red-500'>{message}</Text>}
                                    {errors.senhaAnterior && <Text className='text-red-500'>{errors.senhaAnterior.message}</Text>}
                                </View>
                                <View className='absolute right-0 top-6'>
                                    <Button variant={'link'} label={isSecure ? <EyeIcon /> : <EyeClosedIcon />} onPress={() => setIsSecure(!isSecure)} />
                                </View>
                            </View>
                            <View className='w-full mt-2'>
                                <View className='relative'>
                                    <Controller
                                        control={control}
                                        name={'senha'}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                secureTextEntry={isSecure}
                                                label='Nova senha'
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                inputClasses={`${errors.senha ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                            />
                                        )}
                                    />
                                    {errors.senha && <Text className='text-red-500'>{errors.senha.message}</Text>}
                                </View>
                                <View className='absolute right-0 top-6'>
                                    <Button variant={'link'} label={isSecure ? <EyeIcon /> : <EyeClosedIcon />} onPress={() => setIsSecure(!isSecure)} />
                                </View>
                            </View>
                            <View className='w-full mt-2'>
                                <View className='relative'>
                                    <Controller
                                        control={control}
                                        name={'repitaSenha'}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <Input
                                                secureTextEntry={isSecure}
                                                label='Repita a senha'
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                inputClasses={`${errors.repitaSenha ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                            />
                                        )}
                                    />
                                    {errors.repitaSenha && <Text className='text-red-500'>{errors.repitaSenha.message}</Text>}
                                </View>
                                <View className='absolute right-0 top-6'>
                                    <Button variant={'link'} label={isSecure ? <EyeIcon /> : <EyeClosedIcon />} onPress={() => setIsSecure(!isSecure)} />
                                </View>
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