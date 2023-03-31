import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
    devtools(
        persist(
            (set) => ({
                username: '',
                isAuth: false,
                setUsername: (data: string) =>
                    set({
                        username: data,
                    }),
                loginUser: () =>
                    set({
                        isAuth: true,
                    }),
                logoutUser: () =>
                    set({
                        username: '',
                        isAuth: false,
                    }),
            }),
            {
                name: 'storedata',
                storage: createJSONStorage(() => localStorage), //  secureLocalStorage
            }
        )
    )
);

export default useUserStore;
