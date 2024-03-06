import axios from 'axios';
import { BaseURL } from '../const';
import { getAuthToken } from '../utils/common';

export const createAPI = (actionString, params) => {
    const api = axios.create({
        baseURL: BaseURL.Primary,
        action: actionString,
    });

    api.interceptors.request.use((config) => {
        const authString = getAuthToken();
        config.headers['Content-Type'] = 'application/json';

        if (authString) {
            config.headers['X-Auth'] = authString;
        }

        if (params) {
            config.params = params;
        }

        return config;
    });

    const responseInterceptor = api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                console.error(error.response.data.error);

                api.defaults.baseURL = BaseURL.Secondary;

                return Promise.reject(error);
            }
        }
    );

    api.interceptors.response.eject(responseInterceptor);

    return api;
};
