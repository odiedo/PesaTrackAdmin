import axios from 'axios';

const API_URL = 'http://192.168.100.20:5000/';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
