import React from 'react';
import { Navigate } from 'react-router-dom';

import useUserStore from '../store/Store';

import useUserHook from '../services/useUserHook';

const Logout: React.FC = () => {
    const { isAuth } = useUserStore();

    const { logoutUserService } = useUserHook();

    if (isAuth) logoutUserService();

    return <Navigate to="/login" />;
};

export default Logout;
