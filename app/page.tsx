import * as React from 'react';

export default function Home() {
    return (
        <main>
            {/* First heading */}
            <div className="content-div">
                <h2 className="subheading">Welcome to Yalovets Blog</h2>
                <h1 className="heading">
                    Your launchpad for <br />
                    Amazon Web <br />
                    Services (AWS)
                </h1>
                <p>By Ivan Yalovets. Since 2024, I published 0 articles.</p>
                <button className="btn-filled">Start Reading</button>
            </div>

            {/* Latest post */}
            <div className="content-div__latest-post">
                <div className="latest-post__image-box">
                    <img
                        className="latest-post__image"
                        src="/img/placeholder.png"
                        alt="Latest post"
                    />
                </div>
                <div className="latest-post">
                    <h2>Latest post: An Example</h2>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Corporis recusandae commodi distinctio eos
                        reprehenderit tempore consequuntur quam quia. Nam quae,
                        quidem facere nemo adipisci odio ratione tenetur non
                        ipsa corrupti.
                    </p>
                    <button className="btn-filled">Read on</button>
                </div>
            </div>
        </main>
    );
}
