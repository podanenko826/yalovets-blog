export type AuthorItem = {
    id: string; // uuid
    handle: string; // url friendly handle
    full_name: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    role: 'admin' | 'author' | 'guest';
    social_links: {
        email?: string;
        github?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        reddit?: string;
    };
};

export type PostItem = {
    id: string;
    author_id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    image_url?: string;
    created_at: string;
    updated_at?: string;
    post_type?: string;
    read_time?: number;
    views_count: number;
    sponsored_by?: string;
    sponsor_url?: string;
};

export type PostPreviewItem = {
    id: string;
    slug: string;
    title: string;
    description: string;
    image_url?: string;
    created_at: string;
    updated_at?: string;
    post_type?: string;
    read_time?: number;
    authorData: AuthorItem;
    isSponsored: boolean;
};

export type BookItem = {
    id: string;
    author_id: string;
    title: string;
    description: string;
    image_url?: string;
    purchase_links?: Record<string, string>;
    created_at: string;
};

export type SubscriberItem = {
    id: string;
    email: string;
    name?: string;
    subscribed_at: string;
    is_active: boolean;
    is_article_updates_on?: boolean;
    is_product_updates_on?: boolean;
    is_service_updates_on?: boolean;
};

export type PaginationEntry = {
    date: string;
};

export type PaginationState = {
    totalPages: number;
    paginationData: Record<number, PaginationEntry>;
};