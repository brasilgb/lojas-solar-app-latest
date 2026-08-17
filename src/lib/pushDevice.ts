import { Platform } from 'react-native';

import appservice from '@/services/appservice';

/**
 * Token FCM da sessão atual, em memória. É preenchido uma única vez pelo
 * fluxo de inicialização do Firebase Messaging (src/app/_layout.tsx) e
 * reaproveitado aqui sempre que precisamos re-sincronizar o device com o
 * backend (ex.: quando o código do cliente muda após login/logout),
 * sem precisar gerar um novo token nem repetir o pedido de permissão.
 */
let cachedFcmToken: string | undefined;

export function setCachedFcmToken(token: string | undefined) {
  cachedFcmToken = token;
}

export function getCachedFcmToken() {
  return cachedFcmToken;
}

/**
 * Grava/atualiza no backend (WS_GRAVA_DEVICE) o vínculo entre este device,
 * o token push atual e o código do cliente informado.
 *
 * Chamada em dois momentos:
 *  1. Na inicialização do app (src/app/_layout.tsx), com o codcli que já
 *     estiver salvo no SecureStore naquele instante.
 *  2. No AuthContext, logo após login/logout, para que o backend não fique
 *     com um codcli desatualizado (0, ou de outro cliente) associado a este
 *     device até o próximo cold start do app.
 *
 * Best-effort: erros são apenas logados, nunca lançados, para não impactar
 * o fluxo de login/logout do usuário.
 */
export async function registerPushDevice(deviceId: string, codcli: string) {
  if (!deviceId) {
    return;
  }

  if (!cachedFcmToken) {
    // Ainda não há token de push nesta sessão (permissão negada, FCM não
    // inicializado, etc.) — nada a sincronizar com o backend por enquanto.
    return;
  }

  try {
    const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');

    await appservice.get(
      `(WS_GRAVA_DEVICE)?deviceId=${encodeURIComponent(deviceId)}&pushToken=${encodeURIComponent(cachedFcmToken)}&deviceOs=${encodeURIComponent(Platform.OS)}&versaoApp=${encodeURIComponent(versaoapp || '')}&codcli=${encodeURIComponent(codcli)}`
    );

    console.log('Device sincronizado com o backend. codcli:', codcli);
  } catch (error) {
    console.log('Erro ao sincronizar device com o backend:', error);
  }
}
