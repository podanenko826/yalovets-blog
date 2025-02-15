import { create } from "zustand";

interface UserConfigStore {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    postsPerPage: number;
    setPostsPerPage: (postsPerPage: number) => void;
}

export const useUserConfigStore = create<UserConfigStore>((set) => {
    const saveUserConfigToStorage = (userConfig: { theme: 'light' | 'dark', postsPerPage: number }) => {
        if (typeof localStorage === 'undefined') return;

        localStorage.setItem('userConfig', JSON.stringify(userConfig));
    }

    const theme = 'light';

    const setTheme = (theme: 'light' | 'dark') => {
        set({ theme });
        saveUserConfigToStorage({ theme, postsPerPage: postsPerPage || 14 });
    };

    const postsPerPage = 14;

    const setPostsPerPage = (postsPerPage: number) => {
        set({ postsPerPage });
        saveUserConfigToStorage({ theme: theme || 'light', postsPerPage });
    };

    const loadUserConfigFromStorage = () => {
        if (typeof localStorage === 'undefined') return;

        const savedUserConfig = localStorage.getItem('userConfig');

        if (savedUserConfig) {
            const { theme, postsPerPage } = JSON.parse(savedUserConfig);
            set({ theme, postsPerPage });
        }
    };

    loadUserConfigFromStorage();

    return {
        theme,
        setTheme,
        postsPerPage,
        setPostsPerPage,
    }

});
