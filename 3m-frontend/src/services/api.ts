import axios from 'axios';
import { useLanguageStore } from '../store/languageStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://3m-store-mu.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach language header
api.interceptors.request.use(
  (config) => {
    try {
      const currentLang = useLanguageStore.getState().language || 'ar';
      config.headers['Accept-Language'] = currentLang;
    } catch {
      config.headers['Accept-Language'] = 'ar';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    
    return Promise.reject(error);
  }
);
