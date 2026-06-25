import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { BanknoteArrowDownIcon, CircleHelpIcon, FilePenLineIcon, HandCoinsIcon, HandshakeIcon, HistoryIcon, HomeIcon, KeyRoundIcon, LogInIcon, LogOutIcon, MapPinIcon, PhoneCallIcon, ShieldCheckIcon, ShieldUserIcon, UserIcon, WrenchIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Pressable, View, Text } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import DrawerHeader from '@/components/layouts/DrawerHeader';
import { router } from 'expo-router';

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

function getInitials(name?: string) {
    if (!name) return 'LS';

    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase() || 'LS';
}

function maskCpfCnpj(document?: string) {
    const onlyNumbers = String(document ?? '').replace(/\D/g, '');

    if (!onlyNumbers) return '';
    if (onlyNumbers.length <= 5) return onlyNumbers.replace(/\d/g, '*');

    const first = onlyNumbers.slice(0, 3);
    const last = onlyNumbers.slice(-2);
    const hidden = '*'.repeat(Math.max(onlyNumbers.length - 5, 0));

    return `${first}${hidden}${last}`;
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { user, signedIn, signOut } = useAuth();

    const HeaderUser = () => {
        const greeting = getGreeting();
        const customerName = user?.nomeCliente?.trim();
        const maskedDocument = maskCpfCnpj(user?.cpfcnpj);

        return (
            <View className="bg-solar-blue-primary px-5 pb-6 pt-7">
                {signedIn ? (
                    <View className="flex-row items-center">
                        <View className="h-16 w-16 rounded-full border-2 border-solar-green-primary bg-white items-center justify-center">
                            <Text className="text-xl font-bold text-solar-blue-primary">
                                {getInitials(customerName)}
                            </Text>
                        </View>

                        <View className="ml-4 flex-1">
                            <Text className="text-white/80 text-sm">
                                {greeting},
                            </Text>
                            <Text className="text-white text-base font-bold" numberOfLines={2}>
                                {customerName || 'Cliente Solar'}
                            </Text>
                            {!!maskedDocument && (
                                <Text className="mt-1 text-white/75 text-xs">
                                    CPF/CNPJ {maskedDocument}
                                </Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <View className="flex-row items-center">
                        <View className="h-16 w-16 rounded-full border-2 border-solar-green-primary bg-white items-center justify-center">
                            <UserIcon size={34} color={'#1a9cd9'} />
                        </View>

                        <View className="ml-4 flex-1">
                            <Text className="text-white/85 text-sm">
                                Faça login e aproveite as vantagens do
                            </Text>

                            <Text className="text-white text-lg font-bold">
                                Aplicativo das Lojas Solar
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const handleAccessPress = async () => {
        props.navigation.closeDrawer();

        if (signedIn) {
            await signOut();
            return;
        }

        router.push('/sign-in');
    };

    const handleFooterLinkPress = (href: '/questions' | '/privacy-police') => {
        props.navigation.closeDrawer();
        router.push(href);
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderUser />

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
            >
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View className="border-t border-gray-100 bg-white">
                <View className="bg-solar-blue-primary px-4 py-4">
                    <View className="flex-row">
                        <Pressable
                            onPress={handleAccessPress}
                            className="mr-3 flex-1 flex-row items-center rounded-lg px-2 py-3"
                        >
                            {signedIn ? (
                                <LogOutIcon color="white" size={22} />
                            ) : (
                                <LogInIcon color="white" size={22} />
                            )}
                            <Text className="ml-2 flex-1 text-base font-semibold text-white">
                                {signedIn ? 'Sair' : 'Entrar'}
                            </Text>
                        </Pressable>

                        <View className="flex-[1.35]">
                            <Pressable
                                onPress={() => handleFooterLinkPress('/questions')}
                                className="flex-row items-center rounded-lg px-2 py-2"
                            >
                                <CircleHelpIcon color="white" size={16} />
                                <Text className="ml-2 flex-1 text-xs font-medium text-white">
                                    Perguntas frequentes
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => handleFooterLinkPress('/privacy-police')}
                                className="flex-row items-center rounded-lg px-2 py-2"
                            >
                                <ShieldCheckIcon color="white" size={16} />
                                <Text className="ml-2 flex-1 text-xs font-medium text-white">
                                    Política de Privacidade
                                </Text>
                            </Pressable>
                        </View>
                    </View>
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
                drawerActiveBackgroundColor: '#1a9dd9c8',
                drawerActiveTintColor: '#ffffff'
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
                    header: () => <DrawerHeader typel={'drawer'} typer={'home'} />
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
                    header: () => <DrawerHeader typel={'drawer'} typer={'home'} />
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
                    header: () => <DrawerHeader typel={'drawer'} typer={'home'} />
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
                    header: () => <DrawerHeader typel={'drawer'} typer={'home'} />
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
                    header: () => <DrawerHeader typel={'drawer'} typer={'home'} />
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
                    header: () => <DrawerHeader typel={'drawer'} typer={'home'} />
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
