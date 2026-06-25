import React, { ReactNode } from "react";
import { View, Text } from "react-native";

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    description?: string | ReactNode;
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
        <View
            className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-4"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                    {icon && (
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                            {icon}
                        </View>
                    )}

                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900" numberOfLines={2}>
                            {title}
                        </Text>

                        {subtitle && (
                            <Text className="mt-0.5 text-sm font-medium text-gray-500" numberOfLines={2}>
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
                <View className="mt-3 border-t border-gray-100 pt-3">
                    <Text className="text-sm leading-5 text-gray-600">
                        {description}
                    </Text>
                </View>
            )}

        </View>
    );
};
