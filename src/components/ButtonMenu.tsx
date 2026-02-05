import { View, Text, TouchableOpacity } from 'react-native'
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
            <TouchableOpacity
                className='w-20 h-20 border border-white rounded-xl flex-col items-center justify-center gap-1 p-0'
            >
                {icon}
                <Text className='text-white text-[10px] text-center font-medium leading-tight'>
                    {label}
                </Text>
            </TouchableOpacity>
        </Link>
    )
}