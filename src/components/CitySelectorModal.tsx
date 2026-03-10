import React, {
    forwardRef,
    useMemo,
    useState,
} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Input } from './Input'

type City = {
    id: string
    cidade: string
    endereco: string
    latitude: number
    longitude: number
}

type Props = {
    cities: City[]
    onSelect: (city: City) => void
}

export const CitySelectorModal = forwardRef<Modalize, Props>(
    ({ cities, onSelect }, ref) => {
        const [query, setQuery] = useState('')

        const filteredCities = useMemo(() => {
            if (!query) return cities
            return cities.filter((c) =>
                c.cidade.toLowerCase().includes(query.toLowerCase())
            )
        }, [query, cities])

        const handleSelect = (city: City) => {
            onSelect(city)
            if (ref && typeof ref !== 'function' && ref?.current) {
                ref.current.close()
            }
        }

        // 1. Isolamos o Header (Título e Input)
        const RenderHeader = () => (
            <View className="px-4 pt-6 pb-2">
                <Text className="text-lg font-semibold mb-3 text-gray-700">
                    Selecionar cidade
                </Text>

                <Input
                    placeholder="Buscar cidade..."
                    value={query}
                    onChangeText={setQuery}
                    inputClasses="bg-gray-50 px-4 py-3 rounded-xl border !border-gray-200 placeholder:text-gray-500"
                />
            </View>
        )

        // 2. Isolamos a renderização do Item
        const renderItem = ({ item }: { item: City }) => (
            <TouchableOpacity
                className="py-4 border-b border-gray-200 mx-4"
                onPress={() => handleSelect(item)}
            >
                <Text className="text-base text-gray-700 font-semibold">
                    {item.cidade.split(' - ')[0]} - <Text className='text-sm font-normal'>{item.endereco}</Text>
                </Text>
            </TouchableOpacity>
        )

        // 3. Isolamos o estado vazio
        const renderEmpty = () => (
            <Text className="text-center text-gray-400 mt-6">
                Nenhuma cidade encontrada
            </Text>
        )

        return (
            <Modalize
                ref={ref}
                modalHeight={500}
                modalStyle={{
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
                handleStyle={{ backgroundColor: '#ccc' }}
                // Passamos o HeaderComponent aqui
                HeaderComponent={<RenderHeader />}
                // Toda a magia da lista vem pra cá
                flatListProps={{
                    data: filteredCities,
                    keyExtractor: (item) => item.id || `${item.latitude}-${item.longitude}`,
                    renderItem: renderItem,
                    keyboardShouldPersistTaps: "handled",
                    ListEmptyComponent: renderEmpty,
                    showsVerticalScrollIndicator: false,
                    contentContainerStyle: { paddingBottom: 24 }, // Dá um respiro no final da lista
                    
                    // Otimizações de performance na abertura
                    initialNumToRender: 15,
                    maxToRenderPerBatch: 10,
                    windowSize: 5,
                }}
            />
        )
    }
)