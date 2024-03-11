import { createAPI } from './api';

export const getProducts = async (actionType, postParams = null) => {
  const api = createAPI();

  try {
    const response = await api.post('', {action: actionType, ...postParams});
    return response.data.result
  } catch (error) {
      throw new Error(error);
    }
}
