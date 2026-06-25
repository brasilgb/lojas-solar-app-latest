import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import appservice from '@/services/appservice';
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
import { getPersistentUniqueId } from '@/utils/deviceStorage';

interface User {
  cpfcnpj: string;
  codigoCliente: string;
  nomeCliente: string;
  token: string;
}

interface AuthContextData {
  signedIn: boolean;
  setUser: any;
  user: User | null;
  loading: boolean;
  signIn: (cpfcnpj: string, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkPassword: (credentials: any) => Promise<void>;
  loginWithBiometrics: (credentials: any) => Promise<void>;
  recoverPasswordSubmit: (cpfcnpj: string) => Promise<void>;
  alterPassword: (credentials: any) => Promise<void>;
  disconnect: () => Promise<void>;
  expiredSession: () => Promise<void>;
  message: string | undefined;
  positionGlobal: any;
  setPositionGlobal: any;
  returnStore: any;
  setInfoCustomerToExcludeData: any;
  infoCustomerToExcludeData: any;
}

const USER_KEY = 'user-data';
const KEEP_LOGGED_IN_KEY = 'keepUserLoggedIn';
const SERVER_CONNECTION_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';

function normalizeCpfCnpj(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '');
}

const POST_LOGIN_PATHS = [
  '/account',
  '/assistance',
  '/cashback',
  '/docs-assign',
  '/history',
  '/payment',
] as const;

