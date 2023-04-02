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
    const { loginUser, logoutUser } = useUserStore();

    const loginUserService: ILoginUser = (data) => {
        const { accessToken, refreshToken, username } = data;

        if (!accessToken || !refreshToken) return;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        loginUser(username);
    };

    const logoutUserService = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('storedata');

        logoutUser();
    };

    const test = (): void => {
        console.log('test');
    };

    return { loginUserService, logoutUserService, test };
};

export default useUserHook;
