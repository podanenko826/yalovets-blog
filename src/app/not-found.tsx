import React from 'react';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PageNotFound = () => {
    return (
        <html>
            <body>
                <NavBar />
                <div className="container-fluid align-content-center py-5">
                    <div className="mb-5 container justify-content-between my-5">
                        <h1 className="heading-xlarge pb-4" id="col-primary">
                            404 Not Found
                        </h1>
                        <h2 className="" id="col-heading-1">
                            Uh-oh! Looks like someone spilled coffee all over
                            the code. ☕️💻
                        </h2>
                        <h4 className="mt-5 subheading-tiny" id="col-heading-2">
                            The page you&rsquo;re looking for might be in the
                            &quot;other&quot; database, left in staging, or
                            maybe it&rsquo;s just chilling in the cloud ☁️
                            somewhere. Either way, it&rsquo;s not here.
                        </h4>
                        <h5 className="subheading-tiny" id="col-heading-2">
                            Remember, behind every 404 is a developer crying
                            into their coffee.
                        </h5>
                    </div>
                </div>
                <Footer />
            </body>
        </html>
    );
};

export default PageNotFound;
