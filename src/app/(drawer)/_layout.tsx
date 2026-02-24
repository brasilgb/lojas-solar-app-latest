import React, { useEffect } from 'react'
import { Drawer } from 'expo-router/drawer';
import { BanknoteArrowDownIcon, FilePenLineIcon, HandCoinsIcon, HandshakeIcon, HistoryIcon, HomeIcon, KeyRoundIcon, LogOut, MapPinIcon, PhoneCallIcon, ShieldUserIcon, User2Icon, UserIcon, WrenchIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { BackHandler, View, Text } from 'react-native';
import { DrawerContent, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import DrawerHeader from '@/components/layouts/DrawerHeader';
import { Link } from 'expo-router';

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

            <View className="items-center justify-center py-4 bg-solar-blue-primary">
                <View className="mt-4 w-24 h-24 rounded-full border-4 border-solar-green-primary bg-white items-center justify-center mb-4">
                    <UserIcon size={60} color={'#1a9cd9'} />
                </View>
                <Text className="text-white">{user?.nomeCliente}</Text>
            </View>

            <DrawerContent {...props}>
                <DrawerItemList {...props} />
            </DrawerContent>

            <View className={`flex-row items-center justify-between p-5 border-t border-t-gray-200`}>
                <Link
                    className="text-xs text-gray-600"
                    href={'/(drawer)/frequently-asked-questions'}
                >
                    Perguntas frequentes
                </Link>
                <Link
                    className="text-xs text-gray-600"
                    href={'/(drawer)/privacy-police'}
                >
                    Política de Privacidade
                </Link>
            </View>

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

            <Drawer.Screen
                name="(docsassign)"
                options={{
                    headerShown: false,
                    drawerLabel: "Assinar Documentos",
                    title: "Assinar Documentos",
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <FilePenLineIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="privacy-settings"
                options={{
                    drawerLabel: "Configurações de Privacidade",
                    title: "Configurações de Privacidade",
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <ShieldUserIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="stores-location"
                options={{
                    drawerLabel: "Lojas Próximas de Você",
                    title: "Lojas Próximas de Você",
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <MapPinIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="contact"
                options={{
                    drawerLabel: "Fale Conosco",
                    title: "Fale Conosco",
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <PhoneCallIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="(payment)"
                options={{
                    drawerLabel: "Faça seu Pagamento",
                    title: "Faça seu Pagamento",
                    headerShown: false,
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <HandCoinsIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="(cashback)"
                options={{
                    drawerLabel: "Cashback",
                    title: "Cashback",
                    headerShown: false,
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <BanknoteArrowDownIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="(history)"
                options={{
                    drawerLabel: "Histórico de Compras",
                    title: "Histórico de Compras",
                    headerShown: false,
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <HistoryIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="(assistance)"
                options={{
                    drawerLabel: "Protocolo de assistência",
                    title: "Protocolo de assistência",
                    headerShown: false,
                    drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
                    drawerIcon: ({ color, size }) => (
                        <WrenchIcon color={color} size={size} />
                    ),
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="privacy-police"
                options={{
                    drawerLabel: () => null,
                    drawerItemStyle: { display: 'none' },
                }}
            />

            <Drawer.Screen
                name="frequently-asked-questions"
                options={{
                    drawerLabel: () => null,
                    drawerItemStyle: { display: 'none' },
                }}
            />

        </Drawer>
    )
}