import * as SecureStore from 'expo-secure-store';
import appservice from '@/services/appservice';
import { getDeviceId } from '@/services/device';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';

interface User {
  cpfcnpj: string;
  codigoCliente: string;
  nomeCliente: string;
  token: string;
}

interface AuthContextData {
  signedIn: boolean;
  user: User | null;
  loading: boolean;
  signIn: (cpfcnpj: any) => Promise<void>;
  signOut: () => Promise<void>;
  checkPassword: (credentials: any) => Promise<void>;
  recoverPasswordSubmit: (cpfcnpj: string) => Promise<void>;
  message: string | undefined;
  positionGlobal: any;
  returnStore: any;
}

const USER_KEY = 'user-data';
const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [positionGlobal, setPositionGlobal] = useState<any>([0, 0]);
  const [returnStore, setReturnStore] = useState<any>('');

  useEffect(() => {
    (async () => {
      const deviceId = await getDeviceId();
      setDeviceId(deviceId);
    })();
  }, []);

  useEffect(() => {
    async function loadPosition() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setPositionGlobal([latitude, longitude]);

      const response = await appservice.get(`(WS_LOJAS_PROXIMA)?latitude=${latitude}&longitude=${longitude}`);
      // console.log(response.data.resposta.data);
      const { data } = response.data.resposta;
      if (Array.isArray(data) && data.length > 0) {
        setReturnStore(data[0]);
      } else if (data?.loja) {
        // Caso retorne um objeto único
        setReturnStore(data.loja);
      }

    }
    loadPosition();
  }, []);

  async function loadStorageData() {
    try {
      const keepLoggedIn = await SecureStore.getItemAsync('keepUserLoggedIn');
      if (keepLoggedIn === 'true') {
        const userJson = await SecureStore.getItemAsync(USER_KEY);

        if (userJson) {
          const userParsed = JSON.parse(userJson);
          setUser(userParsed);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  const signIn = async (cpfcnpj: any) => {
    setLoading(true);

    try {
      const response = await appservice.get(`(WS_LOGIN_APP)?cpfcnpj=${cpfcnpj}`);

      if (response.status !== 200) {
        setLoading(false);
        throw new Error('Erro ao conectar no servidor.')
      }

      const { data, message } = response.data?.resposta;

      if (message !== 'OK') {
        setLoading(false);
        setMessage(message)
        return
      }

      if (data.cadastroCliente && data.cadastroSenha) {
        setLoading(false);
        setMessage(undefined);
        router.replace({
          pathname: '/check-password',
          params: {
            cpfcnpj: cpfcnpj as any,
            nomeCliente: data.nomeCliente,
            codigoCliente: data.codigoCliente,
          },
        });
      }
      if (!data.cadastroCliente && !data.cadastroSenha) {
        setMessage(undefined);
        setLoading(false);
        router.replace({
          pathname: '/not-registered',
          params: {
            cpfcnpj: cpfcnpj as any,
          },
        });
      }
      if (data.cadastroCliente && !data.cadastroSenha) {
        setLoading(false);
        setMessage(undefined);
        router.replace({
          pathname: '/register-password',
          params: {
            cpfcnpj: cpfcnpj as any,
            nomeCliente: data.nomeCliente,
          },
        });
      }

    }
    catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const checkPassword = async (credentials: any) => {

    setLoading(true);

    try {
      const response = await appservice.get(`(WS_VERIFICAR_SENHA_APP)?cpfcnpj=${credentials.cpfcnpj}&senha=${credentials.senha}&deviceId=${deviceId}`)
      if (response.status !== 200) {
        setLoading(false);
        throw new Error('Erro ao conectar no servidor.')
      }

      const { success, message, data } = response.data?.resposta;

      if (!success) {
        setLoading(false);
        setMessage(message)
        return
      }

      if (credentials.connected) {
        await SecureStore.setItemAsync('keepUserLoggedIn', 'true');
      } else {
        await SecureStore.deleteItemAsync('keepUserLoggedIn');
      }

      let userData = {
        cpfcnpj: credentials.cpfcnpj,
        codigoCliente: credentials.codigoCliente,
        nomeCliente: credentials.nomeCliente,
        token: data.token,
      }

      setUser(userData);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      router.replace({
        pathname: '/(drawer)',
      });

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const recoverPasswordSubmit = async (cpfcnpj: string) => {

    try {
      const response = await appservice.get(`(WS_RECUPERA_SENHA)?cpfcnpj=${cpfcnpj}`);
      const { success, message, data } = response.data?.resposta;

      if (!success) {
        setMessage(message)
        return
      }

      router.replace({
        pathname: '/recover-password',
        params: {
          email: data.email,
        },
      });

    } catch (error) {
      console.log(error)
    }
  };

  const disconnect = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync(USER_KEY);
  }

  const signOut = async () => {

    Alert.alert(
      'Atenção - Ação de Logout',
      'Você será desconectado, deseja continuar?',
      [
        { text: 'Sim', onPress: () => disconnect() },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <AuthContext.Provider
      value={{
        signedIn: !!user,
        user,
        loading,
        signIn,
        checkPassword,
        recoverPasswordSubmit,
        signOut,
        message,
        positionGlobal,
        returnStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
