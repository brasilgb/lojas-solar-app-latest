import React, { useEffect } from 'react'
import { Drawer } from 'expo-router/drawer';
import { HandshakeIcon, HomeIcon, KeyRoundIcon, User2Icon, UserIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { BackHandler, View } from 'react-native';
import { DrawerContent, DrawerItemList } from '@react-navigation/drawer';
import DrawerHeader from '@/components/layouts/DrawerHeader';

function CustomDrawerContent(props: any) {
    const { user } = useAuth();

    useEffect(() => {
        const onBackPress = () => {
            return true;
        };

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress,
        );
        return () => subscription.remove();
    }, []);


    return (
        <View className="flex-1">
            <DrawerContent {...props}>
                <DrawerItemList {...props} />
            </DrawerContent>
        </View>
    )
}

export default function DrawerLayout() {
    const { signedIn } = useAuth();
    return (
        <Drawer
            drawerContent={CustomDrawerContent}
            screenOptions={{
                drawerHideStatusBarOnOpen: false,
                drawerType: 'front',
                drawerActiveBackgroundColor: '#bccf00',
                drawerActiveTintColor: '#0d3b85'
            }}
        >

            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: "Início",
                    title: "Bem-vindo",
                    drawerIcon: ({ color, size }) => (
                        <HomeIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={'drawer'} />
                }}
            />

            <Drawer.Screen
                name="(account)"
                options={{
                    drawerLabel: "Minha Conta",
                    title: "Minha Conta",
                    headerShown: false,
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <UserIcon color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="(crediary)"
                options={{
                    drawerLabel: "Crediário",
                    title: "Crediário",
                    headerShown: false,
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <HandshakeIcon color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="alter-password"
                options={{
                    drawerLabel: "Alterar Senha",
                    title: "Alterar Senha",
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <KeyRoundIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

        </Drawer>
    )
}