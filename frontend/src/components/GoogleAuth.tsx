import React from 'react';
import { Axios } from '../services/Axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, MutationFunction } from 'react-query';

import useUserHook from '../hooks/useUserHook';

import { IGoogleFormValues, ILoginResponseData } from '../types/data';

type GoogleAuthProps = {
    setError: (error: string) => void;
};

const GoogleAuth: React.FC<GoogleAuthProps> = ({ setError }) => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const navigate = useNavigate();

    const { loginUserService } = useUserHook();

    const sendGoogleData: MutationFunction<ILoginResponseData, IGoogleFormValues> = async (loginData) => {
        const { data } = await Axios.post('/api/login/google', loginData);

        return data;
    };

    const loginGoogleMutation = useMutation<ILoginResponseData, unknown, IGoogleFormValues>(sendGoogleData, {
        onError: (error: any) => {
            console.log(error);
            setError(error.response.data.error);
        },
        onSuccess: (data) => {
            const loginData = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                username: data.username,
            };

            loginUserService(loginData);

            const redirect = searchParams.get('redirect');

            redirect ? navigate(redirect, { replace: true }) : navigate('/dashboard', { replace: true });
        },
    });

    const handleGoogleError = () => {
        setError('Google Auth Error');
    };

    const responseMessage = (response: CredentialResponse) => {
        const clientId = response.clientId as string;
        const credential = response.credential as string;

        const googleLoginData: IGoogleFormValues = {
            clientId,
            credential,
        };

        loginGoogleMutation.mutate(googleLoginData);
    };

    return (
        <div className="d-flex justify-content-center mt-3">
            <GoogleLogin theme="outline" size="large" type="standard" onSuccess={responseMessage} onError={handleGoogleError} />
        </div>
    );
};

export default GoogleAuth;
