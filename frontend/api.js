import axios from 'axios';

const API_URL = 'http://192.168.1.25:5000/';

export const getProductsFromJson = async () => {
    try {
      const response = await axios.get(`${API_URL}products-json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products from JSON:', error);
      return { products: [] };
    }
  };
export const syncProducts = async () => {
  try {
    const response = await fetch(`${API_URL}sync-products`, {
      method: 'POST',
    });
    const data = await response.json();
    if (response.ok) {
      alert('Products synced successfully!');
    } else {
      console.error('Failed to sync products:', data.error);
      alert('Failed to sync products');
    }
  } catch (error) {
    console.error('Error syncing products:', error);
    alert('Error syncing products');
  }
};
