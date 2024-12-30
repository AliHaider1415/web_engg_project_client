import axios from 'axios';
import { API_URL } from '../utils/api';
import api from './api';

export const createBlog = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('status', values.status);
    formData.append('category', values.category);
    formData.append('image', values.image);

    try {

        
        const response = await api.post(`${API_URL}blogs/user-blogs/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('New Blog error:', error);
        throw error.response?.data || new Error('New Blog failed');
    }
};


export const getUserBlogList = async (status, category) => {
    
    try {
      // Initialize query parameters
      const params = new URLSearchParams();

      if(status){
        params.append('status', status);
      }

      if(category){
        params.append('category', category);
      }

      // Construct the endpoint with query parameters
      const endpoint = `${API_URL}blogs/user-blogs/?${params.toString()}`;
  
      // Fetch the data from the API
      const response = await api.get(endpoint);
  
      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw error;
    }
};


export const getGuestBlogList = async (status, category) => {
    
  try {
    // Initialize query parameters
    const params = new URLSearchParams();

    if(status){
      params.append('status', status);
    }

    if(category){
      params.append('category', category);
    }

    // Construct the endpoint with query parameters
    const endpoint = `${API_URL}blogs/guest-blogs/?${params.toString()}`;

    // Fetch the data from the API
    const response = await api.get(endpoint);

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error fetching guest blogs:', error);
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


export const getBlogsCount = async () => {
    
  try {
    
    // Construct the endpoint with query parameters
    const endpoint = `${API_URL}blogs/blogs-count/`;

    // Fetch the data from the API
    const response = await api.get(endpoint);

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs count:', error);
    throw error;
  }
};
  

export const getBlogComments = async (blogId) => {
  try {
      // Construct the endpoint to fetch comments for a specific blog post
      const endpoint = `${API_URL}blogs/blogs/${blogId}/comments/`;

      // Fetch the data from the API
      const response = await api.get(endpoint);

      // Return the response data
      return response.data;
  } catch (error) {
      console.error('Error fetching blog comments:', error);
      throw error.response?.data || new Error('Fetching blog comments failed');
  }
};


export const postBlogComment = async (blogId, content) => {
  try {
      // Prepare the data to be sent in the request
      const data = {
          content: content,
      };

      // Construct the endpoint to post a comment for a specific blog post
      const endpoint = `${API_URL}blogs/blogs/${blogId}/comments/`;

      // Send the request to create a new comment
      const response = await api.post(endpoint, data);

      // Return the response data
      return response.data;
  } catch (error) {
      console.error('Error posting comment on blog:', error);
      throw error.response?.data || new Error('Posting comment failed');
  }
};

