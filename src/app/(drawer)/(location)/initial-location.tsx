import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { MapPinIcon, MapPinnedIcon } from 'lucide-react-native'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { Button } from '@/components/Button'
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Carousel from "react-native-reanimated-carousel"
import type { ICarouselInstance } from "react-native-reanimated-carousel";
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
    const carouselRef = useRef<ICarouselInstance>(null);

    const [cities, setCities] = useState<any[]>([])
    const [selectedCity, setSelectedCity] = useState<any>(null)

    const { width, height } = Dimensions.get('window');
    const item_width = Math.round(width * 0.8);

    const mapRef = useRef<any>(0);

    const initialLat = Number(positionGlobal?.[0]) || 0;
    const initialLon = Number(positionGlobal?.[1]) || 0;

    const [region, setRegion] = useState({
        latitude: initialLat,
        longitude: initialLon,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
    });

    useEffect(() => {
        const latitude = Number(positionGlobal?.[0]);
        const longitude = Number(positionGlobal?.[1]);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
            (latitude === 0 && longitude === 0)) {
            return;
        }

        const getLojasProxima = async () => {
            setLoading(true);
            try {
                const response = await appservice.get(`(WS_LOJAS_PROXIMA)?latitude=${latitude}&longitude=${longitude}`)
                const data = response?.data?.resposta?.data;
                const stores = Array.isArray(data) ? data : data ? [data] : [];
                setLojasProximas(stores);

                const firstStore = stores[0];
                const storeLatitude = Number(firstStore?.latitude);
                const storeLongitude = Number(firstStore?.longitude);
                const nextRegion = {
                    latitude: Number.isFinite(storeLatitude) ? storeLatitude : latitude,
                    longitude: Number.isFinite(storeLongitude) ? storeLongitude : longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                };
                setRegion(nextRegion);
                mapRef.current?.animateToRegion(nextRegion, 400);
            } catch (error) {
                console.log(error);
                setLojasProximas([]);
            } finally {
                setLoading(false)
            }
        }
        getLojasProxima();
    }, [positionGlobal]);

    const onCaroucelItemChange = (index: number) => {
        const store = lojasProximas[index];
        const latitude = Number(store?.latitude);
        const longitude = Number(store?.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

        const setregion = {
            latitude,
            longitude,
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
        };
        if (mapRef.current) {
            mapRef.current.animateToRegion(setregion, 300);
        }
    };

    const renderStore = ({ item }: any) => {
        const hasValidCoordinates =
            Number.isFinite(Number(item?.latitude)) &&
            Number.isFinite(Number(item?.longitude));

        return (
            <StoreCard
                item={item}
                width={width}
                onPress={hasValidCoordinates ? () =>
                    router.push({
                        pathname: '/store-selected',
                        params: item,
                    }) : undefined}
            />
        );
    };

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

        setLojasProximas([])

        try {
            const response = await appservice.get(`(WS_LOJAS_PROXIMA)?latitude=${city.latitude}&longitude=${city.longitude}`)
            const responseData = response?.data?.resposta?.data
            const stores = Array.isArray(responseData) ? responseData : responseData ? [responseData] : []
            setLojasProximas(stores)

            setActiveIndex(0)

            if (carouselRef.current) {
                carouselRef.current.scrollTo({ index: 0, animated: false })
            }

            if (stores.length > 0) {
                const firstStore = stores[0];
                const newRegion = {
                    latitude: Number(firstStore.latitude),
                    longitude: Number(firstStore.longitude),
                    latitudeDelta: 0.0043,
                    longitudeDelta: 0.0034,
                };
                mapRef.current?.animateToRegion(newRegion, 400);
            } else {
                // Fallback: se não tiver loja, centraliza na cidade
                const fallbackRegion = {
                    latitude: Number(city.latitude),
                    longitude: Number(city.longitude),
                    latitudeDelta: 0.0043,
                    longitudeDelta: 0.0034,
                };
                mapRef.current?.animateToRegion(fallbackRegion, 400);
            }
        } catch (error) {
            console.log("Erro ao buscar lojas da nova cidade: ", error);
            const fallbackRegion = {
                latitude: Number(city.latitude),
                longitude: Number(city.longitude),
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
            };
            mapRef.current?.animateToRegion(fallbackRegion, 400);
        }
    }
// console.log(selectedCity)
    return (
        <ScreenLayout backgroundColor='bg-solar-blue-primary'>
            <View className='flex-1 flex-col items-center justify-start'>
                <View className='w-full flex-1 bg-white rounded-t-3xl flex-col justify-start items-center'>

                    <View className='w-full px-4 my-4'>
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
                                {lojasProximas[0]?.cidade ?? 'Localização não definida'}
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
                                .filter(m =>
                                    Number.isFinite(Number(m.latitude)) &&
                                    Number.isFinite(Number(m.longitude)),
                                )
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
                                key={`${selectedCity?.latitude}-${selectedCity?.longitude}` || 'default'}
                                ref={carouselRef}
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
