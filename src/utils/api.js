import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use(
  (config) => {
    const token = cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = cookies.get('refresh_token');
        const res = await axios.post('http://localhost:8080/auth/refresh', { refresh_token: refreshToken });
        
        const { access_token, expires_in } = res.data;
        cookies.set('access_token', access_token, {
          path: '/',
          expires: new Date(Date.now() + expires_in * 1000),
          secure: true
        });
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        cookies.remove('access_token');
        cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;