export type AuthorItem = {
    email: string;
    slug: string;
    fullName: string;
    authorKey: string;
    profileImageUrl: string;
    bio: string;
    isGuest: boolean;
    socialLinks: {
        Email: string;
        GitHub: string;
        Instagram: string;
        LinkedIn: string;
        X: string;
        Facebook: string;
        Reddit: string;
    };
};

export type PostItem = {
    email: string;
    slug: string;
    title: string;
    description: string;
    postGroup: string;
    imageUrl?: string;
    date?: string;
    modifyDate?: string;
    postType?: string;
    readTime?: number;
    viewsCount?: number;
    sponsoredBy?: string;
    sponsorUrl?: string;
};

export type PostPreviewItem = {
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    modifyDate: string;
    postType: string;
    readTime: number;
    authorData: AuthorItem;
    isSponsored: boolean;
};

export type PaginationEntry = {
    date: string
};

export type PaginationState = {
    totalPages: number;
    paginationData: Record<number, PaginationEntry>;
};