// src/utils/deviceStorage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // RE-INSTALAR SE FOI REMOVIDO!
import 'react-native-get-random-values'; // Necessário para uuid no iOS/RN
import { v4 as uuidv4 } from 'uuid';
import * as Keychain from 'react-native-keychain'; // Necessário para o iOS

/**
 * Nome da chave que será usada para armazenar o ID no Keychain (apenas iOS).
 */
const UNIQUE_ID_SERVICE_KEY = 'uniqueDeviceId';
const DEVICE_ID_STORAGE_KEY = 'device_id';

async function getStoredDeviceId() {
    const storedDeviceId = await SecureStore.getItemAsync(DEVICE_ID_STORAGE_KEY);

    if (storedDeviceId) {
        return storedDeviceId;
    }

    if (Platform.OS !== 'ios') {
        return null;
    }

    const credentials = await Keychain.getGenericPassword({
        service: UNIQUE_ID_SERVICE_KEY,
    });

    return credentials ? credentials.password : null;
}

async function saveDeviceId(deviceId: string) {
    await SecureStore.setItemAsync(DEVICE_ID_STORAGE_KEY, deviceId);

    if (Platform.OS === 'ios') {
        await Keychain.setGenericPassword('deviceId', deviceId, {
            service: UNIQUE_ID_SERVICE_KEY,
        });
    }
}

/**
 * Obtém o ID Único do dispositivo com lógica específica por plataforma:
 * - iOS: Usa Keychain e SecureStore para persistência.
 * - Android: Persiste o ID no SecureStore e migra do Android ID nativo.
 *
 * @returns {Promise<string>} O ID Único do dispositivo.
 */
export async function getPersistentUniqueId(): Promise<string> {
    try {
        const storedDeviceId = await getStoredDeviceId();

        if (storedDeviceId) {
            console.log('Device ID recuperado do storage:', storedDeviceId);
            return storedDeviceId;
        }

        const nativeDeviceId =
            Platform.OS === 'android' ? await DeviceInfo.getUniqueId() : uuidv4();
        const newDeviceId = nativeDeviceId || uuidv4();

        await saveDeviceId(newDeviceId);
        console.log('Novo Device ID gerado e salvo:', newDeviceId);

        return newDeviceId;
    } catch (error) {
        console.error('Erro ao acessar/salvar Device ID:', error);

        const fallbackDeviceId = uuidv4();
        try {
            await saveDeviceId(fallbackDeviceId);
        } catch (saveError) {
            console.error('Erro ao salvar fallback Device ID:', saveError);
        }

        return fallbackDeviceId;
    }
}
