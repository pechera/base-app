import axios from 'axios';

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

            if (!currentRefreshToken) {
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.SERVE_URL}/api/token`,
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

                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.clear();
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
