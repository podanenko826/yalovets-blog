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

            {/* Second heading */}
            <div className="content-div content-div__review"></div>
        </main>
    );
}
