'use client';

import dynamic from 'next/dynamic';
import {MdEmail} from 'react-icons/md';
import {FaLinkedin, FaFacebookF} from 'react-icons/fa';
import {FaSquareInstagram} from 'react-icons/fa6';
import {notFound, useParams} from 'next/navigation';
import {FC} from 'react';

const PostPage: FC = () => {
    const params = useParams();

    // Cast the parameters to the expected type
    const slug = params?.slug as string;
    console.log('SLUG: ', params?.slug);

    const MDXComponent = dynamic(() => import(`./post1.mdx`), {
        // Set `ssr: false` to ensure this only runs on the client side if needed.
        ssr: false, // `dynamic` can be client-side only if the content is highly interactive
    });

    // return notFound();

    return (
        <section>
            <div className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 offset-sm-2 text-center">
                            <h1
                                className="heading-xlarge w-100 col-md-11 col-lg-12 text-center"
                                id="col-heading-1">
                                {/* {articleData.title} */}
                                How to master AWS: Advanced Topics
                            </h1>
                            <p>
                                {/* {articleData.authorName} •{' '}
                                {articleData.date.toString()} */}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-2 social-links">
                            <a href="#">
                                <MdEmail className="fs-1 p-1" />
                            </a>
                            <a href="#">
                                <FaLinkedin className="fs-1 p-1" />
                            </a>
                            <a href="https://www.instagram.com/yalovetsvanya?igsh=MWNrbWtwa2oyODE1eQ==">
                                <FaSquareInstagram className="fs-1 p-1" />
                            </a>
                            <a href="https://www.facebook.com/yalovechik">
                                <FaFacebookF className="fs-1 p-1" />
                            </a>
                        </div>
                        <div className="col-12 col-sm-8">
                            <MDXComponent
                            // className="article"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostPage;
