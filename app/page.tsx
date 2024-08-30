import * as React from 'react';
import './page.css';

import {MdOutlineArrowForwardIos} from 'react-icons/md';

export default function Home() {
    return (
        <main>
            {/* First heading */}
            <div className="welcome">
                <div className="welcome-container">
                    <div className="container">
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
            <div className="content-div__latest-post">
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

            <div className="recent-posts">
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
                    Subscribe to stay up to date. Browse my archive of 0 posts
                </h4>
            </div>
        </main>
    );
}
