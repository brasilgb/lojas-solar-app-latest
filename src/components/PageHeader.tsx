import React from "react";
import { View, Text } from "react-native";

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    description?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode; // botão, badge, etc
};

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    description,
    icon,
    rightElement,
}) => {
    return (
        <View className="bg-white px-5 pt-6 pb-5 rounded-b-2xl shadow-sm w-full">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">

                    {icon && (
                        <View className="bg-blue-100 p-3 rounded-xl">
                            {icon}
                        </View>
                    )}

                    <View className="flex-shrink">
                        <Text className="text-xl font-bold text-gray-900">
                            {title}
                        </Text>

                        {subtitle && (
                            <Text className="text-sm text-gray-500">
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                {rightElement && (
                    <View className="ml-2">
                        {rightElement}
                    </View>
                )}
            </View>

            {description && (
                <>
                    <View className="h-px bg-gray-200 my-3" />

                    <Text className="text-sm text-gray-600">
                        {description}
                    </Text>
                </>
            )}
        </View>
    );
};