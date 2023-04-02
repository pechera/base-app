import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useUserStore from '../store/Store';

import useUserHook from '../hooks/useUserHook';

const Logout: React.FC = () => {
    const { isAuth } = useUserStore();

    const { logoutUserService } = useUserHook();

    useLayoutEffect(() => {
        if (isAuth) logoutUserService();
    }, []);

    return <Navigate to="/login" />;
};

export default Logout;
