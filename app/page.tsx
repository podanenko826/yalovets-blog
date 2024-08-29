import * as React from 'react';
import './page.css';

export default function Home() {
    return (
        <main>
            {/* First heading */}
            <div className="content-div">
                <h2 className="subheading" id="col-heading-2">
                    Welcome to Yalovets Blog
                </h2>
                <h1 className="heading" id="col-heading-1">
                    Your launchpad for <br />
                    Amazon Web <br />
                    Services (AWS)
                </h1>
                <p>By Ivan Yalovets. Since 2024, I published 0 articles.</p>
                <button className="btn-filled">Start Reading</button>
            </div>

            {/* Latest post */}
            <div className="content-div__latest-post">
                <div className="latest-post__box">
                    <div className="latest-post__image-box">
                        <img
                            className="latest-post__image"
                            src="/img/placeholder.png"
                            alt="Latest post"
                        />
                    </div>
                    <div className="latest-post__text-box">
                        <h2 id="col-heading-2">Latest post: An Example</h2>
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

            <div className="content-div__recent-posts">
                <h3 className="subheading" id="col-primary">
                    Recent posts
                </h3>
                <h4 className="subheading-tiny" id="col-heading-1">
                    Subscribe to stay up to date. Browse our archive of 0 posts
                </h4>
            </div>
        </main>
    );
}
