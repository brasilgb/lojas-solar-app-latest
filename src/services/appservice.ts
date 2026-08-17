import axios from 'axios';

const PAYMENT_ENDPOINTS = [
    '(WS_ORDEM_PAGAMENTO)',
    '(WS_TRANSACAO_PIX)',
    '(WS_ATUALIZA_ORDEM)',
];

const appservice = axios.create({
    withCredentials: true
});

appservice.interceptors.request.use(async (request) => {

    request.baseURL = process.env.EXPO_PUBLIC_API_URL;
    // request.baseURL = "http://172.16.1.215:9090/servicecomercial/servlet/isCobol/";
    return request;
});

appservice.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const requestUrl = String(originalRequest?.url ?? '');
        const isPaymentRequest = PAYMENT_ENDPOINTS.some(endpoint =>
            requestUrl.includes(endpoint),
        );

        // Endpoints financeiros não podem ser repetidos automaticamente:
        // o servidor pode ter concluído a gravação antes de ocorrer o erro de rede.
        if (!originalRequest || originalRequest._sessionRetry || isPaymentRequest) {
            return Promise.reject(error);
        }

        originalRequest._sessionRetry = true;
        console.log('Abrindo sessão com o servidor novamente');

        const axiosNew = axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_URL,
            withCredentials: true
        });

        try {
            await axiosNew.get('(serviceapp)');
        } catch {
            return Promise.reject(error);
        }

        console.log('Refazendo a chamada original...');
        return appservice.request(originalRequest);
    },
);

export default appservice;
