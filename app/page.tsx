import * as React from 'react';
import './page.css';

import {MdOutlineArrowForwardIos} from 'react-icons/md';

export default function Home() {
    let recentPosts = Array(9).fill({
        imageSrc: '/img/placeholder.png',
        altText: 'An image',
        heading: 'Recent post: An Example',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                      Ea aperiam consequuntur perferendis, recusandae similique rerum 
                      rem et, commodi modi numquam eaque repellat quasi facere 
                      illo earum quam tempore iure nam eveniet totam ad maxime nisi, 
                      itaque cumque? At, iusto alias!`,
        link: '#',
    });

    const popularPosts = Array(3).fill({
        imageSrc: '/img/placeholder.png',
        altText: 'An image',
        heading: 'Popular post: An Example',
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                      Ea aperiam consequuntur perferendis, recusandae similique rerum 
                      rem et, commodi modi numquam eaque repellat quasi facere 
                      illo earum quam tempore iure nam eveniet totam ad maxime nisi, 
                      itaque cumque? At, iusto alias!`,
        link: '#',
    });

    return (
        <main>
            {/* First heading */}
            <div className="welcome">
                <div className="welcome-container">
                    <div className="container-fluid">
                        <h2 className="welcome-text" id="col-heading-2">
                            Welcome to Yalovets Blog
                        </h2>
                        <h1
                            className="welcome-heading heading"
                            id="col-heading-1">
                            Your launchpad for Amazon Web Services (AWS)
                        </h1>
                        <p className="welcome-paragraph">
                            By Ivan Yalovets. Since 2024, I published 0
                            articles.
                        </p>
                        <button className="btn-filled">Start Reading</button>
                    </div>
                </div>
            </div>

            {/* Latest post */}
            <div className="latest-post-box">
                <div className="latest-post">
                    <div className="latest-post__image-box">
                        <img
                            className="latest-post-image"
                            src="/img/placeholder.png"
                            alt="Latest post"
                        />
                    </div>
                    <div className="latest-post__text-box">
                        <h2 id="col-heading-1">Latest post: An Example</h2>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Corporis recusandae commodi distinctio eos
                            reprehenderit tempore consequuntur quam quia. Nam
                            quae, quidem facere nemo adipisci odio ratione
                            tenetur non ipsa corrupti.
                        </p>
                        <button className="btn-filled">Read on</button>
                    </div>
                </div>
            </div>

            {/* Recent posts */}

            <div className="post-box">
                <div>
                    <a
                        id="col-primary"
                        className="recent-posts-link"
                        href="/page/1">
                        <h3>
                            Recent posts{' '}
                            <MdOutlineArrowForwardIos className="recent-posts-icon" />
                        </h3>
                    </a>
                    <h4 className="subheading-tiny" id="col-heading-1">
                        Subscribe to stay up to date. Browse my archive of 0
                        posts
                    </h4>
                </div>

                <div className="post-container">
                    {recentPosts.map((post, index) => (
                        <div className="post-card" key={index}>
                            <img
                                className="post-card-image"
                                src={post.imageSrc}
                                alt={post.altText}
                            />
                            <h2 id="col-heading-1">{post.heading}</h2>
                            <p>{post.description}</p>
                            <a className="post-card-link" href={post.link}>
                                Read on
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <div className="post-box">
                <div>
                    <a
                        id="col-primary"
                        className="recent-posts-link"
                        href="/page/1">
                        <h3>
                            Most Popular Posts{' '}
                            <MdOutlineArrowForwardIos className="recent-posts-icon" />
                        </h3>
                    </a>
                    <h4 className="subheading-tiny" id="col-heading-1">
                        Subscribe to stay up to date. Browse my archive of 0
                        posts
                    </h4>
                </div>

                <div className="post-container">
                    {popularPosts.map((post, index) => (
                        <div className="post-card" key={index}>
                            <img
                                className="post-card-image"
                                src={post.imageSrc}
                                alt={post.altText}
                            />
                            <h2 id="col-heading-1">{post.heading}</h2>
                            <p>{post.description}</p>
                            <a className="post-card-link" href={post.link}>
                                Read on
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
