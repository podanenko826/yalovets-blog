import { create } from "zustand";

interface UserConfigStore {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    postsPerPage: number;
    setPostsPerPage: (postsPerPage: number) => void;
    loadUserConfigFromStorage: () => Promise<{ theme: 'light' | 'dark', postsPerPage: number }>
}

export const useUserConfigStore = create<UserConfigStore>((set, get) => {
    const saveUserConfigToStorage = (userConfig: { theme: 'light' | 'dark', postsPerPage: number }) => {
        if (typeof localStorage === 'undefined') return;

        console.log('revieved object for save: ', userConfig);
        

        localStorage.setItem('userConfig', JSON.stringify(userConfig));
    }

    const theme = 'light';

    const setTheme = (theme: 'light' | 'dark') => {
        set({ theme });
        saveUserConfigToStorage({ theme, postsPerPage: get().postsPerPage || 14 });
    };

    const postsPerPage = 14;

    const setPostsPerPage = (postsPerPage: number) => {
        console.log(`setting ${postsPerPage} to postsPerPage`);
        
        set({ postsPerPage });
        saveUserConfigToStorage({ theme: get().theme || 'light', postsPerPage });
    };

    const loadUserConfigFromStorage = async (): Promise<{ theme: 'light' | 'dark', postsPerPage: number }> => {
        if (typeof localStorage === 'undefined') return { theme: 'light', postsPerPage: 14 };

        const savedUserConfig = localStorage.getItem('userConfig');

        console.log('got from cache useConfig:', savedUserConfig);
        

        if (savedUserConfig) {
            const { theme, postsPerPage } = JSON.parse(savedUserConfig);
            
            set({ theme, postsPerPage });

            return { theme, postsPerPage };
        }

        return { theme: 'light', postsPerPage: 14 };
    };

    return {
        theme,
        setTheme,
        postsPerPage,
        setPostsPerPage,
        loadUserConfigFromStorage
    }

});
