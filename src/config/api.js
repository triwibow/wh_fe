import axios from 'axios';
import { API_URL } from './keys';

const API = axios.create({
    baseURL: `${API_URL}/api/v1`
});

const setAuthToken = (token) => {
    if(token){
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
}

export {
    API,
    setAuthToken
}