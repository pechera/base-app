import axios from 'axios';

const Axios = axios.create({
    // 'Content-Type': 'application/json',
    baseURL: 'http://localhost:4000',
    headers: {
        withCredentials: true,
        'Content-Type': 'application/json',
    },
});

export default Axios;
