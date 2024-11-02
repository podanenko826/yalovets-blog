import Link from 'next/link';
import {getArticleData} from '@/lib/articles';

import {MdEmail} from 'react-icons/md';
import {FaLinkedin} from 'react-icons/fa';
import {FaSquareInstagram} from 'react-icons/fa6';
import {FaFacebookF} from 'react-icons/fa';
import {notFound} from 'next/navigation';

const PostPage = async ({params}: {params: {slug: string}}) => {
    const articleData = await getArticleData(params.slug);

    if (!articleData.contentHtml) {
        return notFound();
    }

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
                            <article
                                dangerouslySetInnerHTML={{
                                    __html: articleData?.contentHtml,
                                }}
                                className="article"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostPage;
