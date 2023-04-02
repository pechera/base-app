import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { Axios } from '../services/Axios';

const EmailActivation: React.FC = () => {
    const { link } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const response = await Axios.post('/api/mail', { link });

                toast.success(response.data.message);
            } catch (error: any) {
                console.log(error);
                toast.error(error.response.data.error);
            }
        })();
    }, []);
    return <Toaster />;
};

export default EmailActivation;
