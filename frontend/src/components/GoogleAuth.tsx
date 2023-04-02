import React from 'react';
import { Axios } from '../services/Axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useUserHook from '../hooks/useUserHook';

import { GoogleDataSender, LoginResponseData } from '../types/data';

type GoogleAuthProps = {
    setError: (error: string) => void;
};

const GoogleAuth: React.FC<GoogleAuthProps> = ({ setError }) => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const navigate = useNavigate();

    const { loginUserService } = useUserHook();

    const sendGoogleData: GoogleDataSender = async (clientId, credential) => {
        try {
            const { data } = await Axios.post<LoginResponseData>(
                '/api/login/google',
                {
                    clientId,
                    credential,
                }
            );

            const loginData = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                username: data.username,
            };

            loginUserService(loginData);

            const redirect = searchParams.get('redirect');

            redirect
                ? navigate(redirect, { replace: true })
                : navigate('/dashboard', { replace: true });
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
