import axios from 'axios';
import { BaseURL, MAX_RETRY_COUNT } from '../const';
import { getAuthToken } from '../utils/common';

export const createAPI = () => {
    const api = axios.create({
        baseURL: BaseURL.Primary,
    });

    let retryCount = 0;

    api.interceptors.request.use((config) => {
        const authString = getAuthToken();

        if (authString) {
            config.headers['X-Auth'] = authString;
        }
        
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response && retryCount < MAX_RETRY_COUNT) {
                retryCount++;
                error.config.baseURL = error.config.baseURL === BaseURL.Primary ? BaseURL.Secondary : BaseURL.Primary;
                return api.request(error.config);
            }

            if (error.response) {
                console.error(error.response.data.error);
            }

            return Promise.reject(error);
        }
    );

    return api;
};