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
  alterPassword: (credentials: any) => Promise<void>;
  disconnect: () => Promise<void>;
  message: string | undefined;
  positionGlobal: any;
  returnStore: any;
  setInfoCustomerToExcludeData: any;
  infoCustomerToExcludeData: any;
}

const USER_KEY = 'user-data';
const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [positionGlobal, setPositionGlobal] = useState<any>([0, 0]);
  const [returnStore, setReturnStore] = useState<any>('');
  const [infoCustomerToExcludeData, setInfoCustomerToExcludeData] = useState<any>([]);

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
      const { data } = response.data.resposta;
      if (Array.isArray(data) && data.length > 0) {
        setReturnStore(data[0]);
      } else if (data?.loja) {
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
        emailCliente: credentials?.emailCliente,
        celularCliente: credentials?.celularCliente,
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
    setLoading(true)
    try {
      const response = await appservice.get(`(WS_RECUPERA_SENHA)?cpfcnpj=${cpfcnpj}`);
      const { success, message, data } = response.data?.resposta;

      if (!success) {
        setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const alterPassword = async (alterData: any) => {
    setLoading(true);

    try {
      const response = await appservice.get(`(WS_ALTERAR_SENHA_APP)?cpfcnpj=${alterData.cpfcnpj}&token=${alterData.token}&senha=${alterData.senha}&senhaAnterior=${alterData.senhaAnterior}`);
      const { success, message, data } = response.data?.resposta;

      if (!success) {
        setLoading(false);
        setMessage(message)
        return
      } else {
        setMessage(undefined);
      }

      const userData = {
        cpfcnpj: alterData.cpfcnpj,
        codigoCliente: user?.codigoCliente,
        nomeCliente: user?.nomeCliente,
        token: data?.token,
      } as any;

      setUser(userData);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      Alert.alert('Atenção', message, [
        {
          text: 'Ok', onPress: () => router.replace({
            pathname: '/(drawer)',
          })
        },
      ]);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const disconnect = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync(USER_KEY);
    router.replace({
      pathname: '/(drawer)',
    });
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
        alterPassword,
        signOut,
        disconnect,
        message,
        positionGlobal,
        returnStore,
        setInfoCustomerToExcludeData,
        infoCustomerToExcludeData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
