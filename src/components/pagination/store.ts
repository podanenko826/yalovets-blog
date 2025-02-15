import { getPaginationData } from "@/lib/pagination";
import { PaginationState } from "@/types";
import { create } from "zustand";

interface PaginationStore {
    pagination: PaginationState;
    setPagination: (pagination: PaginationState) => void;
    originalPagination: PaginationState | null;
    setOriginalPagination: (pagination: PaginationState | null) => void;
    postCount: number;
    setPostCount: (count: number) => void;
    fetchPagination: () => Promise<PaginationState>;
}

export const usePaginationStore = create<PaginationStore>((set) => {
    const pagination: PaginationState = { 
        totalPages: 0,
        paginationData: {},
    };
    const originalPagination: PaginationState | null = null;

    const PAGINATION_STORAGE_KEY = "cachedPagination";
    const PAGINATION_EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2 hours

    const savePaginationToLocalStorage = (newPagination: PaginationState) => {
        if (typeof localStorage === 'undefined') return;

        const data = {
            pagination: newPagination,
            timestamp: Date.now(),
        };
        localStorage.setItem(PAGINATION_STORAGE_KEY, JSON.stringify(data));
    };

    const loadPaginationFromStorage = (): PaginationState | null => {
        if (typeof localStorage === 'undefined') return null;

        const data = localStorage.getItem(PAGINATION_STORAGE_KEY);
        if (!data) return null;

        const { pagination, timestamp } = JSON.parse(data);

        // Check expiration
        if (Date.now() - timestamp > PAGINATION_EXPIRATION_TIME) {
            localStorage.removeItem(PAGINATION_STORAGE_KEY);
            return null;
        }

        return pagination;
    };

    loadPaginationFromStorage();

    const setPagination = (pagination: PaginationState) => {
        set({ pagination });
        savePaginationToLocalStorage(pagination);
    };

    const setOriginalPagination = (pagination: PaginationState | null) => {
        set({ originalPagination: pagination });
    };

    const postCount = 0;

    const setPostCount = (count: number) => {
        set({ postCount: count });
    };

    const fetchPagination = async (): Promise<PaginationState> => {
        if (!originalPagination) {
            const cachedPagination = loadPaginationFromStorage();
            
            if (cachedPagination) {
                setOriginalPagination(cachedPagination);
                return cachedPagination;
            }

            const paginationData = await getPaginationData();
            const totalPages = Object.keys(paginationData).length;

            setOriginalPagination({
                totalPages,
                paginationData,
            });
            setPagination({
                totalPages,
                paginationData,
            });
            savePaginationToLocalStorage({
                totalPages,
                paginationData,
            });

            return {
                totalPages,
                paginationData,
            };
        }
        return {
            totalPages: 0,
            paginationData: {},
        };
    };

    return {
        pagination,
        setPagination,
        originalPagination,
        setOriginalPagination,
        postCount,
        setPostCount,
        fetchPagination,
    }

});
