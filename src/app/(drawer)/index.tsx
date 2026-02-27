import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import ButtonMenu from '@/components/ButtonMenu';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useAuth } from '@/contexts/AuthContext';
import appservice from '@/services/appservice';
import { AppCaroucelProps } from '@/types/app-types';
import { BanknoteArrowDownIcon, FilePenLineIcon, HandCoinsIcon, HistoryIcon, MapPinIcon, PhoneCallIcon, ShoppingBasket, UserIcon, WrenchIcon } from 'lucide-react-native';
import BouncingPin from '@/components/BouncingPin';

// Obtém largura da tela
const width = Dimensions.get('window').width;

export default function Home() {
    const { user, signedIn, returnStore } = useAuth();

    const ref = useRef<ICarouselInstance>(null);

    const [dataCaroucel, setDataCaroucel] = useState<AppCaroucelProps[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const getCaroucel = async () => {
            const response = await appservice.get(`(WS_CARROCEL_PROMOCAO)`);
            // Garante que é um array antes de setar
            if (response.data?.resposta?.data?.carrocel) {
                setDataCaroucel(response.data.resposta.data.carrocel);
            }
        }
        getCaroucel();
    }, []);

    const renderItem = ({ item }: { item: AppCaroucelProps }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => console.log('Clicou no banner:')} // Aqui você pode colocar navegação
                className="flex-1 justify-center overflow-hidden"
            >
                <Image
                    source={{ uri: item.carLinkImagem }}
                    // 'cover' preenche tudo sem distorcer. 'contain' mostra a imagem inteira mas pode deixar bordas brancas.
                    style={{ width: width, height: '100%' }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    };

    const Pagination = () => {
        return (
            <View className="flex-row justify-center items-center absolute bottom-4 w-full">
                {dataCaroucel.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 mx-1 ${index === activeIndex
                            ? 'bg-solar-blue-primary w-6'
                            : 'bg-gray-300 w-2'
                            }`}
                    />
                ))}
            </View>
        );
    };

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <ScrollView
                className='flex-1 bg-gray-50 p-0'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View className="bg-white px-4 py-4 rounded-b-3xl shadow-sm">
                    <Text className="text-sm text-gray-500">
                        {signedIn ? 'Bem-vindo de volta' : 'Olá'}
                    </Text>
                    <Text className="text-lg font-bold text-gray-800">
                        {user?.nomeCliente || 'Visitante'}
                    </Text>
                    <Text className="text-gray-700">Bem vindo ao app das lojas solar</Text>
                </View>

                <View className="relative bg-white">
                    {dataCaroucel.length > 0 ? (
                        <View>
                            <Carousel
                                ref={ref}
                                loop
                                width={width}
                                height={width} // Altura proporcional (60% da largura). Ajuste se quiser maior.
                                autoPlay={dataCaroucel.length > 1 ? true : false}
                                autoPlayInterval={4000} // 4 segundos
                                data={dataCaroucel}
                                scrollAnimationDuration={1000}
                                onSnapToItem={(index) => setActiveIndex(index)}
                                renderItem={renderItem}
                            />
                            <Pagination />
                        </View>
                    ) : (
                        <View style={{ width: width, height: width }} className="bg-gray-200 justify-center items-center">
                            <ActivityIndicator color={'#bccf00'} size={'large'} />
                        </View>
                    )}
                </View>
                <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm items-center">
                    <Text className="text-gray-600">Loja mais próxima</Text>
                    <Text className="font-bold text-lg text-gray-800 mt-1">
                        {returnStore && returnStore?.cidade.split('-')[0] || 'Não identificado'}
                    </Text>
                    <Text className="text-gray-500 mb-3">Venha nos visitar 📍</Text>
                    <BouncingPin />
                </View>
            </ScrollView>
            <View className="bg-solar-blue-primary py-3">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                    }}
                >
                    <View className="flex-row gap-3">
                        <ButtonMenu
                            icon={<ShoppingBasket color={'white'} size={28} />}
                            label={'Comprar'}
                            url={'https://www.lojasolar.com.br/'}
                        />

                        <ButtonMenu
                            icon={<FilePenLineIcon color={'white'} size={28} />}
                            label={'Assinar Doc'}
                            url={!signedIn ? '/sign-in' : '/not-registered'}
                        />

                        <ButtonMenu
                            icon={<HandCoinsIcon color={'white'} size={28} />}
                            label={'Pagamentos'}
                            url={!signedIn ? '/sign-in' : '/payment'}
                        />

                        <ButtonMenu
                            icon={<BanknoteArrowDownIcon color={'white'} size={28} />}
                            label={'Cashback'}
                            url={!signedIn ? '/sign-in' : '/cashback'}
                        />

                        <ButtonMenu
                            icon={<MapPinIcon color={'white'} size={28} />}
                            label={'Lojas'}
                            url={'/stores'}
                        />

                        <ButtonMenu
                            icon={<WrenchIcon color={'white'} size={28} />}
                            label={'Assistência'}
                            url={!signedIn ? '/sign-in' : '/assistance'}
                        />

                        <ButtonMenu
                            icon={<PhoneCallIcon color={'white'} size={28} />}
                            label={'Contato'}
                            url={'/contact-us'}
                        />

                        <ButtonMenu
                            icon={<HistoryIcon color={'white'} size={28} />}
                            label={'Histórico'}
                            url={!signedIn ? '/sign-in' : '/history'}
                        />

                        <ButtonMenu
                            icon={<UserIcon color={'white'} size={28} />}
                            label={'Conta'}
                            url={!signedIn ? '/sign-in' : '/my-account'}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenLayout>
    )
}