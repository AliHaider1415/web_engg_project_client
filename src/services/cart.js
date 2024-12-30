import axios from 'axios';
import { API_URL } from '../utils/api';
import api from './api';

// export const createProduct = async (values) => {
//   const formData = new FormData();
//   formData.append('name', values.name); // Map name to title
//   formData.append('description', values.description); // Map description to content
//   formData.append('price', values.price); // Add price field
//   formData.append('stock_quantity', values.stock_quantity); // Add stock_quantity field
//   formData.append('category', values.category); // Map category to category
  
//   if (values.image && values.image !== 'null') {
//     formData.append('image', values.image);
// }

//   try {
//       const response = await api.post(`${API_URL}products/user-products/`, formData, {
//           headers: {
//               'Content-Type': 'multipart/form-data',
//           },
//       });

//       return response.data;
//   } catch (error) {
//       console.error('New Product error:', error);
//       throw error.response?.data || new Error('New Product failed');
//   }
// };


export const getCart = async () => {
    
    try {
      
      // Construct the endpoint with query parameters
      const endpoint = `${API_URL}products/cart/`;
  
      // Fetch the data from the API
      const response = await api.get(endpoint);
  
      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching user cart:', error);
      throw error;
    }
};


export const addToCart = async (productId, quantity = 1) => {
    try {
      const endpoint = `${API_URL}products/cart/`;
      const payload = {
        product_id: productId,
        quantity,
      };
  
      const response = await api.post(endpoint, payload);
  
      return response.data; // Success message or updated cart data
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
    }
  };
  

export const updateCartItem = async (cartItemId, quantity) => {
try {
    const endpoint = `${API_URL}products/cart/`;
    const payload = {
    cart_item_id: cartItemId,
    quantity,
    };

    const response = await api.put(endpoint, payload);

    return response.data; // Success message or updated cart data
} catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
}
};


export const removeFromCart = async (cartItemId) => {
try {
    const endpoint = `${API_URL}products/cart/`;
    const payload = {
    cart_item_id: cartItemId,
    };

    const response = await api.delete(endpoint, { data: payload });

    return response.data; // Success message
} catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
}
};

