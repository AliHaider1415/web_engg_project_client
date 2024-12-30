import axios from 'axios';
import { API_URL } from '../utils/api';
import api from './api';

export const createProduct = async (values) => {
  const formData = new FormData();
  formData.append('name', values.name); // Map name to title
  formData.append('description', values.description); // Map description to content
  formData.append('price', values.price); // Add price field
  formData.append('stock_quantity', values.stock_quantity); // Add stock_quantity field
  formData.append('category', values.category); // Map category to category
  
  if (values.image && values.image !== 'null') {
    formData.append('image', values.image);
}

  try {
      const response = await api.post(`${API_URL}products/user-products/`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      return response.data;
  } catch (error) {
      console.error('New Product error:', error);
      throw error.response?.data || new Error('New Product failed');
  }
};


export const getUserProductList = async (category, min_price, max_price) => {
    
    try {
      // Initialize query parameters
      const params = new URLSearchParams();


      if(category){
        params.append('category', category);
      }
      if(min_price){
        params.append('min_price', min_price);
      }
      if(max_price){
        params.append('max_price', max_price);
      }

      // Construct the endpoint with query parameters
      const endpoint = `${API_URL}products/user-products/?${params.toString()}`;
  
      // Fetch the data from the API
      const response = await api.get(endpoint);
  
      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching user products:', error);
      throw error;
    }
};


export const getGuestProductList = async (category, min_price, max_price) => {
    
    try {
      // Initialize query parameters
      const params = new URLSearchParams();


      if(category){
        params.append('category', category);
      }
      if(min_price){
        params.append('min_price', min_price);
      }
      if(max_price){
        params.append('max_price', max_price);
      }

      // Construct the endpoint with query parameters
      const endpoint = `${API_URL}products/guest-products/?${params.toString()}`;
  
      // Fetch the data from the API
      const response = await api.get(endpoint);
  
      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching guest products:', error);
      throw error;
    }
};

export const deleteBlog = async (id) => {
    try {
        const response = await api.delete(`${API_URL}blogs/user-blogs/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Delete Blog error:', error);
        throw error.response?.data || new Error('Delete Blog failed');
    }
};


export const editBlog = async (id, values) => {
    try {
      
      const response = await api.put(`${API_URL}blogs/user-blogs/${id}/`, values); // Send values as body
      return response.data;
    } catch (error) {
      console.error('Edit Blog error:', error);
      throw error.response?.data || new Error('Edit Blog failed');
    }
  };


  export const getBlogDetail = async (id) => {
    
    try {

      // Construct the endpoint with query parameters
      const endpoint = `${API_URL}blogs/blogs-detail/${id}`;
  
      // Fetch the data from the API
      const response = await api.get(endpoint);
  
      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      throw error;
    }
};

