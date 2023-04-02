import { useNavigate, useSearchParams } from 'react-router-dom';
import useUserStore from '../store/Store';

import { LoginResponseData } from '../types/data';

interface ILoginUser {
    (data: LoginResponseData): void;
}

interface IUserHooks {
    loginUserService: ILoginUser;
    logoutUserService: () => void;
    test: () => void;
}

interface IUserHook {
    (): IUserHooks;
}

const useUserHook: IUserHook = () => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const navigate = useNavigate();

    const { loginUser, logoutUser } = useUserStore();

    const loginUserService: ILoginUser = (data) => {
        const { accessToken, refreshToken, username } = data;

        if (!accessToken || !refreshToken) return;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        loginUser(username);

        const redirect = searchParams.get('redirect');

        redirect
            ? navigate(redirect, { replace: true })
            : navigate('/dashboard', { replace: true });
    };

    const logoutUserService = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('storedata');

        logoutUser();

        navigate('/login', { replace: true });
    };

    const test = (): void => {
        console.log('test');
    };

    return { loginUserService, logoutUserService, test };
};

export default useUserHook;
