import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterPasswordFormType, RegisterPasswordSchema } from '@/schemas/signIn';
import appservice from '@/services/appservice';
import { maskPhone } from '@/utils/mask';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { EyeClosedIcon, EyeIcon, KeyRoundIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RegisterPassword = () => {
  const params = useLocalSearchParams<any>();
  const { bottom } = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(false);
  const { user, setUser, disconnect } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterPasswordFormType>({
    defaultValues: {},
    resolver: zodResolver(RegisterPasswordSchema),
  });

  const onSubmit: SubmitHandler<RegisterPasswordFormType> = async (
    data: RegisterPasswordFormType,
  ) => {
    Keyboard.dismiss();
    setLoading(true);
    await appservice
      .get(
        `(WS_ALTERAR_SENHA_APP)?cpfcnpj=${params.cpfcnpj}&senha=${data.senha}&emailCliente=${data.email}&celularCliente=${data.celular}`,
      )
      .then(response => {
        const { message, success } = response?.data?.resposta;

        if (!success) {
          setModalVisible(true);
          setModalMessage(message);
          setModalTitle('Erro!');
          return;
        }

        reset();
        setModalVisible(true);
        setModalMessage(message);
        setModalTitle('Cadastrar Senha');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        router.replace({
          pathname: '/password-changed',
          params: {
            cpfcnpj: params.cpfcnpj,
          },
        } as any);
      });
  };

  return (
    <ScreenLayout backgroundColor="bg-solar-blue-primary">
      <View className='flex-1 bg-white rounded-t-3xl p-6'>
        <PageHeader
          title="Registrar uma senha"
          subtitle="Preencha os campos corretamente"
          description="Para registrar sua senha digite digite nos campos abaixo."
          icon={<KeyRoundIcon size={26} color="#1a9cd9" />}
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
              <View className='w-full mt-2'>
                <View className='relative'>
                  <Controller
                    control={control}
                    render={({
                      field: { onChange, onBlur, value },
                    }) => (
                      <View>
                        <Input
                          label="E-mail"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          inputClasses={`${errors.email ? '!border-solar-red-primary' : ''}`}
                        />
                      </View>
                    )}
                    name="email"
                  />
                  {errors.email && (
                    <Text className='text-red-500'>
                      {errors.email?.message}
                    </Text>
                  )}

                  <Controller
                    control={control}
                    render={({
                      field: { onChange, onBlur, value },
                    }) => (
                      <View>
                        <Input
                          label="Celular"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={maskPhone(value)}
                          inputClasses={`${errors.celular ? '!border-solar-red-primary' : ''}`}
                        />
                      </View>
                    )}
                    name="celular"
                  />
                  {errors.celular && (
                    <Text className='text-red-500'>
                      {errors.celular?.message}
                    </Text>
                  )}

                  <Controller
                    control={control}
                    render={({
                      field: { onChange, onBlur, value },
                    }) => (
                      <View className="relative">
                        <Input
                          label="Nova senha"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          inputClasses={`${errors.senha ? '!border-solar-red-primary' : ''} text-gray-800`}
                          secureTextEntry={!showPassword}
                        />
                        <View className="absolute right-4 top-9 ">
                          {showPassword ? (
                            <EyeClosedIcon
                              size={30}
                              color={'#777777'}
                              onPress={() =>
                                setShowPassword(
                                  !showPassword,
                                )
                              }
                            />
                          ) : (
                            <EyeIcon
                              size={30}
                              color={'#777777'}
                              onPress={() =>
                                setShowPassword(
                                  !showPassword,
                                )
                              }
                            />
                          )}
                        </View>
                      </View>
                    )}
                    name="senha"
                  />
                  {errors.senha && (
                    <Text className='text-red-500'>
                      {errors.senha?.message}
                    </Text>
                  )}

                  <Controller
                    control={control}
                    render={({
                      field: { onChange, onBlur, value },
                    }) => (
                      <View className="relative">
                        <Input
                          label="Repita a nova senha"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          inputClasses={`${errors.repitaSenha ? '!border-solar-red-primary' : ''} text-gray-800`}
                          secureTextEntry={!showPassword}
                        />
                        <View className="absolute right-4 top-9 ">
                          {showPassword ? (
                            <EyeClosedIcon
                              size={30}
                              color={'#777777'}
                              onPress={() =>
                                setShowPassword(
                                  !showPassword,
                                )
                              }
                            />
                          ) : (
                            <EyeIcon
                              size={30}
                              color={'#777777'}
                              onPress={() =>
                                setShowPassword(
                                  !showPassword,
                                )
                              }
                            />
                          )}
                        </View>
                      </View>
                    )}
                    name="repitaSenha"
                  />
                  {errors.repitaSenha && (
                    <Text className='text-red-500'>
                      {errors.repitaSenha?.message}
                    </Text>
                  )}
                </View>

              </View>
            </View>
            <View className='w-full py-4'>
              <Button
                disabled={loading}
                label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Alterar'}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenLayout>
  );
};

export default RegisterPassword;
