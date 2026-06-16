import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { maskMoney } from '@/utils/mask';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { CopyIcon, HandCoinsIcon, Share2Icon } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Share, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Define o que vem nos parâmetros da URL/Rota
interface OrderData {
    numeroOrdem: string | number;
    OrderNumber?: string | number;
    Detail?: {
        OrderNumber?: string | number;
    };
    parcelasSelecionadas?: SelectedInstallment[];
    // adicione outras propriedades que existam no seu JSON
}

interface SelectedInstallment {
    numeroCarne: string | number;
    parcela: string | number;
}

// Define o que o backend de Pix retorna
interface PixResponseData {
    idTransacao?: string | number;
    urlBoleto?: string | number;
}

// Define a estrutura do que você envia para atualizar a ordem
interface OrderUpdatePayload {
    numeroOrdem: string | number;
    statusOrdem: number;
    idTransacao: string;
    tipoPagamento: number;
    urlBoleto: string;
}

const PAYMENT_SYSTEM_TOKEN = process.env.EXPO_PUBLIC_PAYMENT_SYSTEM_TOKEN || '91362590064312210014616';
const EMPTY_TRANSACTION_ID = '00000000-0000-0000-0000-000000000000';

const normalizePixAmount = (value: string | string[] | number | null | undefined) => {
    const rawValue = Array.isArray(value) ? value[0] : value;
    const valueString = String(rawValue ?? '').trim();

    if (!valueString) return '0.00';

    const sanitizedValue = valueString.replace(/[^\d,.-]/g, '');
    const normalizedValue = sanitizedValue.includes(',')
        ? sanitizedValue.replace(/\./g, '').replace(',', '.')
        : sanitizedValue;
    const numericValue = Number.parseFloat(normalizedValue);

    return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '0.00';
};

const normalizeTransactionId = (txid: string | number | null | undefined) => {
    const transactionId = String(txid ?? '').trim();
    return transactionId || EMPTY_TRANSACTION_ID;
};

