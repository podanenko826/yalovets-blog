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
            <div className="welcome container-fluid d-none d-lg-block">
                <div className="row">
                    <div className="col-lg-7 offset-lg-5">
                        <picture className="img-fluid">
                            <source
                                type="image/webp"
                                srcSet="/img/teaser-front@1140w.webp 1140w, /img/teaser-front@1140w2x.webp 2280w, /img/teaser-front@960w.webp 960w, /img/teaser-front@960w2x.webp 1920w"
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <source
                                srcSet="/img/teaser-front@1140w.jpg 1140w, /img/teaser-front@1140w2x.jpg 2280w, /img/teaser-front@960w.jpg 960w, /img/teaser-front@960w2x.jpg 1920w"
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <img
                                className="img-fluid"
                                src="/img/teaser-front.jpg"
                                alt="Cloudonaut Teaser"
                                title="Cloudonaut Teaser"
                            />
                        </picture>
                    </div>
                </div>
                <div>
                    <div className="container">
                        <div className="row">
                            <div className="col-5">
                                <h2 className="welcome-text" id="col-heading-2">
                                    Welcome to Yalovets Blog
                                </h2>
                                <h1
                                    className="welcome-heading heading"
                                    id="col-heading-1">
                                    AWS Unveiled: Your Gateway to Cloud
                                    Knowledge
                                </h1>
                                <p className="welcome-paragraph">
                                    By Ivan Yalovets. Since 2024, I published 0
                                    articles.
                                </p>
                                <button className="btn-filled">
                                    Start Reading
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="latest-post" id="latest-post">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <a href="#">
                                <source
                                    type="image/png"
                                    srcSet="/img/placeholder.png 1140w, /img/placeholder.png 2280w, /img/placeholder.png 960w, /img/placeholder.png 1920w"
                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                />
                                <source
                                    srcSet="/img/placeholder.png 1140w, /img/placeholder.png 2280w, /img/placeholder.png 960w, /img/placeholder.png 1920w"
                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                />
                                <img
                                    className="img-fluid"
                                    src="/img/placeholder.png"
                                    alt="Recent post teaser"
                                    title="Recent Post"
                                />
                            </a>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            <h2 id="col-heading-1">Latest post: An Example</h2>
                            <p>
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Corporis recusandae commodi
                                distinctio eos reprehenderit tempore
                                consequuntur quam quia. Nam quae, quidem facere
                                nemo adipisci odio ratione tenetur non ipsa
                                corrupti.
                            </p>
                            <button className="btn-filled">Read on</button>
                        </div>
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
