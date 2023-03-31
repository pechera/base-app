import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
// import secureLocalStorage from 'react-secure-storage';

interface UserState {
    username: string; // undefined
    isAuth: boolean;
    loginUser: (username: string) => void;
    logoutUser: () => void;
}

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
                storage: createJSONStorage(() => localStorage), //  secureLocalStorage
            }
        )
    )
);

export default useUserStore;
