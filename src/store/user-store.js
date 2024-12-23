// src/store/userStore.js
import { create } from 'zustand';

// Create the user store
const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || {
    user_name: '',
    email: '',
    role: '',

  },

  // Set user and persist to localStorage
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
    set({ user: userData });
  },

  // Clear user and remove from localStorage
  clearUser: () => {
    localStorage.removeItem('user'); // Clear from localStorage
    set({
      user: {
        user_name: '',
        email: '',
        role: '',

      }
    });
  }
}));

export default useUserStore;