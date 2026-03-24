import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { getCardBrandName } from "@/lib/creditcart";
import { CartPaymentFormType, CartPaymentSchema } from "@/schemas/payment";
import appservice from "@/services/appservice";
import servicecart from "@/services/servicecart";
import { maskCreditCart, maskDateValidate, maskMoney, unMask } from "@/utils/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { HandCoinsIcon, LockIcon } from "lucide-react-native";
import moment from "moment";
import 'moment/locale/pt-br';
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
moment.locale('pt-br');

// Define o que vem nos parâmetros da URL/Rota
interface OrderData {
    numeroOrdem: string | number;
    // adicione outras propriedades que existam no seu JSON
}

// Define o que o backend de Pix retorna
interface CartResponseData {
    MerchantOrderId: string;
    PaymentId: string;
    AuthorizationCode: string;
    CartNumber: string;
    ReceivedDate: string;
}

// Define a estrutura do que você envia para atualizar a ordem
interface OrderUpdatePayload {
    numeroOrdem: string | number;
    statusOrdem: number;
    idTransacao: string;
    tipoPagamento: number;
    urlBoleto: string;
    ReceivedDate: string;
}
/**
 *         MerchantOrderId, PaymentId, Authori
 */

const CartPayment = () => {

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const order = JSON.parse(params?.dataOrder as string);
    const valueOrder = String(params?.totalAmount);
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

    const pegarUltimosQuatro = (numero?: string): string => {
        if (!numero) return '****';
        // Remove tudo que não é dígito e pega os últimos 4
        const cleanNumber = numero.replace(/\D/g, '');
        return cleanNumber.slice(-4).padStart(4, '*');
    };

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

    async function processOrder(values: CartPaymentFormType) {

        const response = await appservice.post("(WS_ORDEM_PAGAMENTO)", {
            token: mtoken,
            valor: valueOrder,
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
        cartPaymentHandle(data);

    }

    async function cartPaymentHandle(data: any) {

        const paymentResponse = await servicecart.post("(PAG_CARTAO_CREDITO)", {
            MerchantOrderId: data?.numeroOrdem,
            Payment: {
                Type: "CreditCard",
                Amount: Math.round(parseFloat(valueOrder) * 100),
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
                    CardNumber: unMask(data?.dadosCartao?.numeroCartao),
                    Holder: data?.dadosCartao.nomeCartao,
                    ExpirationDate: data?.dadosCartao.validadeCartao,
                    SecurityCode: data?.dadosCartao.cvvCartao,
                    SaveCard: false,
                    Brand: getCardBrandName(String(data?.dadosCartao?.numeroCartao)),
                },
            },
        });

        const { success, ReturnCode, ReturnMessage, AuthorizationCode, PaymentId, ReceivedDate, MerchantOrderId } = paymentResponse.data.response;
        if (success && ReturnCode === '00') {
            await sendOrderAtualize({
                MerchantOrderId,
                PaymentId,
                AuthorizationCode,
                ReceivedDate,
                CartNumber: data?.dadosCartao?.numeroCartao
            });

        } else {
            Alert.alert("Atenção", `${ReturnMessage}, verifique os dados do cartão.` || "Pagamento negado pela operadora.");
        }
    };

    // 3. Atualizar ordem no backend
    async function sendOrderAtualize(dataCart: CartResponseData) {
        let orderResponse: OrderUpdatePayload = {
            numeroOrdem: dataCart.MerchantOrderId,
            statusOrdem: 2,
            idTransacao: dataCart.PaymentId,
            tipoPagamento: 2,
            urlBoleto: dataCart.AuthorizationCode,
            ReceivedDate: dataCart.ReceivedDate
        };
        try {
            const response = await appservice.get(
                `(WS_ATUALIZA_ORDEM)?token=${mtoken}&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`
            );

            const { success, message } = response.data.response;
            if (!success) {
                // Se o backend retornar success: false
                Alert.alert("Aviso", message || "Não foi possível atualizar o status da ordem.");
                return; // Interrompe para não redirecionar se for um erro crítico
            }

            router.replace({
                pathname: "/cardbillpaid",
                params: {
                    value: valueOrder,
                    paymentId: dataCart.PaymentId, // Removi o 'a' extra de 'payament'
                    lastCardNumber: pegarUltimosQuatro(dataCart.CartNumber),
                    dateTransaction: moment().format('DD [de] MMMM, HH:mm')
                }
            });

        } catch (error) {
            Alert.alert("Erro de Conexão", "O pagamento foi processado, mas houve um erro ao atualizar seu pedido.");
            console.error('erro 01', error);
        }
    };

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-4 gap-2'>

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
                                    R$ {maskMoney(parseFloat(valueOrder).toFixed(2))}
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
                                                    maxLength={7}
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
