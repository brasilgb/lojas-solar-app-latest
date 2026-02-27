import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { Link, Href } from 'expo-router'
import { Button } from './Button';

interface ButtonMenuProps {
    icon: React.ReactNode;
    label: string;
    url: any;
}

export default function ButtonMenu({ icon, label, url }: ButtonMenuProps) {
    return (
<Link href={url} asChild>
    <Pressable
        className="w-[88px] h-[88px] rounded-2xl items-center justify-center px-1 py-2 bg-white/10 border border-white/20"
        style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.96 : 1 }],
            opacity: pressed ? 0.8 : 1,
        })}
    >
        <View className="mb-1">
            {icon}
        </View>

        <Text
            numberOfLines={2}
            className="text-white text-[11px] text-center font-medium leading-tight"
        >
            {label}
        </Text>
    </Pressable>
</Link>
    )
}