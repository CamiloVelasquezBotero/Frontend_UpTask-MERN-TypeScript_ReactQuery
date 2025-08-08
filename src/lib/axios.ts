import axios from 'axios'

// URL base para todas las peticiones
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// Creamos un interceptor con Axios para que cada que usemos Request,  pasemos la autorizacion, de esta manera ahorramos codigo
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('AUTH_TOKEN') // Token del user autenticado
    if(token) {
        config.headers.Authorization = `Bearer ${token}` // Configuramos el authorization para no colcoarlo en cada funcion de projetAPI
    }

    return config
})

export default api