function getPostLoginPath(redirectTo: unknown) {
  return POST_LOGIN_PATHS.includes(redirectTo as typeof POST_LOGIN_PATHS[number])
    ? redirectTo as typeof POST_LOGIN_PATHS[number]
    : '/(drawer)';
}

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
      const deviceId = await getPersistentUniqueId();
      setDeviceId(deviceId);
    })();
  }, []);

  // ... dentro do seu AuthProvider
  useEffect(() => {
    async function loadPosition() {
      try {
        // 1. Verifica se o serviço de localização está ativo no dispositivo
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          Alert.alert(
            "GPS Desativado",
            "Por favor, ative a localização no seu dispositivo para encontrar lojas próximas."
          );
          return;
        }

        // 2. Verifica permissão atual e só solicita se necessário
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const permission = await Location.requestForegroundPermissionsAsync();
          status = permission.status;
        }

        if (status !== 'granted') {
          Alert.alert(
            "Permissão Negada",
            "Precisamos da sua localização para mostrar as lojas mais próximas de você."
          );
          return;
        }

        // 3. Tenta obter posição atual. Se falhar, usa última posição conhecida.
        let location: Location.LocationObject | null = null;
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        } catch (locationError) {
          console.warn('Falha ao obter posicao atual, tentando ultima posicao conhecida:', locationError);
          location = await Location.getLastKnownPositionAsync({
            maxAge: 60000,
            requiredAccuracy: 1000,
          });
        }

        if (!location?.coords) {
          Alert.alert(
            "Localizacao indisponivel",
            "Nao foi possivel obter sua localizacao agora. Tente novamente em alguns instantes."
          );
          return;
        }

        const { latitude, longitude } = location.coords;
        setPositionGlobal([latitude, longitude]);

        // 4. Chamada à API
        const response = await appservice.get(`(WS_LOJAS_PROXIMA)?latitude=${latitude}&longitude=${longitude}`);

        // Tratamento dos dados da API
        const data = response.data?.resposta?.data;
        if (Array.isArray(data) && data.length > 0) {
          setReturnStore(data[0]);
        } else if (data?.loja) {
          setReturnStore(data.loja);
        }

      } catch (error) {
        console.error("Erro no fluxo de localização:", error);
        // Opcional: Alerta genérico para o usuário
      }
    }

    // Pequeno delay para garantir que o layout do App já carregou
    const timer = setTimeout(() => {
      loadPosition();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  async function loadStorageData() {
    setLoading(true);
    try {
      const keepLoggedIn = await SecureStore.getItemAsync(KEEP_LOGGED_IN_KEY);
      if (keepLoggedIn === 'true') {
        const userJson = await SecureStore.getItemAsync(USER_KEY);

        if (userJson) {
          const serverAvailable = await checkServerConnection();

          if (!serverAvailable) {
            await disconnectFromUnavailableServer();
            return;
          }

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

  const signIn = async (cpfcnpj: string, redirectTo?: string) => {
    setLoading(true);
    setMessage(undefined);
    try {
      const normalizedCpfCnpj = normalizeCpfCnpj(cpfcnpj);
      const response = await appservice.get(
        `(WS_LOGIN_APP)?cpfcnpj=${encodeURIComponent(normalizedCpfCnpj)}`,
      );

      if (response.status !== 200) {
        setLoading(false);
        setMessage(SERVER_CONNECTION_MESSAGE);
        return;
      }

      const resposta = response.data?.resposta;

      if (!resposta) {
        setMessage(SERVER_CONNECTION_MESSAGE);
        return;
      }

      const { data, message } = resposta;

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
            cpfcnpj: normalizedCpfCnpj,
            nomeCliente: data.nomeCliente,
            codigoCliente: data.codigoCliente,
            ...(redirectTo ? { redirectTo } : {}),
          },
        });
      }
      if (!data.cadastroCliente && !data.cadastroSenha) {
        setMessage(undefined);
        setLoading(false);
        router.replace({
          pathname: '/not-registered',
          params: {
            cpfcnpj: normalizedCpfCnpj,
          },
        });
      }
      if (data.cadastroCliente && !data.cadastroSenha) {
        setLoading(false);
        setMessage(undefined);
        router.replace({
          pathname: '/register-password',
          params: {
            cpfcnpj: normalizedCpfCnpj,
            nomeCliente: data.nomeCliente,
          },
        });
      }

    }
    catch (error) {
      console.log(error);
      setMessage(SERVER_CONNECTION_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const checkPassword = async (credentials: any) => {

    setLoading(true);
    setMessage(undefined);

    try {
      const currentDeviceId = deviceId || await getPersistentUniqueId();
      if (!deviceId) {
        setDeviceId(currentDeviceId);
      }

      const normalizedCpfCnpj = normalizeCpfCnpj(credentials.cpfcnpj);
      const response = await appservice.get(`(WS_VERIFICAR_SENHA_APP)?cpfcnpj=${encodeURIComponent(normalizedCpfCnpj)}&senha=${encodeURIComponent(credentials.senha)}&deviceId=${encodeURIComponent(currentDeviceId)}`)
      if (response.status !== 200) {
        setLoading(false);
        setMessage(SERVER_CONNECTION_MESSAGE);
        return;
      }

      const resposta = response.data?.resposta;

      if (!resposta) {
        setMessage(SERVER_CONNECTION_MESSAGE);
        return;
      }

      const { success, message, data } = resposta;

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
        cpfcnpj: normalizedCpfCnpj,
        nomeCliente: credentials.nomeCliente,
        codigoCliente: credentials.codigoCliente,
        token: data.token,
      }

      setUser(userData);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      router.replace({
        pathname: getPostLoginPath(credentials.redirectTo),
      });

    } catch (error) {
      console.log(error);
      setMessage(SERVER_CONNECTION_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  const loginWithBiometrics = async (credentials: any) => {
    setLoading(true);
    setMessage(undefined);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setMessage('Biometria não configurada neste aparelho.');
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entrar com biometria',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        setMessage('Biometria não confirmada.');
        return;
      }

      const currentDeviceId = deviceId || await getPersistentUniqueId();
      if (!deviceId) {
        setDeviceId(currentDeviceId);
      }

      const normalizedCpfCnpj = normalizeCpfCnpj(credentials.cpfcnpj);
      const response = await appservice.get(
        `(WS_LOGIN_BIOMETRIA_APP)?cpfcnpj=${encodeURIComponent(normalizedCpfCnpj)}&deviceId=${encodeURIComponent(currentDeviceId)}`,
      );

      if (response.status !== 200) {
        setMessage(SERVER_CONNECTION_MESSAGE);
        return;
      }

      const resposta = response.data?.resposta;

      if (!resposta) {
        setMessage(SERVER_CONNECTION_MESSAGE);
        return;
      }

      const { success, message, data } = resposta;

      if (!success) {
        setMessage(message);
        return;
      }

      const userData = {
        cpfcnpj: normalizedCpfCnpj,
        nomeCliente: data?.nomeCliente || credentials.nomeCliente,
        codigoCliente: data?.codigoCliente || credentials.codigoCliente,
        token: data?.token,
      };

      setUser(userData);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      router.replace({
        pathname: getPostLoginPath(credentials.redirectTo),
      });

    } catch (error) {
      console.log(error);
      setMessage(SERVER_CONNECTION_MESSAGE);
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
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(KEEP_LOGGED_IN_KEY);
    setUser(null);
    router.replace({
      pathname: '/(drawer)',
    });
  }

  const expiredSession = async () => {
    setUser(null);
    setLoading(false);
    setMessage(undefined);
    router.replace({
      pathname: '/sign-in',
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

  const checkServerConnection = async () => {
    try {
      const response = await appservice.get('(serviceapp)');
      return response?.status === 200;
    } catch (error) {
      console.log('Erro ao validar conexao com servidor:', error);
      return false;
    }
  };

  const disconnectFromUnavailableServer = async () => {
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(KEEP_LOGGED_IN_KEY);
    setUser(null);
    setLoading(false);
    setMessage(undefined);
    router.replace({
      pathname: '/(drawer)',
    });

    Alert.alert('Atenção', 'Sua sessão foi encerrada porque não foi possível conectar ao servidor.');
  };

  return (
    <AuthContext.Provider
      value={{
        signedIn: !!user,
        setUser,
        user,
        loading,
        signIn,
        checkPassword,
        loginWithBiometrics,
        recoverPasswordSubmit,
        alterPassword,
        signOut,
        disconnect,
        expiredSession,
        message,
        setPositionGlobal,
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
