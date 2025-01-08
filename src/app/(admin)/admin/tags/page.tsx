'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import bootstrap from 'bootstrap';
import fs from 'fs';
import path from 'path';
import { TagItem } from '@/types';
import { createTag, deleteTag, editTag, getTagsData } from '@/lib/tags';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { IoMdRefresh } from 'react-icons/io';

const CategoriesPage = () => {
    const [tagsData, setTagsData] = useState<TagItem[]>([]);
    const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);
    const [newTag, setNewTag] = useState<TagItem | null>(null);

    const router = useRouter();

    const [currentModal, setCurrentModal] = useState<bootstrap.Modal | null>(null);
    const modalRef = useRef<Modal | null>(null);

    const [refreshTags, setRefreshTags] = useState<boolean>(true);

    useEffect(() => {
        const getTags = async () => {
            if (refreshTags) {
                //? Clear old tagsData value
                if (tagsData) {
                    setTagsData([]);
                }

                const _tagsData = await getTagsData();

                if (_tagsData.length > 0) {
                    setTagsData(_tagsData);
                }

                setRefreshTags(false);
            }
        };

        getTags();
    }, [refreshTags]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Modal = require('bootstrap/js/dist/modal');
        const modalTrigger = document.querySelector('.modal');

        if (tagsData.length === 0) return;

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
    }, [tagsData]);

    useEffect(() => {
        console.log('working');

        if (selectedTag === null) return modalRef.current?.dispose();
    }, [selectedTag]);

    const handleCreateClick = (): void => {
        setNewTag(null);
    };

    const handleCreateInputChange = (field: keyof TagItem, value: string): void => {
        setNewTag({ ...(newTag as TagItem), [field]: value }); // Update the selected tag's data
    };

    const handleEditClick = (tag: TagItem): void => {
        setSelectedTag(tag); // Set the selected tag when the "Edit" button is clicked
    };

    const handleEditInputChange = (field: keyof TagItem, value: string): void => {
        if (selectedTag) {
            setSelectedTag({ ...selectedTag, [field]: value }); // Update the selected tag's data
        }
    };

    const handleDeleteClick = (tag: TagItem): void => {
        setSelectedTag(tag); // Set the selected tag when the "Edit" button is clicked
    };

    const handleCreate = (): void => {
        if (newTag) {
            // Example of updating the local state
            createTag(newTag);

            window.location.reload();
        }
    };

    const handleSaveChanges = (): void => {
        if (selectedTag) {
            editTag(selectedTag);

            window.location.reload();
        }
    };

    const handleDelete = (): void => {
        if (selectedTag) {
            deleteTag(selectedTag.id);

            window.location.reload();
        }
    };

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
                            <button className="btn-outlined px-3 py-3 my-4" type="button" data-bs-toggle="modal" data-bs-target="#createModal" onClick={() => handleCreateClick()}>
                                Create a new tag
                            </button>

                            {tagsData.length > 0 ? (
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            {/* <th scope="col">id</th> */}
                                            <th scope="col">tag</th>
                                            <th scope="col">title</th>
                                            <th scope="col">description</th>
                                            <th scope="col">pageCount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tagsData.map(tag => (
                                            <tr key={tag.id}>
                                                {/* <td>{tag.id}</td> */}
                                                <td>{tag.tag}</td>
                                                <td>{tag.title}</td>
                                                <td>{tag.description}</td>
                                                <td>{tag.postCount}</td>
                                                <div className="d-flex gap-4">
                                                    <button
                                                        type="button"
                                                        className="py-2 btn-filled py-1 px-5 btn-filled my-3"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editModal"
                                                        onClick={() => handleEditClick(tag)} // Pass the tag to the modal
                                                    >
                                                        Edit
                                                    </button>
                                                    <button type="button" className="py-2 btn-danger py-1 px-2 btn-filled my-3" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => handleDeleteClick(tag)}>
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

                {/* Creation modal */}

                <div className="modal fade" id="createModal" tabIndex={-1} aria-labelledby="createModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="createModalLabel">
                                    Create Tag
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="tag" className="col-form-label">
                                            <strong>Tag Slug</strong> (The identifier a tag can be searched through): <br />
                                        </label>
                                        <div className="alert alert-warning w-100 subheading-xsmall" role="alert">
                                            Convention: Not long, only special character allowed is
                                            <strong>" - "</strong>
                                        </div>
                                        <input type="text" className="form-control" value={newTag?.tag} onChange={e => handleCreateInputChange('tag', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="col-form-label">
                                            <strong>Tag Title</strong> (Full name of the tag, can be anything):
                                        </label>
                                        <input type="text" className="form-control" value={newTag?.title} onChange={e => handleCreateInputChange('title', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="col-form-label">
                                            <strong>Description:</strong>
                                        </label>
                                        <textarea className="form-control" value={newTag?.description} onChange={e => handleCreateInputChange('description', e.target.value)}></textarea>
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
                                        <label htmlFor="tag" className="col-form-label">
                                            <strong>Tag Slug:</strong>
                                        </label>
                                        <div className="alert alert-warning w-100 subheading-xsmall" role="alert">
                                            Convention: Not long, only special character allowed is
                                            <strong>" - "</strong>
                                        </div>
                                        <input type="text" className="form-control" value={selectedTag?.tag} onChange={e => handleEditInputChange('tag', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="col-form-label">
                                            <strong>Tag Title:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={selectedTag?.title} onChange={e => handleEditInputChange('title', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="col-form-label">
                                            <strong>Description:</strong>
                                        </label>
                                        <textarea className="form-control" value={selectedTag?.description} onChange={e => handleEditInputChange('description', e.target.value)}></textarea>
                                    </div>
                                    <div className="alert alert-danger w-100" role="alert">
                                        Caution: Changing the Tag Slug will recursively update all posts where the old value was present.
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                                    Edit tag
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
                                        <h5 className="py-2 subheading">{selectedTag?.tag}</h5>
                                    </div>

                                    <div className="alert alert-danger w-100" role="alert">
                                        Warning: Deleting the Tag will recursively update all posts where this tag was present.
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                    Delete tag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;
