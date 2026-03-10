import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Share, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CopyIcon, HandCoinsIcon, Share2Icon } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { PageHeader } from '@/components/PageHeader';
import { maskMoney } from '@/utils/mask';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';

// Define o que vem nos parâmetros da URL/Rota
interface OrderData {
    numeroOrdem: string | number;
    // adicione outras propriedades que existam no seu JSON
}

// Define o que o backend de Pix retorna
interface PixResponseData {
    idTransacao: string;
    urlBoleto: string;
}

// Define a estrutura do que você envia para atualizar a ordem
interface OrderUpdatePayload {
    numeroOrdem: string | number;
    statusOrdem: number;
    idTransacao: string;
    tipoPagamento: number;
    urlBoleto: string;
}

const PixPayment = () => {
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [pixOperations, setPixOpertions] = useState<string>('');

    const dataOrder: OrderData = params.dataOrder ? JSON.parse(params.dataOrder as string) : {} as OrderData;
    const valueOrder = params.valueOrder;
    const mtoken = user?.token;

    useEffect(() => {
        const getPayPix = async () => {
            try {
                setLoading(true)
                const response = await appservice.get(
                    `(WS_TRANSACAO_PIX)?token=${mtoken}&tempoPix=3600&valorPix=${valueOrder}&mensagemPix=Pagamento Pix Grupo Solar`,
                );
                const { success, txid, banco, copiaColaPix, message } = response.data.resposta;
                if (success) {
                    setPixOpertions(copiaColaPix);
                    await sendOrderAtualize(dataOrder, { idTransacao: txid, urlBoleto: banco });
                } else {
                    Alert.alert("Erro ao gerar Pix", message || "Tente novamente mais tarde");
                }

            } catch (error) {
                Alert.alert('Erro', "Falha ao conectar com o serviço de pagamentos.")
            } finally {
                setLoading(false);
            }
        };
        getPayPix();
    }, [mtoken, valueOrder]);

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
        let orderResponse: OrderUpdatePayload = {
            numeroOrdem: dataPix.numeroOrdem,
            statusOrdem: 12,
            idTransacao: dataPay.idTransacao,
            tipoPagamento: 4,
            urlBoleto: String(dataPay.urlBoleto),
        };
        try {
            const response = await appservice.get(
                `(WS_ATUALIZA_ORDEM)?token=91362590064312210014616&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`,
            );
            const { success, message } = response.data.resposta;
            if (!success) {
                Alert.alert("Aviso", "O pagamento foi gerado mas houve um problema ao registrar o status da ordem");
            }
        } catch (error) {
            Alert.alert("Erro de Conexão", "Não conseguimos confirmar a criação do seu pedido com o servidor. Verifique sua internet.");
            console.error(error);
        }
    };

    return (
        <ScreenLayout backgroundColor="bg-solar-blue-primary">
            <View className='flex-1 bg-white rounded-t-3xl p-6'>

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
                            R$ {maskMoney(String(valueOrder))}
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
