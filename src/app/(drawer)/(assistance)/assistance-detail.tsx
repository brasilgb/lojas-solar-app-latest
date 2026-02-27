import { Card, CardHeader } from '@/components/Card';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { useLocalSearchParams } from 'expo-router';
import { WrenchIcon } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, ScrollView } from 'react-native';

type Detail = {
    Abertura?: string;
    defeito?: string;
    status?: string;
    eventos?: {
        xEventos: string;
    }[];
};

const AssistanceDetail = () => {
    const { user } = useAuth();
    const params = useLocalSearchParams();

    const dataAssistance = params as any;

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<Detail>({});

    const getDetails = useCallback(async () => {
        if (!user?.token) return;

        setLoading(true);
        try {
            const response = await appservice.get(
                `(WS_PROTOCOLO_DETALHE)?token=${user.token}&filial=${dataAssistance.filial}&nProtocolo=${dataAssistance.nProtocolo}`
            );

            const { data } = response.data.resposta;
            setDetails(data ?? {});
        } catch (err) {
            console.log('Erro ao buscar detalhes:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.token, dataAssistance]);

    useEffect(() => {
        getDetails();
    }, [getDetails]);

    return (
        <ScreenLayout backgroundColor="bg-solar-blue-primary">
            <View className="flex-1 bg-white rounded-t-3xl p-6">

                <PageHeader
                    title="Assistência Técnica"
                    subtitle="Detalhes da Assistência"
                    description={dataAssistance?.produto}
                    icon={<WrenchIcon size={26} color="#1a9cd9" />}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >

                    <Card className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <CardHeader className="gap-3">

                            <Text className="text-base font-semibold text-gray-700">
                                Abertura:{' '}
                                <Text className="font-normal text-gray-500">
                                    {details?.Abertura ?? '-'}
                                </Text>
                            </Text>

                            <Text className="text-base font-semibold text-gray-700">
                                Defeito:{' '}
                                <Text className="font-normal text-gray-500">
                                    {details?.defeito ?? '-'}
                                </Text>
                            </Text>

                            <Text className="text-base font-semibold text-gray-700">
                                Status:{' '}
                                <Text className="font-normal text-gray-500">
                                    {details?.status ?? '-'}
                                </Text>
                            </Text>

                        </CardHeader>
                    </Card>

                    <Card className="bg-gray-50 border border-gray-200 rounded-lg p-4">

                        <View className="border-l-2 border-gray-200 pl-4">

                            {details?.eventos?.length ? (
                                details.eventos.map((e, i) => {
                                    const isLast = i === details.eventos!.length - 1;

                                    return (
                                        <View
                                            key={`${i}-${e.xEventos}`}
                                            className={`mb-${isLast ? '0' : '6'}`}
                                        >
                                            {/* DOT */}
                                            <View
                                                className={`absolute w-4 h-4 rounded-full -left-6 top-1 ${isLast
                                                        ? 'bg-solar-orange-primary'
                                                        : 'bg-gray-400'
                                                    }`}
                                            />

                                            <Text className="text-sm font-medium text-gray-600">
                                                {e.xEventos}
                                            </Text>
                                        </View>
                                    );
                                })
                            ) : (
                                <Text className="text-gray-400 text-sm">
                                    Nenhum evento encontrado
                                </Text>
                            )}

                        </View>

                    </Card>
                </ScrollView>

            </View>
        </ScreenLayout>
    );
};

export default AssistanceDetail;
