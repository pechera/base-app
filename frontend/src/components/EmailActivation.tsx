import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation, MutationFunction } from 'react-query';

import { Axios } from '../services/Axios';

import { IActivationLink, IOneMessageResponse } from '../types/data';

const EmailActivation: React.FC = () => {
    const { link } = useParams();

    const activateEmail: MutationFunction<IOneMessageResponse, IActivationLink> = async (activationData) => {
        const { data } = await Axios.post('/api/mail', activationData);
        return data;
    };

    const activateEmailMutation = useMutation<IOneMessageResponse, unknown, IActivationLink>(activateEmail, {
        onError: (error: any) => {
            toast.error(error.response.data.error);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });

    useLayoutEffect(() => {
        // turn off StrictMode
        activateEmailMutation.mutate({ link: link as string });
    }, []);

    return (
        <>
            <Toaster />
        </>
    );
};

export default EmailActivation;
