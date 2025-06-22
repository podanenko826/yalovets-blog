'use client';
import styles from '@/components/Modals/Modals.module.css';

import React, { lazy, useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriberItem } from '@/types';
import { getSubscriberByEmail, getSubscribers, updateSubscriberStatus } from '@/lib/subscribers';

const UnsubscribePage = () => {
    const [unsubscribeStatus, setUnubscribeStatus] = useState<boolean>(false); // If set to true, then succeeded, if false, then failed.
    const [subscriberData, setSubscriberData] = useState<SubscriberItem | null>(null);

    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const router = useRouter();

    useEffect(() => {
        const getSubscriberData = async () => {
            if (subscriberData === null && email) {
                const subscriber = await getSubscriberByEmail(email);
    
                if (subscriber) {
                    setSubscriberData(subscriber);
                }
            }
        }

        getSubscriberData();
    }, [setSubscriberData])

    const handleClose = () => {
        if (!window) return;

        router.push('/');
    };

    const handleUnsubscribeClick = async () => {
        if (subscriberData && Object.values(subscriberData).every(value => value !== undefined && value !== '')) {
            const updatedSubscriber = await updateSubscriberStatus(subscriberData, 'unsubscribed');

            if (Object.values(updatedSubscriber).every(value => value !== undefined && value !== '')) {
                setUnubscribeStatus(true);
            }
        }
    }

    const handleResubscribeClick = async () => {
        if (subscriberData && Object.values(subscriberData).every(value => value !== undefined && value !== '')) {
            const updatedSubscriber = await updateSubscriberStatus(subscriberData, 'subscribed');

            if (Object.values(updatedSubscriber).every(value => value !== undefined && value !== '')) {
                setUnubscribeStatus(false);
            }
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

    if (subscriberData === null) return;
    
  return (
    <>
        <div className={`${styles.articlePage} ${styles.previewModal}`}>

            <div className="container">
                {unsubscribeStatus && (
                    <div className={`${styles.dialogBox} ${styles.subscribeModal} ${unsubscribeStatus ? styles.dialogBox_green : styles.dialogBox_red} p-5`}>
                        <div>
                            <h3 className='heading text-white'>Success!</h3>
                            <p className='subheading-small text-light'>You have successfully unsubscribed!</p>

                            <button className={`btn-outlined btn-full mt-3 ${!unsubscribeStatus ? 'btn-disabled' : ''}`} onClick={handleResubscribeClick}>Resubscribe</button>
                        </div>
                    </div>
                )}

                {!unsubscribeStatus && (
                    <div className={`${styles.postDataContainer} ${styles.unsubscribeBox} ${styles.subscribeModal} p-5`}>
                        <button className={`${styles.expandedPostCloseBtn} btn-pill`} onClick={() => handleClose()}>
                            <IoMdClose className={styles.icon} />
                        </button>

                        <div className='my-5'>
                            <h1 className='heading' id='col-heading-1'>{subscriberData?.name},</h1>
                            <p className='subheading-smaller' id='col-heading-1'>By clicking Unsubscribe, you’ll no longer receive emails regarding post annoucements and product updates.</p>

                            <button className={`btn-filled btn-full mt-3 ${unsubscribeStatus ? 'btn-disabled' : ''}`} onClick={handleUnsubscribeClick}>Unsubscribe</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
  )
}

export default UnsubscribePage