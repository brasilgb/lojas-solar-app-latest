import { View, Modal, Text, Pressable, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useMemo } from 'react';
import { FlashList, ListRenderItem } from "@shopify/flash-list";

interface ItemData {
    id: string | number;
    label: string;
}

interface DataModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    items: ItemData[];
    onSelect: (item: ItemData) => void;
    selectedValue?: string | number;
}

export default function DataModal({
    modalVisible,
    setModalVisible,
    items,
    onSelect,
    selectedValue
}: DataModalProps) {

    const [searchQuery, setSearchQuery] = useState('');

    // Filtra a lista com base no que o utilizador digita
    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        return items.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, items]);

    const handleSelect = (item: ItemData) => {
        onSelect(item);
        setModalVisible(false);
        setSearchQuery(''); // Limpa a busca ao fechar
    };

    const renderItem: ListRenderItem<ItemData> = ({ item }) => {
        const isSelected = selectedValue === item.id;
        return (
            <TouchableOpacity
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
                className={`flex-row items-center p-4 mb-2 rounded-xl ${isSelected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
            >
                <Text className={`text-base flex-1 ${isSelected ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {item?.label}
                </Text>

                {isSelected && (
                    <View className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                )}
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={() => setModalVisible(false)}
            >
                <View
                    className="bg-white w-full rounded-t-3xl p-6 h-[70%]" // Aumentei a altura para acomodar o teclado
                    onStartShouldSetResponder={() => true}
                >
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        <Text className="text-xl font-semibold mt-4 text-gray-800">Selecione uma opção</Text>
                    </View>

                    {/* Campo de Busca */}
                    <View className="bg-gray-100 rounded-xl px-4 py-3 mb-4 flex-row items-center">
                        <TextInput
                            placeholder="Pesquisar..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 text-base text-gray-800"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text className="text-gray-400 font-bold ml-2">X</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* FlashList com itens filtrados */}
                    <FlashList
                        data={filteredItems}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled" // Permite clicar no item mesmo com teclado aberto
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <View className="mt-10 items-center">
                                <Text className="text-gray-400">Nenhum resultado encontrado.</Text>
                            </View>
                        }
                        estimatedItemSize={70}
                    />
                </View>
            </Pressable>
        </Modal>
    );
}