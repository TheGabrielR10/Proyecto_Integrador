import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

// Interceptor para incluir el token en el encabezado de las solicitudes
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// Interceptor para manejar errores de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response && error.response.status === 401) {
          // Si el token ha expirado o no es válido, redirige al login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
      }
      return Promise.reject(error);
  }
);
export default instance;
