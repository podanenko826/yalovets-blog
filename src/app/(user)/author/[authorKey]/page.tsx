import {getAuthorByKey} from '@/lib/authors';
import {AuthorItem} from '@/types';
import {notFound} from 'next/navigation';
import React, {FC} from 'react';

interface AuthorPageProps {
    params: {authorKey: string};
    // mdxSource: MDXRemoteProps | MDXRemoteSerializeResult | null;
}

const AuthorPage: FC<AuthorPageProps> = async ({params}: AuthorPageProps) => {
    const {authorKey} = params;

    const authorData = await getAuthorByKey(authorKey);

    if (!authorData.email) return notFound();
    console.log(authorData);

    return (
        <div>
            <h1>{authorData.fullName}</h1>
            <h2>{authorData.bio}</h2>
        </div>
    );
};

export default AuthorPage;
