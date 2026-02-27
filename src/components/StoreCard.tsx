import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type Store = {
  cidade: string;
  endereco: string;
  email: string;
  whats: string;
  distancia: string;
};

type Props = {
  item: Store;
  width?: number;
  onPress?: () => void;
};

export function StoreCard({ item, width, onPress }: Props) {
  return (
    <View className="items-center">
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View
          style={{ width }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-300 overflow-hidden"
        >
          {/* HEADER */}
          <View className="p-4">
            <Text
              numberOfLines={1}
              className="text-base font-bold text-solar-blue-secondary"
            >
              {item.cidade}
            </Text>

            <Text
              numberOfLines={1}
              className="text-xs text-gray-500 mt-1"
            >
              {item.endereco}
            </Text>

            <Text
              numberOfLines={1}
              className="text-xs text-gray-500 mt-1"
            >
              {item.email}
            </Text>
          </View>

          {/* FOOTER */}
          <View className="flex-row items-center justify-between bg-gray-50 px-3 py-2 border-t border-gray-100">
            <Text
              numberOfLines={1}
              className="text-sm text-solar-blue-primary font-medium"
            >
              {item.whats}
            </Text>

            <Text
              numberOfLines={1}
              className="text-sm text-solar-orange-primary font-semibold"
            >
              {item.distancia}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
