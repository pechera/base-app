import React from 'react';
import { Navigate } from 'react-router-dom';

import useUserStore from '../store/Store';

const Logout: React.FC = () => {
    const { isAuth, logoutUser } = useUserStore();

    if (isAuth) {
        logoutUser();
        localStorage.clear();
    }

    return <Navigate to="/login" />;
};

export default Logout;
