import React from 'react';

import PostCard from '@/components/PostCard';
import {getSortedPosts} from '@/lib/posts';
import {getUsers} from '@/lib/users';
import {AuthorItem, PostItem} from '@/types';

const AdminPage = async () => {
    const postData: PostItem[] = await getSortedPosts();

    const authorData: AuthorItem[] = await getUsers();

    return (
        <div>
            <a href="/admin/new">
                <button className="p-2 m-4">New post</button>
            </a>
            <div className="container-fluid posts" id="posts">
                <div className="row post-list">
                    {postData.map((post, index) => (
                        <div className="col-md-3">
                            <PostCard
                                post={post}
                                authorData={
                                    authorData.find(
                                        author => author.email === post.email
                                    ) as AuthorItem
                                }
                                style="admin"
                                index={index}
                                key={post.email}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
