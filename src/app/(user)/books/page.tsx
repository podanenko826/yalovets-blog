
import BookCard from '@/components/PostCard/BookCard';
import React, { lazy } from 'react';

export const metadata = {
    title: 'Books / Yalovets Blog',
    description: 'Recomendation of books by Ivan Yalovets',
};

const NavBar = lazy(() => import('@/components/NavBar'));
const Footer = lazy(() => import('@/components/Footer'));

const BooksRecomendationPage = () => {
    return (
        <>
            <NavBar />
            <div className="container-fluid d-flex justify-content-center">
                <div className="container row pt-3 pb-5">
                    <h1 className="heading p-0" id="col-heading-2">
                        Books Recomendation
                    </h1>
                    <div className='row post-list p-0'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => (
                            <BookCard key={id} />
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default BooksRecomendationPage;
