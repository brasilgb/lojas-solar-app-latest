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

// Diferente do `appservice` (porta 8082), cuja sessão já costuma estar aberta pelo login e por
// dezenas de outras telas, o `servicecart` (porta 8086) só é chamado aqui, no pagamento com
// cartão. Sem nenhuma chamada anterior nesse host, o servidor não tem cookie de sessão e responde
// (PAG_CARTAO_CREDITO) com um 404 de aplicação — não porque a rota não existe, mas porque a sessão
// nunca foi aberta. E como esse endpoint é financeiro, ele é propositalmente excluído do retry
// reativo abaixo (evitar reenviar uma cobrança de resultado incerto). Por isso a sessão precisa ser
// garantida ANTES da primeira chamada, não depois de uma falha.
let sessionReady: Promise<void> | null = null;

function ensureSession(): Promise<void> {
    if (!sessionReady) {
        sessionReady = axios
            .create({ baseURL: BASE_URL, withCredentials: true, timeout: 20000 })
            .get('(pagamentos)?company=1')
            .then(() => undefined)
            .catch(error => {
                // Permite tentar abrir a sessão de novo na próxima chamada, em vez de travar
                // permanentemente numa falha pontual de rede.
                sessionReady = null;
                // Marca a falha como "nada foi cobrado ainda" para quem chama distinguir isto de
                // uma falha na cobrança em si (ex: em cartpayment.tsx, essa falha não deve travar
                // o formulário como se o cartão pudesse ter sido cobrado).
                error.isSessionPreflightError = true;
                throw error;
            });
    }
    return sessionReady;
}

servicecart.interceptors.request.use(async request => {
    if (!String(request.url ?? '').includes('(pagamentos)')) {
        await ensureSession();
    }
    return request;
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
