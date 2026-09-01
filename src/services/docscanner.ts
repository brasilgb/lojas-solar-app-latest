import axios from 'axios';

const BASE_URL = 'https://services.gruposolar.com.br:8086/servicesgruposolar/servlet/isCobol/';

const docscanner = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 20000,
});

docscanner.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (!originalRequest || originalRequest._sessionRetry) {
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
            await axiosNew.get('(docscanner)');
        } catch {
            return Promise.reject(error);
        }

        console.log('Refazendo a chamada original...');
        return docscanner.request(originalRequest);
    },
);

export default docscanner;
