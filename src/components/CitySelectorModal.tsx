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
import { FlashList } from '@shopify/flash-list'

type City = {
    id: string
    cidade: string
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

        return (
            <Modalize
                ref={ref}
                modalHeight={500}
                modalStyle={{
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
                handleStyle={{ backgroundColor: '#ccc' }}
            >
                <View className="px-4 pt-4 pb-6">

                    <Text className="text-lg font-semibold mb-3">
                        Selecionar cidade
                    </Text>

                    <TextInput
                        placeholder="Buscar cidade..."
                        value={query}
                        onChangeText={setQuery}
                        className="bg-gray-100 px-4 py-3 rounded-xl mb-3 border border-gray-200"
                    />

                    <FlashList
                        data={filteredCities}
                        estimatedItemSize={60}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={
                            <Text className="text-center text-gray-400 mt-6">
                                Nenhuma cidade encontrada
                            </Text>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="py-4 border-b border-gray-200"
                                onPress={() => handleSelect(item)}
                            >
                                <Text className="text-base font-medium">
                                    {item.cidade}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modalize>
        )
    }
)
