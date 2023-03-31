import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();

        navigate('/login', { replace: true });
    }, []);
    return <div>Logout...</div>;
};

export default Logout;
