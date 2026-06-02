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
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
moment.locale('pt-br');

// Define o que vem nos parâmetros da URL/Rota
interface OrderData {
    numeroOrdem: string | number;
    OrderNumber?: string | number;
    Detail?: {
        OrderNumber?: string | number;
    };
    // adicione outras propriedades que existam no seu JSON
}

// Define o que o backend de Pix retorna
interface CartResponseData {
    MerchantOrderId: string;
    PaymentId: string;
    AuthorizationCode: string;
    CartNumber: string;
    ReceivedDate: string;
    parcelasSelecionadas?: SelectedInstallment[];
}

interface SelectedInstallment {
    numeroCarne: string | number;
    parcela: string | number;
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

const approvedReturnCodes = ['00', '0', '6'];
const PAYMENT_SYSTEM_TOKEN = process.env.EXPO_PUBLIC_PAYMENT_SYSTEM_TOKEN || '91362590064312210014616';

const CartPayment = () => {
    const { user, disconnect } = useAuth();
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const order = JSON.parse(params?.dataOrder as string);
    const valueOrder = String(params?.totalAmount);
    const mtoken = user?.token;

    const getInstallmentNumber = (parcela: string | number) =>
        parseInt(String(parcela).slice(0, 2), 10);

    const selectedInstallments = (Array.isArray(order) ? order : [order])
        .filter(Boolean)
        .map((item: any) => ({
            numeroCarne: item.numeroCarne,
            filial: item.filial,
            parcela: getInstallmentNumber(item.parcela),
            vencimento: item.vencimento,
            atraso: item.atraso,
            vlprest: item.vlprest,
            acrescimo: item.acrescimo,
            total: item.total,
            status: item.status,
            urlBoleto: item.urlBoleto,
        }));

    const paymentContractPayload =
        selectedInstallments.length === 1
            ? selectedInstallments[0].numeroCarne
            : selectedInstallments.map((item: any) => item.numeroCarne);

    const [isCriticalError, setIsCriticalError] = useState(false);
    const [paymentData, setPaymentData] = useState<CartResponseData | null>(null);

    const getOrderNumber = (data: OrderData) =>
        data.numeroOrdem ?? data.OrderNumber ?? data.Detail?.OrderNumber;

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
            numeroCarne: paymentContractPayload,
            parcela: selectedInstallments,
            parcelas: selectedInstallments,
            tipoPagamento: 2,
            validaDados: "S",
            dadosCartao: {
                numeroCartao: maskCreditCart(values.numeroCartao),
                nomeCartao: values.nomeCartao,
                validadeCartao: maskDateValidate(values.validadeCartao),
                cvvCartao: values.cvvCartao,
            },
        });
        const { success, message, token, data } = response.data.resposta;
        if (!token) {
            Alert.alert('Atenção', message, [
                {
                    text: 'Ok',
                    onPress: () => {
                        disconnect();
                    },
                },
            ]);
            return;
        }
        if (!success) { Alert.alert('Atenção deu erro', message, [{ text: 'Ok' }]); return; };
        await cartPaymentHandle(data);

    }

    async function cartPaymentHandle(data: any) {
        const numeroOrdem = getOrderNumber(data);
        if (!numeroOrdem) {
            Alert.alert(
                "Aviso",
                "Nao foi possivel identificar a ordem para processar o pagamento."
            );
            return;
        }

        const validadeOriginal = data?.dadosCartao.validadeCartao || "";

        let validadeFormatada = validadeOriginal;
        if (validadeOriginal.includes('/') && validadeOriginal.length <= 5) {
            const [mes, ano] = validadeOriginal.split('/');
            validadeFormatada = `${mes}/20${ano}`;
        }

        const paymentResponse = await servicecart.post("(PAG_CARTAO_CREDITO)", {
            MerchantOrderId: numeroOrdem,
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
                    ExpirationDate: validadeFormatada,
                    SecurityCode: data?.dadosCartao.cvvCartao,
                    SaveCard: false,
                    Brand: getCardBrandName(String(data?.dadosCartao?.numeroCartao)),
                },
            },
        });

        const responseData = paymentResponse?.data?.response || {};
        const payment = responseData?.Payment || {};
        const success = responseData?.success ?? payment?.Status === 2;
        const ReturnCode = responseData?.ReturnCode ?? payment?.ReturnCode;
        const ReturnMessage = responseData?.ReturnMessage ?? payment?.ReturnMessage;
        const AuthorizationCode = responseData?.AuthorizationCode ?? payment?.AuthorizationCode;
        const PaymentId = responseData?.PaymentId ?? payment?.PaymentId;
        const ReceivedDate = responseData?.ReceivedDate ?? payment?.ReceivedDate;
        const MerchantOrderId = responseData?.MerchantOrderId ?? numeroOrdem;

        if (success && approvedReturnCodes.includes(String(ReturnCode))) {
            if (!PaymentId) {
                Alert.alert(
                    "Pagamento Confirmado",
                    "O cartão foi cobrado, mas o retorno da operadora não trouxe o ID do pagamento. Tente confirmar novamente em alguns instantes."
                );
                return;
            }

            const dataToSave = {
                MerchantOrderId,
                PaymentId,
                AuthorizationCode,
                ReceivedDate,
                CartNumber: data?.dadosCartao?.numeroCartao,
                parcelasSelecionadas: selectedInstallments,
            };

            setPaymentData(dataToSave); // Salva para caso precise de retry manual
            await sendOrderAtualize(dataToSave);

        } else {
            const reason = ReturnMessage
                ? `${ReturnMessage}, verifique os dados do cartão.`
                : "Pagamento negado pela operadora.";
            Alert.alert("Atenção", reason);
        }
    };

    // 3. Atualizar ordem no backend
    async function sendOrderAtualize(dataCart: CartResponseData) {
        setLoading(true);
        if (!dataCart.MerchantOrderId || !dataCart.PaymentId) {
            Alert.alert("Aviso", "Faltam dados para atualizar o pedido.");
            setLoading(false);
            return;
        }

        let orderResponse: OrderUpdatePayload = {
            numeroOrdem: dataCart.MerchantOrderId,
            statusOrdem: 2,
            idTransacao: dataCart.PaymentId,
            tipoPagamento: 2,
            urlBoleto: dataCart.AuthorizationCode,
            ReceivedDate: dataCart.ReceivedDate,
        };
        try {
            const query = `(WS_ATUALIZA_ORDEM)?token=${encodeURIComponent(PAYMENT_SYSTEM_TOKEN)}&numeroOrdem=${encodeURIComponent(String(orderResponse.numeroOrdem))}&statusOrdem=${encodeURIComponent(String(orderResponse.statusOrdem))}&idTransacao=${encodeURIComponent(String(orderResponse.idTransacao))}&tipoPagamento=${encodeURIComponent(String(orderResponse.tipoPagamento))}&urlBoleto=${encodeURIComponent(String(orderResponse.urlBoleto))}`;
            const response = await appservice.get(query);

            const payload = response?.data?.resposta;
            const success = payload?.success;
            const message = payload?.message;

            if (!success) {
                setIsCriticalError(true);
                Alert.alert(
                    "Pagamento Confirmado",
                    message || "Seu cartão foi cobrado com sucesso, mas houve uma falha ao atualizar o pedido no sistema. Por favor, clique em 'Confirmar Pagamento Novamente'."
                );
                return;
            }

            if (response?.data?.resposta?.success) {
                router.replace({
                    pathname: "/cardbillpaid",
                    params: {
                        value: valueOrder,
                        paymentId: dataCart.PaymentId, // Removi o 'a' extra de 'payament'
                        lastCardNumber: pegarUltimosQuatro(dataCart.CartNumber),
                        dateTransaction: moment().format('DD [de] MMMM, HH:mm')
                    }
                });
            } else {
                throw new Error(response?.data?.resposta?.message);
            }

        } catch (error: any) {
            setIsCriticalError(true); // Ativa o modo de erro na tela
            Alert.alert(
                "Pagamento Confirmado",
                "Seu cartão foi cobrado com sucesso, mas houve uma falha ao atualizar o pedido no sistema. Por favor, clique em 'Confirmar Pagamento Novamente'."
            );
        } finally {
            setLoading(false);
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

                        <View className="bg-white rounded-t-3xl px-2 pt-6 pb-10">

                            <View className="items-center mb-6">
                                <Text className="text-sm text-gray-400">
                                    Total a pagar
                                </Text>
                                <Text className="text-3xl font-extrabold text-solar-blue-secondary mt-1">
                                    R$ {maskMoney(parseFloat(valueOrder).toFixed(2))}
                                </Text>
                            </View>

                            <View className="gap-4">
                                <View>
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
                                </View>
                                <View>
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
                                </View>
                                <View>
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
                                            {errors.validadeCartao && (
                                                <Text className="text-solar-red-primary text-sm">
                                                    {errors.validadeCartao.message}
                                                </Text>
                                            )}
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
                                            {errors.cvvCartao && (
                                                <Text className="text-solar-red-primary text-sm">
                                                    {errors.cvvCartao.message}
                                                </Text>
                                            )}
                                        </View>
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
                        {isCriticalError ? (
                            <Button
                                label={loading ? <ActivityIndicator color="#fff" /> : "Confirmar Pagamento Novamente"}
                                variant="destructive" // ou uma cor que chame atenção (ex: laranja/amarelo)
                                disabled={loading}
                                onPress={() => paymentData && sendOrderAtualize(paymentData)}
                                className="w-full bg-orange-500"
                            />
                        ) : (
                            <Button
                                label={loading ? <ActivityIndicator size="small" color="#bccf00" /> : "Continuar pagamento"}
                                variant="default"
                                size="lg"
                                disabled={loading}
                                onPress={handleSubmit(onSubmit)}
                                className="w-full"
                            />
                        )}

                        {isCriticalError && (
                            <Text className="text-center text-xs text-red-600 mt-2 font-bold">
                                Atenção: O valor já foi debitado do seu cartão.
                                Não saia desta tela até confirmar.
                            </Text>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ScreenLayout>
    );
};

export default CartPayment;
