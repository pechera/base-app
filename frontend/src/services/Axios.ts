import axios from 'axios';

const Axios = axios.create({
    // 'Content-Type': 'application/json',
    baseURL: import.meta.env.VITE_SERVE_URL,
    headers: {
        withCredentials: true,
        'Content-Type': 'application/json',
    },
});

export default Axios;
