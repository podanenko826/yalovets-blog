import React from 'react';

export const metadata = {
    title: 'Books / Yalovets Blog',
    description: 'Recomendation of books by Ivan Yalovets',
};

const BooksRecomendationPage = () => {
    return (
        <>
            <div className="container-fluid d-flex justify-content-center">
                <div className="container row pt-3 pb-5">
                    <h1 className="heading p-0" id="col-heading-2">
                        Books Recomendation
                    </h1>
                </div>
            </div>
        </>
    );
};

export default BooksRecomendationPage;
