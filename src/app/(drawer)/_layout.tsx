import React, { useEffect } from 'react'
import { Drawer } from 'expo-router/drawer';
import { BanknoteArrowDownIcon, FilePenLineIcon, HandCoinsIcon, HandshakeIcon, HistoryIcon, HomeIcon, KeyRoundIcon, LogInIcon, LogOut, LogOutIcon, MapPinIcon, PhoneCallIcon, ShieldUserIcon, User2Icon, UserIcon, WrenchIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { BackHandler, View, Text } from 'react-native';
import { DrawerContent, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import DrawerHeader from '@/components/layouts/DrawerHeader';
import { Link, router } from 'expo-router';

function CustomDrawerContent(props: any) {
    const { user, signedIn, signOut } = useAuth();

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

    const TextBoasVindas = () => {
        return (
            <View className='flex-col items-center justify-center'>
                <Text className='text-white'>Faça o login e aproveite as vantagens do</Text>
                <Text className='text-white font-semibold'>Aplicativo das Lojas Solar</Text>
            </View>
        )
    };

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const HeaderUser = () => {
        const greeting = getGreeting();

        return (
            <View className="items-center justify-center py-6 bg-solar-blue-primary">
                <View className="mt-4 w-24 h-24 rounded-full border-4 border-solar-green-primary bg-white items-center justify-center mb-4">
                    <UserIcon size={60} color={'#1a9cd9'} />
                </View>

                {signedIn ? (
                    <>
                        <Text className="text-white text-base">
                            {greeting},
                        </Text>

                        <Text className="text-white text-sm font-bold">
                            {user?.nomeCliente}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text className="text-white text-base text-center px-6">
                            Faça login e aproveite as vantagens do
                        </Text>

                        <Text className="text-white text-lg font-semibold">
                            Aplicativo das Lojas Solar
                        </Text>
                    </>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1">

            <HeaderUser />

            <DrawerContent {...props}>
                <DrawerItemList {...props} />
            </DrawerContent>

            <View>
                <View className='px-4'>
                    <DrawerItem
                        icon={({ color, size }) => (
                            signedIn ? <LogOutIcon color={color} size={size} /> : <LogInIcon color={color} size={size} />
                        )}
                        label={signedIn ? 'Sair' : 'Login'}
                        onPress={() =>
                            signedIn
                                ? signOut()
                                : router.push('/sign-in')
                        }
                    />
                </View>
                <View className={`flex-row items-center justify-between p-5 border-t border-t-gray-200`}>
                    <Link
                        className="text-xs text-gray-600"
                        href={'/questions'}
                    >
                        Perguntas frequentes
                    </Link>
                    <Link
                        className="text-xs text-gray-600"
                        href={'/privacy-police'}
                    >
                        Política de Privacidade
                    </Link>
                </View>
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
                name="(location)"
                options={{
                    headerShown: false,
                    drawerLabel: "Lojas Próximas de Você",
                    title: "Lojas Próximas de Você",
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
                    header: () => <DrawerHeader typel={'drawer'} typer={''} />
                }}
            />

            <Drawer.Screen
                name="(question)"
                options={{
                    headerShown: false,
                    drawerLabel: () => null,
                    drawerItemStyle: { display: 'none' },
                }}
            />

        </Drawer>
    )
}