'use client';
import React, { useEffect, useState } from 'react';
import styles from './Modals.module.css';
import { usePostContext } from '../Context/PostDataContext';
import { IoMdClose } from 'react-icons/io';
import { useUserConfigStore } from '../userConfig/store';

type PaginationPreferencesProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaginationPreferences = ({ setModalOpen }: PaginationPreferencesProps) => {
    const { postsPerPage, setPostsPerPage } = useUserConfigStore();

    const handlePostsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostsPerPage(parseInt(e.target.value));
    }

    const handlePostsPerPageSave = () => {
        setPostsPerPage(postsPerPage);

        handleClose();
    }

    const handleClose = () => {
        if (!window) return;

        const isMobile = window.innerWidth <= 768;

        const card = document.querySelector(`.${styles.postDataContainer}`) as HTMLElement | null;
        const modal = document.querySelector(`.${styles.previewModal}`) as HTMLElement | null;

        if (card) {
            document.body.classList.remove('overflow-hidden'); // Only remove when appropriate
        }

        if (card && modal) {
            setTimeout(() => {
                if (!isMobile) card.style.padding = '1rem';
            }, 0);
            setTimeout(() => {
                card.style.opacity = '5%';
            }, 50);

            modal.classList.add(`${styles.previewModalClose}`);
            
            const onTransitionEnd = (e: TransitionEvent) => {
                if (['padding', 'opacity'].includes(e.propertyName)) {
                    setModalOpen(false);
                    
                    card.removeEventListener('transitionend', onTransitionEnd);
                }
            };
            
            card.addEventListener('transitionend', onTransitionEnd);
            
            return () => {
                if (card) {
                    card.removeEventListener('transitionend', onTransitionEnd);
                }
            };
        }
    };

    useEffect(() => {
        if (!window) return;

        const isMobile = window.innerWidth <= 768;

        const card = document.querySelector(`.${styles.postDataContainer}`) as HTMLElement | null;
        const modal = document.querySelector(`.${styles.previewModal}`) as HTMLElement | null;

        if (card && modal) {
            document.body.classList.add('overflow-hidden');

            if (!isMobile) card.style.padding = '';

            modal.classList.remove(`${styles.previewModalClose}`);

            setTimeout(() => {
                if (!isMobile) {
                    card.style.padding = '0 1.2rem';
                    card.style.paddingTop = '1.1rem';
                    card.style.paddingBottom = '1.3rem';
                }
            }, 0);
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, []);
    
    
    return (
        <div className={`${styles.articlePage} ${styles.previewModal}`} onClick={() => handleClose()}>

                <div className="container">
                    <div className={`${styles.postDataContainer} ${styles.paginationPreferences}`} onClick={e => e.stopPropagation()}>

                        <button className={`${styles.expandedPostCloseBtn} btn-pill`} onClick={() => handleClose()}>
                            <IoMdClose className={styles.icon} />
                        </button>

                        <h3 className='subheading mt-2' id='col-heading-1'>Preferences</h3>
                        <h5 className='subheading-small'><strong>Page size</strong></h5>

                        <ul className="list-group list-group-dark my-4">
                            {[14, 28, 42].map((value) => (
                                <li key={value} className="list-group-item py-2 py-lg-1">
                                    <input
                                        className="form-check-input me-2"
                                        type="radio"
                                        name="listGroupRadio"
                                        value={value}
                                        id={`${value}posts`}
                                        checked={postsPerPage === value}
                                        onChange={handlePostsPerPageChange}
                                    />
                                    <label className="form-check-label" htmlFor={`${value}posts`}>
                                        {value === 42 ? (value + 3)
                                            : value === 28 ? (value + 2)
                                            : (value + 1)} posts
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <div className='horisontal-line mb-3'></div>

                        <div className='d-flex justify-content-end gap-3'>
                            <button className='btn-outlined py-1' onClick={() => handleClose()}>Close</button>
                            <button className='btn-filled py-1 px-4' onClick={() => handlePostsPerPageSave()}>Comfirm</button>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default PaginationPreferences;
