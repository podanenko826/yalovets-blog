'use client';
import { deleteSubscriber, emptySubscriberObject, getSubscribers, updateSubscriber } from '@/lib/subscribers';
import { SubscriberItem, TagItem } from '@/types';
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
import { createTag, deleteTag, getTags, updateTag } from '@/lib/tags';

const emptyTagObject: TagItem = {
    id: '',
    created_at: '',
    tag: '',
    title: '',
    description: '',
};

const TagsPage = () => {
    const [tagData, setTagData] = useState<TagItem[]>([]);
    const [refreshTags, setRefreshTags] = useState<boolean>(true);

    const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);
    const [newTag, setNewTag] = useState<TagItem>(emptyTagObject);

    const [currentModal, setCurrentModal] = useState<bootstrap.Modal | null>(null);
    const modalRef = useRef<Modal | null>(null);

    useEffect(() => {
        const getTagData = async () => {
            if (refreshTags) {
                setTagData([]);

                const tags = await getTags();
                if (tags.length > 0) setTagData(tags);

                setRefreshTags(false);
            }
        };

        getTagData();
    }, [refreshTags]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Modal = require('bootstrap/js/dist/modal');
        const modalTrigger = document.querySelector('.modal');

        if (tagData.length === 0) return;

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
    }, [tagData, currentModal]);

    const handleCreateClick = (): void => {
        setNewTag(emptyTagObject);
    };

    const handleCreate = (): void => {
        if (newTag) {
            createTag(newTag);

            window.location.reload();
        }
    };

    const handleCreateInputChange = (field: keyof TagItem, value: string | boolean): void => {
        setNewTag({ ...(newTag as TagItem), [field]: value });
    };

    const handleEditClick = (tag: TagItem): void => {
        setSelectedTag(tag);
    };

    const handleEdit = (): void => {
        if (selectedTag) {
            updateTag(selectedTag);

            window.location.reload();
        }
    };

    const handleEditInputChange = (field: keyof TagItem, value: string | boolean): void => {
        if (selectedTag) {
            setSelectedTag({ ...selectedTag, [field]: value }); // Update the selected tag's data
        }
    };

    const handleDeleteClick = (tag: TagItem): void => {
        setSelectedTag(tag);
    };

    const handleDelete = async (): Promise<void> => {
        if (selectedTag) {
            await deleteTag(selectedTag);

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
                        <button className="btn-outlined px-3 py-2 mt-4" onClick={() => setRefreshTags(true)}>
                            <IoMdRefresh /> Refresh
                        </button>
                    </div>
                    <div className="container">
                        <div className="row post-list col-12 overflow-scroll">
                            <button className="btn-outlined px-3 py-3 my-4" type="button" data-bs-toggle="modal" data-bs-target="#createTagModal" onClick={() => handleCreateClick()}>
                                Create a new Tag
                            </button>

                            {tagData.length > 0 ? (
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col">id</th>
                                            <th scope="col">created_at</th>
                                            <th scope="col">tag</th>
                                            <th scope="col">title</th>
                                            <th scope="col">description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tagData.map(tag => (
                                            <tr key={tag.tag}>
                                                <td>{tag.id}</td>
                                                <td>{tag.created_at}</td>
                                                <td>{tag.tag}</td>
                                                <td>{tag.title}</td>
                                                <td>{tag.description}</td>
                                                <td className="d-flex w-100 gap-4">
                                                    <button
                                                        type="button"
                                                        className="py-2 px-5 btn-filled my-3"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editModal"
                                                        onClick={() => handleEditClick(tag)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button type="button" className="py-2 btn-danger btn-filled my-3" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => handleDeleteClick(tag)}>
                                                        Delete
                                                    </button>
                                                </td>
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

                {/* Creation modal */}

                <div className="modal fade" id="createTagModal" tabIndex={-1} aria-labelledby="createTagModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="createTagModalLabel">
                                    Create Tag
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="tag" className="col-form-label">
                                            <strong>Tag (slug):</strong>
                                        </label>
                                        <input type="text" className="form-control" value={newTag?.tag || ''} onChange={e => handleCreateInputChange('tag', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="col-form-label">
                                            <strong>Title:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={newTag?.title || ''} onChange={e => handleCreateInputChange('title', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="col-form-label">
                                            <strong>Description:</strong>
                                        </label>
                                        <textarea className="form-control" value={newTag?.description || ''} onChange={e => handleCreateInputChange('description', e.target.value)}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleCreate}>
                                    Create tag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editing modal */}

                <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editModalLabel">
                                    Edit Tag
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="col-form-label">
                                            <strong>ID</strong>
                                        </label>
                                        <input type="text" className="form-control" disabled value={selectedTag?.id || ''} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="col-form-label">
                                            <strong>Tag:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={selectedTag?.tag || ''} onChange={e => handleEditInputChange('tag', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="subscribed_at" className="col-form-label">
                                            <strong>Title:</strong>
                                        </label>
                                        <textarea className="form-control" value={selectedTag?.title || ''} onChange={e => handleEditInputChange('title', e.target.value)}></textarea>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="is_active" className="col-form-label">
                                            <strong>Description:</strong>
                                        </label>
                                        <textarea className="form-control" value={selectedTag?.description || ''} onChange={e => handleEditInputChange('description', e.target.value)}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleEdit}>
                                    Edit Tag
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
                                    Delete Tag
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        Are you sure you want to delete a tag with this name: <br />
                                        <h5 className="py-4 heading">{selectedTag?.tag}</h5>
                                    </div>

                                    <div className="alert alert-danger" role="alert">
                                        The data about this tag will be removed forever.
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-danger py-2 px-3" onClick={handleDelete}>
                                    Delete Tag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TagsPage;
