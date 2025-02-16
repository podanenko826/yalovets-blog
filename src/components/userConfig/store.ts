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
        
        localStorage.setItem('userConfig', JSON.stringify(userConfig));
    }

    const theme = typeof window !== "undefined" 
        ? JSON.parse(localStorage.getItem("userConfig") || `{"theme": "light"}`).theme 
        : "light";

    const setTheme = (theme: 'light' | 'dark') => {
        set({ theme });
        saveUserConfigToStorage({ theme, postsPerPage: get().postsPerPage || 14 });

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const postsPerPage = 14;

    const setPostsPerPage = (postsPerPage: number) => {
        set({ postsPerPage });
        saveUserConfigToStorage({ theme: get().theme || 'light', postsPerPage });
    };

    const loadUserConfigFromStorage = async (): Promise<{ theme: 'light' | 'dark', postsPerPage: number }> => {
        if (typeof localStorage === 'undefined') return { theme: 'light', postsPerPage: 14 };

        const savedUserConfig = localStorage.getItem('userConfig');

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
