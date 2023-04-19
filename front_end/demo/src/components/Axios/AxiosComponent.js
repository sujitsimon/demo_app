import axios from 'axios';

const baseURL = 'http://127.0.0.1:8080/'

const Axios = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Request-Headers': '*'
      },
  });

export default Axios;