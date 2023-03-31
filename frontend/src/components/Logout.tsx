import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserStore from '../store/Store';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const { logoutUser } = useUserStore();

    useEffect(() => {
        logoutUser();
        localStorage.clear();

        navigate('/login', { replace: true });
    }, []);
    return <div>Logout...</div>;
};

export default Logout;