const PixPayment = () => {
    const { user, expiredSession } = useAuth();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [pixOperations, setPixOpertions] = useState<string>('');

    const dataOrder: OrderData = params.dataOrder ? JSON.parse(params.dataOrder as string) : {} as OrderData;
    const valueOrder = params.valueOrder;
    const pixAmount = useMemo(() => normalizePixAmount(valueOrder), [valueOrder]);
    const mtoken = String(params.token || user?.token || '');

    const getOrderNumber = (dataPix: OrderData) =>
        dataPix.numeroOrdem ?? dataPix.OrderNumber ?? dataPix.Detail?.OrderNumber;

    useEffect(() => {
        const getPayPix = async () => {
            try {
                setLoading(true)
                if (!mtoken) {
                    Alert.alert('Atenção', 'Sessão inválida. Faça login novamente.', [
                        { text: 'Ok', onPress: () => expiredSession() },
                    ]);
                    return;
                }

                const response = await appservice.get(
                    `(WS_TRANSACAO_PIX)?token=${encodeURIComponent(mtoken)}&tempoPix=3600&valorPix=${encodeURIComponent(pixAmount)}&mensagemPix=${encodeURIComponent('Pagamento Pix Grupo Solar')}`,
                );
                const { success, txid, banco, copiaColaPix, message, token } = response.data.resposta;

                if (!token) {
                    Alert.alert('Atenção', message || 'Sessão expirada. Faça login novamente.', [
                        { text: 'Ok', onPress: () => expiredSession() },
                    ]);
                    return;
                }

                if (success && copiaColaPix) {
                    setPixOpertions(copiaColaPix);
                    await sendOrderAtualize(dataOrder, { idTransacao: txid, urlBoleto: banco });
                } else {
                    await sendOrderAtualize(dataOrder, { idTransacao: txid, urlBoleto: banco });

                    const isBadRequest = message === 'Bad Request';
                    const errorMessage = isBadRequest
                        ? 'Serviço indisponível no momento. Tente novamente mais tarde.'
                        : message || 'Tente novamente mais tarde';

                    Alert.alert(
                        "Erro ao gerar Pix",
                        errorMessage,
                        isBadRequest
                            ? [{ text: 'Ok', onPress: () => router.replace('/payment') }]
                            : undefined,
                    );
                }

            } catch (error) {
                Alert.alert('Erro', "Falha ao conectar com o serviço de pagamentos.")
            } finally {
                setLoading(false);
            }
        };
        getPayPix();
    }, [expiredSession, mtoken, pixAmount]);

    const sharingUrl = async () => {
        try {
            const result = await Share.share({
                message: `${pixOperations}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const fetchCopiedUrl = async () => {
        if (!pixOperations) return;
        await Clipboard.setStringAsync(`${pixOperations}`);
        Alert.alert("Sucesso", "Código Pix copiado para a área de transferência!")
    };

    async function sendOrderAtualize(dataPix: OrderData, dataPay: PixResponseData) {
        const numeroOrdem = getOrderNumber(dataPix);
        if (!numeroOrdem) {
            Alert.alert(
                "Aviso",
                "Faltam dados para registrar a ordem. Tente novamente em alguns instantes."
            );
            return;
        }

        let orderResponse: OrderUpdatePayload = {
            numeroOrdem,
            statusOrdem: 12,
            idTransacao: normalizeTransactionId(dataPay.idTransacao),
            tipoPagamento: 4,
            urlBoleto: String(dataPay.urlBoleto ?? 0),
        };
        try {
            const response = await appservice.get(
                `(WS_ATUALIZA_ORDEM)?token=${encodeURIComponent(PAYMENT_SYSTEM_TOKEN)}&numeroOrdem=${encodeURIComponent(String(orderResponse.numeroOrdem))}&statusOrdem=${encodeURIComponent(String(orderResponse.statusOrdem))}&idTransacao=${encodeURIComponent(String(orderResponse.idTransacao))}&tipoPagamento=${encodeURIComponent(String(orderResponse.tipoPagamento))}&urlBoleto=${encodeURIComponent(String(orderResponse.urlBoleto))}`,
            );
            const { success, message } = response.data.resposta;

            if (!success) {
                Alert.alert(
                    "Aviso",
                    message || "O pagamento foi gerado mas houve um problema ao registrar o status da ordem"
                );
            }
        } catch (error) {
            Alert.alert("Erro de Conexão", "Não conseguimos confirmar a criação do seu pedido com o servidor. Verifique sua internet.");
            console.error(error);
        }
    };

    return (
        <ScreenLayout backgroundColor="bg-solar-blue-primary">
            <View className='flex-1 bg-white rounded-t-3xl p-4 gap-2'>

                <PageHeader
                    title="Pagamento PIX"
                    subtitle="Finalize o pagamento"
                    description="Escaneie o QR Code ou use uma das opções abaixo."
                    icon={<HandCoinsIcon size={26} color="#1a9cd9" />}
                />

                <View className="flex-1 bg-white rounded-t-3xl px-5 py-6">

                    <View className="items-center">
                        <Text className="text-sm text-gray-400">
                            Valor a pagar
                        </Text>

                        <Text className="text-4xl font-extrabold text-solar-blue-secondary mt-1">
                            R$ {maskMoney(pixAmount)}
                        </Text>

                        <Text className="text-sm text-orange-500 mt-2 font-medium">
                            Expira em 1 hora
                        </Text>
                    </View>

                    <View className="items-center mt-8">
                        <View className="p-4 bg-gray-100 rounded-2xl">
                            {pixOperations && (
                                <QRCode
                                    value={pixOperations}
                                    size={160}
                                    logoBackgroundColor="transparent"
                                />
                            )}
                        </View>

                        <Text className="text-center text-gray-500 mt-4 px-6">
                            Abra o app do seu banco e escaneie o QR Code para pagar.
                        </Text>
                    </View>

                    <View className="flex-row gap-4 mt-8">

                        <Pressable
                            onPress={fetchCopiedUrl}
                            className="flex-1 bg-gray-100 rounded-2xl p-4 items-center active:opacity-70"
                        >
                            <CopyIcon size={28} color="#0d3b85d5" />
                            <Text className="text-sm text-gray-600 mt-2 text-center">
                                Copiar código PIX
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={sharingUrl}
                            className="flex-1 bg-gray-100 rounded-2xl p-4 items-center active:opacity-70"
                        >
                            <Share2Icon size={28} color="#0d3b85d5" />
                            <Text className="text-sm text-gray-600 mt-2 text-center">
                                Compartilhar
                            </Text>
                        </Pressable>

                    </View>

                </View>
            </View>
        </ScreenLayout>
    );
};

export default PixPayment;
