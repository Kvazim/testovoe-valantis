import { createAPI } from './api';

const api = createAPI();

export const getProducts = async (actionType, postParams = null) => {
  try {
    const response = await api.post('', {action: actionType, ...postParams});
    return response.data.result
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    throw error;
  }
}
