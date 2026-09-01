import axios from 'axios';

const BASE_URL = 'https://services.gruposolar.com.br:8086/servicesgruposolar/servlet/isCobol';

// Endpoints financeiros não podem ser repetidos automaticamente:
// o servidor pode ter concluído a cobrança antes de ocorrer o erro de rede.
const PAYMENT_ENDPOINTS = ['(PAG_CARTAO_CREDITO)'];

const servicecart = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 20000,
});

servicecart.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const requestUrl = String(originalRequest?.url ?? '');
        const isPaymentRequest = PAYMENT_ENDPOINTS.some(endpoint =>
            requestUrl.includes(endpoint),
        );

        if (!originalRequest || originalRequest._sessionRetry || isPaymentRequest) {
            return Promise.reject(error);
        }

        originalRequest._sessionRetry = true;
        console.log('Abrindo sessão com o servidor novamente');

        const axiosNew = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
            timeout: 20000,
        });

        try {
            await axiosNew.get('(pagamentos)?company=1');
        } catch {
            return Promise.reject(error);
        }

        console.log('Refazendo a chamada original...');
        return servicecart.request(originalRequest);
    },
);

export default servicecart;
