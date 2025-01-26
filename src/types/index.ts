export type AuthorItem = {
    email: string;
    slug: string;
    fullName: string;
    authorKey: string;
    profileImageUrl: string;
    bio: string;
    socialLinks: {
        emailAddress: string;
        githubUrl: string;
        instagramUrl: string;
        linkedInUrl: string;
        xUrl: string;
        facebookUrl: string;
        redditUrl: string;
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
    postType?: string;
    tags?: string[];
    readTime?: number;
    viewsCount?: number;
    postGroup: string;
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
};

export type TagItem = {
    id: number;
    tag: string;
    title: string;
    description: string;
    postCount: number;
};
