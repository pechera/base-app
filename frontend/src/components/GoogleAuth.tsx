import React from 'react';
import Axios from '../services/Axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useUserStore from '../store/Store';

type GoogleAuthData = {
    clientId: string;
    jwtToken: string;
};

type GoogleAuthProps = {
    setError: (error: string) => void;
};

const GoogleAuth: React.FC<GoogleAuthProps> = ({ setError }) => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const navigate = useNavigate();

    const { loginUser } = useUserStore();

    const sendGoogleData = async (
        clientId: string,
        jwtToken: string
    ): Promise<void> => {
        try {
            const response = await Axios.post('/api/login/google', {
                clientId,
                jwtToken,
            });

            const { accessToken, refreshToken, username } = response.data;

            if (accessToken && refreshToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                loginUser(username);

                const redirect = searchParams.get('redirect');

                redirect
                    ? navigate(redirect, { replace: true })
                    : navigate('/dashboard', { replace: true });
            }
        } catch (error: any) {
            console.log(error);
            setError(error.response.data.error);
        }
    };

    const handleGoogleError = () => {
        setError('Google Auth Error');
    };

    const responseMessage = (response: CredentialResponse) => {
        const { clientId, credential } = response;
        sendGoogleData(clientId!, credential!);
    };

    return (
        <div className="d-flex justify-content-center mt-3">
            <GoogleLogin
                theme="outline"
                size="large"
                type="standard"
                onSuccess={responseMessage}
                onError={handleGoogleError}
            />
        </div>
    );
};

export default GoogleAuth;
