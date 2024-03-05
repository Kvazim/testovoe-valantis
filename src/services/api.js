import axios from 'axios';
import { BaseURL } from '../const';
import { getAuthToken } from '../utils/common';

export const createAPI = () => {
    const api = axios.create({baseURL: BaseURL.Primary});

    const requestInterceptor = api.interceptors.request.use((config) => {
        const authString = getAuthToken();

        if (authString && config.headers) {
            config.headers['X-Auth'] = authString;
        }

        return config;
    });

    const responseInterceptor = api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                console.error(error.response.data.error);

                api.defaults.baseURL = BaseURL.Secondary;

                return api(error.config);
            }

            return Promise.reject(error);
        }
    );

    api.interceptors.request.eject(requestInterceptor);
    api.interceptors.response.eject(responseInterceptor);

    return api;
};
