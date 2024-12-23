// src/services/authService.js
import axios from 'axios';
import { API_URL } from '../utils/api';

export const loginUser = async (values) => {
    const formData = new FormData();
    formData.append('user_name', values.user_name);
    formData.append('password', values.password);

    try {

        
        const response = await axios.post(`${API_URL}accounts/login/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { access, refresh } = response.data;

        // Store tokens in localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error.response?.data || new Error('Login failed');
    }
};


export const registerUser = async (values) => {
    const formData = new FormData();
    formData.append('username', values.user_name);
    formData.append('phone', values.phone);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('role', values.role);

    try {

        
        const response = await axios.post(`${API_URL}accounts/register/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error.response?.data || new Error('Registeration failed');
    }
};