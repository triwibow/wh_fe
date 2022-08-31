import axios from 'axios';

const API = axios.create({
    baseURL: "https://wayshub.herokuapp.com/api/v1",
    headers: {
    	'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
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