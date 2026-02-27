import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { MapPinIcon, MapPinnedIcon } from 'lucide-react-native'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { Button } from '@/components/Button'
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Carousel from "react-native-reanimated-carousel"
import { useAuth } from '@/contexts/AuthContext'
import { StoreCard } from '@/components/StoreCard'
import { router } from 'expo-router'
import appservice from '@/services/appservice'
import { Modalize } from 'react-native-modalize'
import { CitySelectorModal } from '@/components/CitySelectorModal'

type Store = {
    id: string;
    latitude: string;
    longitude: string;
    cidade: string;
    endereco: string;
    email: string;
    whats: string;
    distancia: string;
};

export default function InitialLocation() {
    const { setPositionGlobal, positionGlobal } = useAuth();
    const [lojasProximas, setLojasProximas] = useState<Store[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const modalRef = useRef<Modalize>(null)

    const [cities, setCities] = useState<any[]>([])
    const [selectedCity, setSelectedCity] = useState<any>(null)

    const { width, height } = Dimensions.get('window');
    const item_width = Math.round(width * 0.8);

    const mapRef = useRef<any>(0);

    const initialLat = parseFloat(positionGlobal[0] || '0.0') || 0.0;
    const initialLon = parseFloat(positionGlobal[1] || '0.0') || 0.0;

    const [region, setRegion] = useState({
        latitude: initialLat,
        longitude: initialLon,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
    });

    useEffect(() => {
        const getLojasProxima = async () => {
            setLoading(true);
            try {
                let lojas = 'WS_LOJAS_PROXIMA';
                let latitudel = parseFloat(positionGlobal[0]);
                let longitudel = parseFloat(positionGlobal[1]);
                const response = await appservice.get(`(${lojas})?latitude=${latitudel}&longitude=${longitudel}`)
                const { data } = response.data.resposta;
                setLojasProximas(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
        getLojasProxima();
    }, []);

    const onCaroucelItemChange = (index: number) => {
        const { latitude, longitude } = lojasProximas[index];

        const setregion = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
        };
        if (mapRef.current) {
            mapRef.current.animateToRegion(setregion, 300);
        }
    };

    const renderStore = ({ item }: any) => (
        <StoreCard
            item={item}
            width={width}
            onPress={() =>
                router.push({
                    pathname: '/store-selected',
                    params: item,
                })
            }
        />
    );

    const fetchCities = async () => {
        try {
            const response = await appservice.get('(WS_CARREGA_LOJAS)')
            const { data } = response.data.resposta

            setCities(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCities()
    }, [])

    const handleSelectCity = async (city: any) => {

        setSelectedCity(city)
        modalRef.current?.close()

        const newRegion = {
            latitude: Number(city.latitude),
            longitude: Number(city.longitude),
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
        }

        mapRef.current?.animateToRegion(newRegion, 400)

        const response = await appservice.get(`(WS_LOJAS_PROXIMA)?latitude=${city.latitude}&longitude=${city.longitude}`)
        const { data } = response.data.resposta
        setLojasProximas(data)
    }

    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 flex-col items-center justify-start'>
                <View className='w-full flex-1 bg-white rounded-t-3xl flex-col justify-start items-center'>

                    <View className='w-full px-6'>
                        <PageHeader
                            title="Localização"
                            subtitle="Lojas mais próximas"
                            description="Encontre a Loja Solar mais próxima de você."
                            icon={<MapPinnedIcon size={26} color="#1a9cd9" />}
                        />
                    </View>

                    <View className='bg-solar-blue-primary border border-gray-200 p-2 w-full flex-row items-center shadow-sm'>

                        <View className='bg-solar-blue-secondary/20 p-2 rounded-full mr-4'>
                            <MapPinIcon size={22} color="white" />
                        </View>

                        <View className='flex-1'>
                            <Text className='text-gray-100 text-xs font-medium uppercase tracking-wider'>
                                Localização
                            </Text>
                            <Text className='text-gray-100 text-base font-semibold'>
                                {selectedCity?.nome ?? lojasProximas[activeIndex]?.cidade ?? 'Localização não definida'}
                            </Text>
                        </View>

                        <View className='ml-2'>
                            <Button
                                variant='secondary'
                                label='Alterar'
                                className="py-2 px-4"
                                onPress={() => modalRef.current?.open()}
                            />
                        </View>
                    </View>

                    <View className="flex-1 relative border-t-4 border-solar-green-primary w-full">
                        <Map
                            ref={mapRef}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={region}
                            showsUserLocation
                            loadingEnabled
                            style={StyleSheet.absoluteFill}
                        >
                            {lojasProximas
                                .filter(m => m.latitude && m.longitude)
                                .map((marker, index) => {
                                    const isActive = index === activeIndex;
                                    return (
                                        <Marker
                                            key={index ?? `${marker.latitude}-${marker.longitude}-${index}`}
                                            coordinate={{
                                                latitude: Number(marker.latitude),
                                                longitude: Number(marker.longitude),
                                            }}
                                        >
                                            <Image
                                                source={require('@/assets/images/map_marker.png')}
                                                style={{
                                                    width: isActive ? 30 : 16,
                                                    height: isActive ? 30 : 16,
                                                    opacity: isActive ? 1 : 0.7,
                                                }}
                                            />
                                        </Marker>
                                    );
                                })}
                        </Map>

                        <View className="z-50 absolute bottom-0 h-60 w-full">
                            <Carousel
                                loop={false}
                                width={width}
                                height={220}
                                snapEnabled={true}
                                autoPlay={false}
                                autoPlayInterval={3000}
                                mode={'parallax'}
                                modeConfig={{
                                    parallaxScrollingScale: 0.9,
                                    parallaxScrollingOffset: 90,
                                }}
                                data={lojasProximas}
                                onSnapToItem={(index) => {
                                    setActiveIndex(index);
                                    onCaroucelItemChange(index);
                                }}
                                renderItem={renderStore}
                            />
                        </View>
                    </View>

                </View>
            </View>
            <CitySelectorModal
                ref={modalRef}
                cities={cities}
                onSelect={handleSelectCity}
            />
        </ScreenLayout>
    )
}