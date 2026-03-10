// src/utils/deviceStorage.ts
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // RE-INSTALAR SE FOI REMOVIDO!
import 'react-native-get-random-values'; // Necessário para uuid no iOS/RN
import { v4 as uuidv4 } from 'uuid';
import * as Keychain from 'react-native-keychain'; // Necessário para o iOS

/**
 * Nome da chave que será usada para armazenar o ID no Keychain (apenas iOS).
 */
const UNIQUE_ID_SERVICE_KEY = 'uniqueDeviceId';

/**
 * Obtém o ID Único do dispositivo com lógica específica por plataforma:
 * - iOS: Usa Keychain para persistência após desinstalação.
 * - Android: Usa o Device ID nativo (Android ID), pois é mais estável
 * do que o Keystore após uma desinstalação completa.
 *
 * @returns {Promise<string>} O ID Único do dispositivo.
 */
export async function getPersistentUniqueId(): Promise<string> {
    
    if (Platform.OS === 'android') {
        try {
            // No Android, o getUniqueId() busca o ANDROID_ID, que sobrevive à desinstalação
            const deviceId = await DeviceInfo.getUniqueId();
            console.log('Device ID (Android Nativo):', deviceId);
            return deviceId;
        } catch (error) {
            console.error("Erro ao obter Device ID no Android:", error);
            // Fallback melhor: Retorna um ID único por sessão em vez de uma string fixa 
            // que misturaria os usuários no banco de dados.
            return uuidv4();
        }
    }

    if (Platform.OS === 'ios') {
        try {
            // 1. Tenta recuperar o ID existente no Keychain
            const credentials = await Keychain.getGenericPassword({ 
                service: UNIQUE_ID_SERVICE_KEY 
            });

            if (credentials && credentials.password) {
                console.log('Device ID recuperado do Keychain (iOS):', credentials.password);
                return credentials.password;
            }

            // 2. Se não existir, gera um novo UUID, salva e retorna
            const newId = uuidv4();
            await Keychain.setGenericPassword('deviceId', newId, { 
                service: UNIQUE_ID_SERVICE_KEY 
            });
            console.log('Novo Device ID gerado e salvo no Keychain (iOS):', newId);
            
            return newId;

        } catch (error) {
            console.error("Erro ao acessar/salvar no Keychain no iOS:", error);
            return uuidv4(); // Fallback de segurança
        }
    }

    return uuidv4();
}
