export type AuthorItem = {
    email: string;
    slug: string;
    fullName: string;
    profileImageUrl: string;
    bio: string;
    socialLinks: {
        emailAddress: string;
        linkedInUrl: string;
        instagramUrl: string;
        facebookUrl: string;
    };
};

export type PostItem = {
    email: string;
    slug: string;
    title: string;
    description: string;
    imageUrl?: string;
    date?: string;
    modifyDate?: string;
    readTime?: number;
    viewsCount?: number;
};

export type PostPreviewItem = {
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    modifyDate: string;
    readTime: number;
    authorData: AuthorItem;
};
