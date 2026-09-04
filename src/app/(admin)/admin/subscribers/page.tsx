'use client';
import { deleteSubscriber, emptySubscriberObject, getSubscribers, updateSubscriber } from '@/lib/subscribers';
import { SubscriberItem } from '@/types';
import { Modal } from 'bootstrap';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { IoMdRefresh } from 'react-icons/io';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaLinkedin, FaRedditAlien, FaInstagram, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { uploadProfilePicture } from '@/lib/images';
import { subscribe } from 'diagnostics_channel';

const SubscribersPage = () => {
    const [subscriberData, setSubscriberData] = useState<SubscriberItem[]>([]);
    const [refreshSubscribers, setRefreshSubscribers] = useState<boolean>(true);

    const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberItem | null>(null);
    const [newSubscriber, setNewSubscriber] = useState<SubscriberItem>(emptySubscriberObject);

    const [currentModal, setCurrentModal] = useState<bootstrap.Modal | null>(null);
    const modalRef = useRef<Modal | null>(null);

    useEffect(() => {
        const getSubscriberData = async () => {
            if (refreshSubscribers) {
                setSubscriberData([]);

                const subscribers = await getSubscribers();
                if (subscribers.length > 0) setSubscriberData(subscribers);

                setRefreshSubscribers(false);
            }
        };

        getSubscriberData();
    }, [refreshSubscribers]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Modal = require('bootstrap/js/dist/modal');
        const modalTrigger = document.querySelector('.modal');

        if (subscriberData.length === 0) return;

        if (modalTrigger && !currentModal) {
            const newModal = new Modal(modalTrigger);
            modalRef.current = newModal;
            setCurrentModal(newModal);
        }

        return () => {
            if (modalRef.current) {
                modalRef.current.dispose();
                modalRef.current = null;
            }
        };
    }, [subscriberData, currentModal]);

    const handleEditClick = (subscriber: SubscriberItem): void => {
        setSelectedSubscriber(subscriber);
    };

    const handleEdit = (): void => {
        if (selectedSubscriber) {
            updateSubscriber(selectedSubscriber);

            window.location.reload();
        }
    };

    const handleEditInputChange = (field: keyof SubscriberItem, value: string | boolean): void => {
        if (selectedSubscriber) {
            setSelectedSubscriber({ ...selectedSubscriber, [field]: value }); // Update the selected tag's data
        }
    };

    const handleDeleteClick = (subscriber: SubscriberItem): void => {
        setSelectedSubscriber(subscriber);
    };

    const handleDelete = async (): Promise<void> => {
        if (selectedSubscriber) {
            await deleteSubscriber(selectedSubscriber.email);

            window.location.reload();
        }
    }

    return (
        <>
            <div>
                <div className="container-lg posts" id="posts">
                    <div className="d-flex gap-4">
                        <Link href={'/admin'}>
                            <button className="btn-filled px-3 py-3 mt-4">←Back to console</button>
                        </Link>
                        <button className="btn-outlined px-3 py-2 mt-4" onClick={() => setRefreshSubscribers(true)}>
                            <IoMdRefresh /> Refresh
                        </button>
                    </div>
                    <div className="container">
                        <div className="row post-list col-12 overflow-scroll">
                            {subscriberData.length > 0 ? (
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            {/* <th scope="col">id</th> */}
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Subscribed at</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Articles</th>
                                            <th scope="col">Products</th>
                                            <th scope="col">Services</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriberData.map(subscriber => (
                                            <tr key={subscriber.email}>
                                                <td>{subscriber.name}</td>
                                                <td>{subscriber.email}</td>
                                                <td>{subscriber.subscribed_at}</td>
                                                <td>{subscriber.is_active ? 'Active' : 'Inactive'}</td>
                                                <td>{subscriber.is_article_updates_on ? 'Yes' : 'No'}</td>
                                                <td>{subscriber.is_product_updates_on ? 'Yes' : 'No'}</td>
                                                <td>{subscriber.is_service_updates_on ? 'Yes' : 'No'}</td>
                                                <div className="d-flex gap-4">
                                                    <button
                                                        type="button"
                                                        className="py-2 px-5 btn-filled btn-filled my-3"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editModal"
                                                        onClick={() => handleEditClick(subscriber)} // Pass the author to the modal
                                                    >
                                                        Edit
                                                    </button>
                                                    <button type="button" className="py-2 btn-danger btn-filled my-3" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => handleDeleteClick(subscriber)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="container d-flex justify-content-center py-5">
                                    <div className="loading-spinning"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editing modal */}

                <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editModalLabel">
                                    Edit Subscriber
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="col-form-label">
                                            <strong>Email:</strong>
                                        </label>
                                        <input type="text" className="form-control" disabled value={selectedSubscriber?.email || ''} onChange={e => handleEditInputChange('email', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="col-form-label">
                                            <strong>Name:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={selectedSubscriber?.name || ''} onChange={e => handleEditInputChange('name', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="subscribed_at" className="col-form-label">
                                            <strong>Subscribed at:</strong>
                                        </label>
                                        <textarea className="form-control" value={selectedSubscriber?.subscribed_at || ''} onChange={e => handleEditInputChange('subscribed_at', e.target.value)}></textarea>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="is_active" className="col-form-label">
                                            <strong>Is Subscribed?</strong>
                                        </label>
                                        <input type="checkbox" className='mx-3' checked={selectedSubscriber?.is_active || false} onChange={e => handleEditInputChange('is_active', e.target.checked)} />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="is_article_updates_on" className="col-form-label">
                                            <strong>Article Updates?</strong>
                                        </label>
                                        <input type="checkbox" className='mx-3' checked={selectedSubscriber?.is_article_updates_on || false} onChange={e => handleEditInputChange('is_article_updates_on', e.target.checked)} />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="is_product_updates_on" className="col-form-label">
                                            <strong>Product Updates?</strong>
                                        </label>
                                        <input type="checkbox" className='mx-3' checked={selectedSubscriber?.is_product_updates_on || false} onChange={e => handleEditInputChange('is_product_updates_on', e.target.checked)} />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="is_service_updates_on" className="col-form-label">
                                            <strong>Service Updates?</strong>
                                        </label>
                                        <input type="checkbox" className='mx-3' checked={selectedSubscriber?.is_service_updates_on || false} onChange={e => handleEditInputChange('is_service_updates_on', e.target.checked)} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleEdit}>
                                    Edit Subscriber
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deletion modal */}

                <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteModalLabel">
                                    Delete Subscriber
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        Are you sure you want to delete a subscriber with this email: <br />
                                        <h5 className="py-4 heading">{selectedSubscriber?.email}</h5>
                                    </div>

                                    <div className="alert alert-danger" role="alert">
                                        The data about this subscriber will be removed forever and they will stop receiving emails.
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-danger py-2 px-3" onClick={handleDelete}>
                                    Delete Subscriber
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubscribersPage;
