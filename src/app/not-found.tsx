import React, { Suspense, lazy } from 'react';
import { Metadata } from "next";
import Link from 'next/link';

// const NavBar = lazy(() => import('@/components/NavBar'));
// const Footer = lazy(() => import('@/components/Footer'));

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "404 Not Found / Yalovets Blog",
    description: "The page you are looking for does not exist.",
};

const PageNotFound = () => {
    return (
        <html>
            <body>    
                {/* <NavBar /> */}
                <div className="container-fluid align-content-center py-5">
                    <div className="mb-5 container justify-content-between my-5">
                        <h1 className="heading-xlarge pb-4" id="col-primary">
                            404 Not Found
                        </h1>
                        <h2 className="" id="col-heading-1">
                            Uh-oh! Looks like someone spilled coffee all over
                            the code. ☕️💻
                        </h2>
                        <h3 className="mt-5 subheading-smaller" id="col-heading-2">
                            The page you&rsquo;re looking for might be in the
                            &quot;other&quot; database, left in staging, or
                            maybe it&rsquo;s just chilling in the cloud ☁️
                            somewhere. Either way, it&rsquo;s not here.
                        </h3>
                        <h4 className="subheading-small" id="col-heading-2">
                            Remember, behind every 404 is a developer crying
                            into their coffee.
                        </h4>

                        <Link href={'/'}>
                            <button className='btn-filled mt-5 px-5'>Go to Home</button>
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default PageNotFound;
