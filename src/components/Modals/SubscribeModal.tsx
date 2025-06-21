'use client';
import React, { useEffect, useState } from 'react';
import styles from './Modals.module.css';
import { IoMdClose } from 'react-icons/io';
import { useUserConfigStore } from '../userConfig/store';
import Link from 'next/link';
import { SubscriberItem } from '@/types';
import moment from 'moment';
import { createSubscriber } from '@/lib/subscribers';

type SubscribeModalProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const emptySubscriberObject: SubscriberItem = {
    email: '',
    slug: 'subscriber',
    name: '',
    subscribedAt: moment.utc().toISOString(),
    status: 'subscribed'
}

const SubscribeModal = ({ setModalOpen }: SubscribeModalProps) => {
    const [newSubscriber, setNewSubscriber] = useState<SubscriberItem>(emptySubscriberObject);

    const [isSubscribeDisabled, setIsSubscribeDisabled] = useState<boolean>(true);
    const [subscribeStatus, setSubscribeStatus] = useState<boolean | null>(null); // If set to true, then succeeded, if false, then failed.

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

    const handleInputChange = (field: keyof SubscriberItem, value: string): void => {
        setNewSubscriber({ ...(newSubscriber as SubscriberItem), [field]: value }); // Update the selected tag's data
    };

    const handleSubscribeClick = async () => {
        const createdSubscriber = await createSubscriber(newSubscriber.email, newSubscriber.name);

        if (!Object.values(createdSubscriber).every(value => value !== undefined && value !== '')) {
            setSubscribeStatus(false);
        } else {
            setSubscribeStatus(true);
        }
    }

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
                    {subscribeStatus !== null && (
                        <div className={`${styles.dialogBox} ${styles.subscribeModal} ${subscribeStatus ? styles.dialogBox_green : styles.dialogBox_red} p-5`} onClick={e => {
                            e.stopPropagation();
                            setSubscribeStatus(null);
                        }}>
                            {subscribeStatus ? (
                                <div>
                                    <h3 className='heading text-center text-white'>You are all set!</h3>
                                    <p className='subheading-small text-center text-light'>You have successfully subscribed!</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className='subheading text-center text-white'>Error: Unable to subscribe</h3>
                                    <p className='text-center text-light'>Please ensure all the required fields are set</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`${styles.postDataContainer} ${styles.subscribeModal} p-5`} onClick={e => e.stopPropagation()}>
                        <button className={`${styles.expandedPostCloseBtn} btn-pill`} onClick={() => handleClose()}>
                            <IoMdClose className={styles.icon} />
                        </button>

                        <div className='my-5'>
                            <h1 className='heading-large text-center' id='col-heading-1'>Stay informed.</h1>
                            <h1 className='heading text-center' id='col-heading-1'>Subscribe to Yalovets Blog!</h1>
                        </div>

                        {/* <p className='subheading-small my-4 pt-4' id='col-heading-2'>
                            I launched Yalovets Blog in 2025.
                            Since then, I have published COUNT articles.
                            Stay notified about new posts releases and product updates. <strong>Subscribe now!</strong>
                        </p> */}

                        {/* <div className='horisontal-line mb-3'></div> */}

                        <form action="POST">
                            <div className='my-4'>
                                <input className={styles.subscribeInput} value={newSubscriber?.name || ''} onChange={e => handleInputChange('name', e.target.value)} placeholder='First Name' type="text" name='given-name' autoComplete='given-name' />
                                <input className={styles.subscribeInput} value={newSubscriber?.email || ''} onChange={e => handleInputChange('email', e.target.value)} placeholder='Email Address' type="email" />

                                <div className='d-flex'>
                                    <input className={styles.subscribeCheckbox} type="checkbox" onChange={e => setIsSubscribeDisabled(!e.target.checked)} />
                                    <p className='p-2'>Subscribe me to the newsletter featuring new content, product news, and service updates. I acknowledge that email performance is tracked through opens and clicks and agree to the <Link className='a-link a-btn' id='col-secondary' href={'/privacy-policy'}>privacy policy.</Link></p>
                                </div>
                            </div>

                            <div className='d-flex justify-content-start gap-3'>
                                <button type='button' className={`btn-filled py-3 px-4 ${isSubscribeDisabled && 'btn-disabled'}`} disabled={isSubscribeDisabled} onClick={handleSubscribeClick}>Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
};

export default SubscribeModal;
