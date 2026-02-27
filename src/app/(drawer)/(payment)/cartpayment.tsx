"use client";

import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { CartPaymentFormType, CartPaymentSchema } from "@/schemas/payment";
import appservice from "@/services/appservice";
import { maskCreditCart, maskDateValidate, maskMoney, unMask } from "@/utils/mask";
import servicecart from "@/services/servicecart";
import { getCardBrandName } from "@/lib/creditcart";
import { PageHeader } from "@/components/PageHeader";
import { HandCoinsIcon, LockIcon } from "lucide-react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

type RegisteredOrder = {
    numeroOrdem: string;
    valorOrdem: number;
    dadosCartao: {
        numeroCartao: string;
        nomeCartao: string;
        validadeCartao: string;
        cvvCartao: string;
    };
};

const CartPayment: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [registeredOrder, setRegisteredOrder] = useState<RegisteredOrder | null>(null);
    const params = useLocalSearchParams();
    const order = JSON.parse(params?.dataOrder as string);
    const orderTotal = parseFloat(String(params?.totalAmount)).toFixed(2);
    const mtoken = user?.token;

    const { control, handleSubmit, formState: { errors } } = useForm<CartPaymentFormType>({
        defaultValues: {
            numeroCartao: "",
            nomeCartao: "",
            validadeCartao: "",
            cvvCartao: "",
        },
        resolver: zodResolver(CartPaymentSchema),
    });

    const onSubmit = async (values: CartPaymentFormType) => {
        setLoading(true);
        try {
            await processOrder(values);
        } catch (err: any) {
            Alert.alert("Erro", err.message || "Não foi possível processar o pagamento.");
        } finally {
            setLoading(false);
        }
    };

    const processOrder = async (values: CartPaymentFormType) => {
        let orderData = registeredOrder;

        // 1. Registrar ordem no backend se ainda não tiver
        if (!orderData) {
            const response = await appservice.post("(WS_ORDEM_PAGAMENTO)", {
                token: mtoken,
                valor: orderTotal,
                parcela: order,
                tipoPagamento: 2,
                validaDados: "S",
                dadosCartao: {
                    numeroCartao: maskCreditCart(values.numeroCartao),
                    nomeCartao: values.nomeCartao,
                    validadeCartao: maskDateValidate(values.validadeCartao),
                    cvvCartao: values.cvvCartao,
                },
            });

            const { success, message, data } = response.data.resposta;

            if (!success) throw new Error(message);

            orderData = data;
            setRegisteredOrder(data);
        }

        // 2. Processar pagamento no gateway (Cielo)
        const paymentResponse = await servicecart.post("(PAG_CARTAO_CREDITO)", {
            MerchantOrderId: orderData?.numeroOrdem,
            Payment: {
                Type: "CreditCard",
                Amount: Number(orderData?.valorOrdem) * 100,
                Currency: "BRL",
                Country: "BRA",
                Provider: "Cielo",
                ServiceTaxAmount: 0,
                Installments: 1,
                Interest: "ByMerchant",
                Capture: true,
                Authenticate: false,
                Recurrent: false,
                SoftDescriptor: "123456789ABCD",
                CreditCard: {
                    CardNumber: unMask(orderData?.dadosCartao?.numeroCartao),
                    Holder: orderData?.dadosCartao.nomeCartao,
                    ExpirationDate: orderData?.dadosCartao.validadeCartao,
                    SecurityCode: orderData?.dadosCartao.cvvCartao,
                    SaveCard: false,
                    Brand: getCardBrandName(String(orderData?.dadosCartao?.numeroCartao)),
                },
            },
        });

        const { success, ReturnMessage, ReturnCode, PaymentId } = paymentResponse.data.response;

        if (!success || ReturnCode !== "00") {
            throw new Error(ReturnMessage || "Erro ao processar pagamento no gateway.");
        }

        // 3. Atualizar ordem no backend
        const updateResponse = await appservice.get(
            `(WS_ATUALIZA_ORDEM)?token=${mtoken}&numeroOrdem=${orderData?.numeroOrdem}&statusOrdem=2&idTransacao=${PaymentId}&tipoPagamento=2&urlBoleto=${paymentResponse.data.response.AuthorizationCode}`
        );

        const { success: updateSuccess } = updateResponse.data.resposta;
        if (!updateSuccess) throw new Error("Falha ao atualizar status da ordem.");

        // 4. Limpar estado e redirecionar
        setRegisteredOrder(null);
        router.replace("/cardbillpaid");
    };

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-6'>

                <PageHeader
                    title="Pagamento"
                    subtitle="Cartão de crédito"
                    description="Informe os dados do seu cartão."
                    icon={<HandCoinsIcon size={26} color="#1a9cd9" />}
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

                        <View className="bg-white rounded-t-3xl px-5 pt-6 pb-10">

                            <View className="items-center mb-6">
                                <Text className="text-sm text-gray-400">
                                    Total a pagar
                                </Text>
                                <Text className="text-3xl font-extrabold text-solar-blue-secondary mt-1">
                                    R$ {maskMoney(parseFloat(orderTotal).toFixed(2))}
                                </Text>
                            </View>

                            <View className="gap-4">

                                <Controller
                                    control={control}
                                    name="numeroCartao"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Número do cartão"
                                            placeholder="0000 0000 0000 0000"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={maskCreditCart(value)}
                                            inputClasses={errors.numeroCartao ? "!border-solar-red-primary" : ""}
                                            keyboardType="numeric"
                                            maxLength={19}
                                        />
                                    )}
                                />
                                {errors.numeroCartao && (
                                    <Text className="text-solar-red-primary text-sm">
                                        {errors.numeroCartao.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    name="nomeCartao"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Nome no cartão"
                                            placeholder="Como está no cartão"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            autoCapitalize="characters"
                                            inputClasses={errors.nomeCartao ? "!border-solar-red-primary" : ""}
                                        />
                                    )}
                                />
                                {errors.nomeCartao && (
                                    <Text className="text-solar-red-primary text-sm">
                                        {errors.nomeCartao.message}
                                    </Text>
                                )}

                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <Controller
                                            control={control}
                                            name="validadeCartao"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <Input
                                                    label="Validade"
                                                    placeholder="MM/AA"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={maskDateValidate(value)}
                                                    keyboardType="numeric"
                                                    maxLength={5}
                                                    inputClasses={errors.validadeCartao ? "!border-solar-red-primary" : ""}
                                                />
                                            )}
                                        />
                                    </View>

                                    <View className="flex-1">
                                        <Controller
                                            control={control}
                                            name="cvvCartao"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <Input
                                                    label="CVV"
                                                    placeholder="123"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    keyboardType="numeric"
                                                    maxLength={4}
                                                    inputClasses={errors.cvvCartao ? "!border-solar-red-primary" : ""}
                                                />
                                            )}
                                        />
                                    </View>
                                </View>

                            </View>

                            <View className="flex-row items-center justify-center mt-6 gap-2">
                                <LockIcon size={15} color={"#f9b233"} />
                                <Text className="text-xs text-gray-400">Pagamento seguro e criptografado</Text>
                            </View>

                        </View>
                    </ScrollView>
                    <View className="mt-6">
                        <Button
                            label={
                                loading
                                    ? <ActivityIndicator size="small" color="#bccf00" />
                                    : "Continuar pagamento"
                            }
                            variant="default"
                            size="lg"
                            disabled={loading}
                            onPress={handleSubmit(onSubmit)}
                            className="w-full"
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ScreenLayout>
    );
};

export default CartPayment;
