import React from 'react';

export const metadata = {
    title: 'Podcasts / AWS By Denis',
    description: 'Listen to podcasts on AWS By Denis',
};

const PodcastsPage = () => {
    return (
        <>
            <div className="container-fluid d-flex justify-content-center">
                <div className="container row pt-3 pb-5">
                    <h1 className="heading p-0" id="col-heading-2">
                        Podcasts
                    </h1>
                </div>
            </div>
        </>
    );
};

export default PodcastsPage;
