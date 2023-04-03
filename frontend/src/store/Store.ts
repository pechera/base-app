import { create } from 'zustand';
import { devtools, persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import secureLocalStorage from 'react-secure-storage';

interface UserState {
    username: string;
    isAuth: boolean;
    loginUser: (username: string) => void;
    logoutUser: () => void;
}

interface IStorage extends StateStorage {
    getItem: (key: string) => string | Promise<string | null> | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
}

// Need string | Promise<string | null> | null
// Now string | number | boolean | object | null

const secureStorage: IStorage = {
    getItem: (key) => {
        const value = secureLocalStorage.getItem(key);

        let result: string | null = null; // Promise<string | null> |

        if (typeof value === 'string' || value === null) {
            result = value;
        } else if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'object') {
            result = JSON.stringify(value);
        } else {
            throw new Error('Unsupported data type');
        }

        return result;
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
