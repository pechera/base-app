import React, { useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation, MutationFunction } from 'react-query';

import { axiosInstance } from '../../services/Axios';

import { IOneMessageResponse } from '../../types/data';

interface IActivationLink {
    tempLink: string;
}

const ChangeEmailConfirm: React.FC = () => {
    const { tempLink } = useParams();
    const navigate = useNavigate();

    const confirmChangeEmail: MutationFunction<IOneMessageResponse, IActivationLink> = async (confirmData) => {
        const { data } = await axiosInstance.post('/api/profile/email/confirm', confirmData);
        return data;
    };

    const confirmEmailMutation = useMutation<IOneMessageResponse, unknown, IActivationLink>(confirmChangeEmail, {
        onError: (error: any) => {
            console.log(error);
            toast.error(error.response.data.message);
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success(data.message);
            setTimeout(() => navigate('/profile'), 1500);
        },
    });

    useLayoutEffect(() => {
        // turn off StrictMode
        confirmEmailMutation.mutate({ tempLink: tempLink as string });
    }, []);

    return (
        <>
            <div>ChangeEmailConfirm</div>
            <Toaster />
        </>
    );
};

export default ChangeEmailConfirm;
