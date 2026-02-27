import DrawerHeader from '@/components/layouts/DrawerHeader';
import { Stack } from 'expo-router';

const PaymentLayout = () => {

    const resolveHeaderType = (routeName: string) => {
        switch (routeName) {
            case 'payment':
                return 'drawer'; // tela raiz (abre menu)

            default:
                return 'stack'; // telas internas (voltar)
        }
    };

    return (
        <Stack
            initialRouteName='payment'
            screenOptions={({ route }) => ({
                animation: 'fade',
                headerShown: true,
                header: () => (
                    <DrawerHeader typel={resolveHeaderType(route.name)} />
                ),
            })}
        >
            <Stack.Screen
                name="payment"
                options={{
                    title: 'Pagamentos',
                }}
            />

            <Stack.Screen
                name="methods"
                options={{
                    title: 'Métodos de Pagamentos',
                }}
            />

            <Stack.Screen
                name="pixpayment"
                options={{
                    title: 'Pagamento pix',
                }}
            />

            <Stack.Screen
                name="cartpayment"
                options={{
                    title: 'Pagamento com Cartão',
                }}
            />

            <Stack.Screen
                name="cardbillpaid"
                options={{
                    title: 'Pagamento com Cartão',
                }}
            />
        </Stack>
    );
};

export default PaymentLayout;
