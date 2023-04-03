import { create } from 'zustand';
import { devtools, persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import secureLocalStorage from 'react-secure-storage';

interface UserState {
    username: string;
    isAuth: boolean;
    loginUser: (username: string) => void;
    logoutUser: () => void;
}

const secureStorage: StateStorage = {
    getItem: (key) => {
        const value = secureLocalStorage.getItem(key);

        if (typeof value === 'string' || value === null) {
            return value;
        } else {
            return JSON.stringify(value);
        }
    },
    setItem: (key, value) => secureLocalStorage.setItem(key, value),
    removeItem: (key) => secureLocalStorage.removeItem(key),
};

const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set) => ({
                username: '',
                isAuth: false,
                loginUser: (username: string) => {
                    set({
                        username,
                        isAuth: true,
                    });
                },
                logoutUser: () => {
                    set({
                        username: '',
                        isAuth: false,
                    });
                },
            }),
            {
                name: 'storedata',
                storage: createJSONStorage<UserState>(() => secureStorage), //  localStorage
            }
        )
    )
);

export default useUserStore;
