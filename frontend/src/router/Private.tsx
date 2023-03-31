import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type PrivateProps = {
    children: React.ReactNode;
};

const Private: React.FC<PrivateProps> = ({ children }) => {
    const location = useLocation();

    // if (!isAuth) {
    //     return <Navigate to={`/login?redirect=${location.pathname}`} />;
    // }

    return <>{children}</>;
};

export default Private;
