import { create } from "zustand";

interface UserConfigStore {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    postsPerPage: number;
    setPostsPerPage: (postsPerPage: number) => void;
    isSubscribeModalOpen: boolean;
    setSubscribeModalOpen: (isOpen: boolean) => void;
    loadUserConfigFromStorage: () => Promise<{ theme: 'light' | 'dark', postsPerPage: number }>
}

export const useUserConfigStore = create<UserConfigStore>((set, get) => {
    const saveUserConfigToStorage = (userConfig: { theme: 'light' | 'dark', postsPerPage: number }) => {
        if (typeof localStorage === 'undefined') return;
        
        localStorage.setItem('userConfig', JSON.stringify(userConfig));
    }

    let initialTheme: 'light' | 'dark' = 'light';
    if (typeof window !== "undefined") {
        try {
            const stored = localStorage.getItem("userConfig");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.theme === 'dark' || parsed.theme === 'light') {
                    initialTheme = parsed.theme;
                }
            }
        } catch (e) {
            console.error("Failed to parse userConfig from localStorage:", e);
        }
    }
    const theme = initialTheme;

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
            try {
                const { theme, postsPerPage } = JSON.parse(savedUserConfig);
                set({ theme, postsPerPage });
                return { theme, postsPerPage };
            } catch (e) {
                console.error("Failed to parse userConfig from localStorage:", e);
            }
        }

        return { theme: 'light', postsPerPage: 14 };
    };

    return {
        theme,
        setTheme,
        postsPerPage,
        setPostsPerPage,
        isSubscribeModalOpen: false,
        setSubscribeModalOpen: (isOpen: boolean) => set({ isSubscribeModalOpen: isOpen }),
        loadUserConfigFromStorage
    }

});
