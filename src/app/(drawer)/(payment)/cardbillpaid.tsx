import { View, Text } from 'react-native';
import React from 'react';
import { CheckCircleIcon } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';

const CardBillPaid = () => {
    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 bg-white rounded-t-3xl p-6'>

                <CheckCircleIcon size={90} color="#22c55e" />

                <Text className="text-base text-gray-500 text-center mt-2 px-6">
                    Sua cobrança foi criada com sucesso.
                </Text>

            </View>

            <View className="gap-3">
                <Button
                    variant="secondary"
                    size="lg"
                    label="Retornar"
                    onPress={() => router.replace('/')}
                />
            </View>

        </ScreenLayout>
    );
};

export default CardBillPaid;
