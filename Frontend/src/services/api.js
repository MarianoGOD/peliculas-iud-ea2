import axios from 'axios';

// Conexion con nuestra API
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;