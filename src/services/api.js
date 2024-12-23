// src/services/api.js
import axios from 'axios';
import { API_URL } from '../utils/api';
import useUserStore from '../store/user-store';

const api = axios.create({
  baseURL: `${API_URL}`,
});

// Debugging Axios Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Debugging Axios Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If Unauthorized (401), try refreshing the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("401 Unauthorized - Attempting token refresh");

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}accounts/token/refresh/`, {
          refresh: refreshToken,
        });

        console.log("New Access Token:", response.data.access);

        // Store new access token
        localStorage.setItem('access_token', response.data.access);

        // Update the Authorization header and retry the original request
        api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);

        // Clear tokens and user data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Clear user data in the store
        useUserStore.getState().clearUser();

        console.log("Redirecting to login");
        // window.location.href = '/'; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default api;