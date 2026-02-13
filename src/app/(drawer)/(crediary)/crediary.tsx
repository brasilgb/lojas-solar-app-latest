import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { HandshakeIcon } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import appservice from '@/services/appservice';
import { Input } from '@/components/Input';
import { maskCep, maskCpfCnpj, maskMoney, unMask } from '@/utils/mask';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { crediarySchema, CrediarySchema } from '@/schemas/crediary';
import DataModal from '@/components/DataModal';

export default function Crediary() {
    const { user, disconnect, setInfoCustomerToExcludeData } = useAuth();
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [itemSelecionado, setItemSelecionado] = useState<{ id: any; label: string } | null>(null);
    const [crediary, setCrediary] = useState<any>([]);
    const [escolaridade, setEscolaridade] = useState<any>([]);
    const [estadoCivil, setEstadoCivil] = useState<any>([]);
    const [profissao, setProfissao] = useState<any>([]);
    const [genero, setGenero] = useState<any>(
        [
            { id: 1, label: 'Masculino' },
            { id: 2, label: 'Feminino' }
        ]
    )

    const [modalConfig, setModalConfig] = useState<{
        type: 'escolaridade' | 'estadoCivil' | 'profissao' | 'sexo' | null;
        items: any[];
    }>({ type: null, items: [] });

    const openModal = (type: 'escolaridade' | 'estadoCivil' | 'profissao' | 'sexo', data: any[]) => {
        setModalConfig({ type, items: data });
        setModalVisible(true);
    };

    useEffect(() => {
        const getEscolaridade = async () => {
            try {
                const response = await appservice.get(`(WS_ESCOLARIDADE)`);
                const { data } = response.data.resposta;
                const escolData = data.map((pr: any, index: number) => ({
                    id: index,
                    label: pr.escolaridade
                }));
                setEscolaridade(escolData);
            } catch (error) {
                console.log(error);
            }
        };
        getEscolaridade();
    }, []);

    useEffect(() => {
        const getEstadoCivil = async () => {
            try {
                const response = await appservice.get(`(WS_ESTADO_CIVIL)`);
                const { data } = response.data.resposta;
                const estCivData = data.map((pr: any, index: number) => ({
                    id: index,
                    label: pr.estadoCivil
                }));
                setEstadoCivil(estCivData);
            } catch (error) {
                console.log(error);
            }
        };
        getEstadoCivil();
    }, []);

    useEffect(() => {
        const getProfissao = async () => {
            try {
                const response = await appservice.get(`(WS_PROFISSAO)`);
                const { data } = response.data.resposta;
                const profData = data.map((pr: any, index: number) => ({
                    id: index,
                    label: pr.profissao
                }));
                setProfissao(profData);
            } catch (error) {
                console.log(error);
            }
        };
        getProfissao();
    }, []);

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

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CrediarySchema>({
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

    const estadoCivilAtual = watch('estadoCivil');

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
            <DataModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                items={modalConfig.items}
                onSelect={(item) => {
                    if (modalConfig.type) {
                        // Atualiza o valor no React Hook Form dinamicamente
                        setValue(modalConfig.type, item.label, { shouldValidate: true });
                        if (modalConfig.type === 'estadoCivil' && item.label.toUpperCase() !== 'CASADO') {
                            setValue('nomeConjuge', '');
                            setValue('cpfConjuge', '');
                        }
                    }
                    setModalVisible(false);
                }}
            />

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
                                <TouchableOpacity onPress={() => openModal('sexo', genero)}>
                                    <Controller
                                        control={control}
                                        name="sexo"
                                        render={({ field: { value } }) => (
                                            <View pointerEvents="none">
                                                <Input label="Genero" value={value} editable={false} />
                                            </View>
                                        )}
                                    />
                                </TouchableOpacity>
                                {errors.sexo && <Text className='text-red-500'>{errors.sexo.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <TouchableOpacity onPress={() => openModal('escolaridade', escolaridade)}>
                                    <Controller
                                        control={control}
                                        name="escolaridade"
                                        render={({ field: { value } }) => (
                                            <View pointerEvents="none">
                                                <Input label="Escolaridade" value={value} editable={false} />
                                            </View>
                                        )}
                                    />
                                </TouchableOpacity>
                                {errors.escolaridade && <Text className='text-red-500'>{errors.escolaridade.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'localTrabalho'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Local do trabalho'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            inputClasses={`${errors.localTrabalho ? '!border-solar-orange-secondary' : ''} text-gray-800`}
                                        />
                                    )}
                                />
                                {errors.localTrabalho && <Text className='text-red-500'>{errors.localTrabalho.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <TouchableOpacity onPress={() => openModal('estadoCivil', estadoCivil)}>
                                    <Controller
                                        control={control}
                                        name="estadoCivil"
                                        render={({ field: { value } }) => (
                                            <View pointerEvents="none">
                                                <Input label="Estado Civil" value={value} editable={false} />
                                            </View>
                                        )}
                                    />
                                </TouchableOpacity>
                                {errors.estadoCivil && <Text className='text-red-500'>{errors.estadoCivil.message}</Text>}
                            </View>

                            {estadoCivilAtual?.toUpperCase() === 'CASADO' && (
                                <View className="w-full gap-4 mt-2">
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
                                </View>
                            )}

                            <View className='w-full'>
                                <TouchableOpacity onPress={() => openModal('profissao', profissao)}>
                                    <Controller
                                        control={control}
                                        name="profissao"
                                        render={({ field: { value } }) => (
                                            <View pointerEvents="none">
                                                <Input label="Profissão" value={value} editable={false} />
                                            </View>
                                        )}
                                    />
                                </TouchableOpacity>
                                {errors.profissao && <Text className='text-red-500'>{errors.profissao.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Controller
                                    control={control}
                                    name={'renda'}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <Input
                                            label={'Renda'}
                                            value={maskMoney(String(value))}
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
                                    label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Continuar'}
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