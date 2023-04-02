import axios from 'axios';

// Axios for API calls
const Axios = axios.create({
    baseURL: import.meta.env.VITE_SERVE_URL,
    headers: {
        withCredentials: true,
        'Content-Type': 'application/json',
    },
});

// Axios for API calls with JWT
const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_SERVE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
    },

    (error) => {
        console.log('999');
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const currentRefreshToken = localStorage.getItem('refreshToken');

            try {
                if (!currentRefreshToken) {
                    throw new Error('no refresh token');
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_SERVE_URL}/api/token`,
                    {
                        refreshToken: currentRefreshToken,
                    },
                    {
                        headers: {
                            withCredentials: true,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const { accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                originalRequest.headers.authorization = `Bearer ${accessToken}`;

                console.log('NEW TOKENS HERE');

                return axiosInstance(originalRequest);
            } catch (err: any) {
                (err.message && err.message === 'no refresh token') ||
                (err.response && err.response.status === 401)
                    ? (window.location.href = '/logout')
                    : Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export { Axios, axiosInstance };
