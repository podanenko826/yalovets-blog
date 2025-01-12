'use client';
import { createAuthor, getAuthors, updateAuthor } from '@/lib/authors';
import { AuthorItem } from '@/types';
import { Modal } from 'bootstrap';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { IoMdRefresh } from 'react-icons/io';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaLinkedin, FaRedditAlien, FaInstagram, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const AuthorsPage = () => {
    const [authorData, setAuthorData] = useState<AuthorItem[]>([]);
    const [refreshAuthors, setRefreshAuthors] = useState<boolean>(true);

    const [selectedAuthor, setSelectedAuthor] = useState<AuthorItem | null>(null);
    const [newAuthor, setNewAuthor] = useState<AuthorItem | null>(null);

    const [currentModal, setCurrentModal] = useState<bootstrap.Modal | null>(null);
    const modalRef = useRef<Modal | null>(null);

    useEffect(() => {
        const getAuthorData = async () => {
            if (refreshAuthors) {
                setAuthorData([]);

                const authors = await getAuthors();
                if (authors.length > 0) setAuthorData(authors);

                setRefreshAuthors(false);
            }
        };

        getAuthorData();
    }, [refreshAuthors]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Modal = require('bootstrap/js/dist/modal');
        const modalTrigger = document.querySelector('.modal');

        if (authorData.length === 0) return;

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
    }, [authorData]);

    const handleCreateClick = (): void => {
        setNewAuthor(null);
    };

    const handleEditClick = (author: AuthorItem): void => {
        setSelectedAuthor(author);
    };

    const handleDisableClick = (author: AuthorItem): void => {
        setSelectedAuthor(author);
    };

    const handleCreate = (): void => {
        if (newAuthor) {
            createAuthor(newAuthor);

            window.location.reload();
        }
    };

    const handleCreateInputChange = (field: keyof AuthorItem, value: string): void => {
        setNewAuthor({ ...(newAuthor as AuthorItem), [field]: value }); // Update the selected tag's data
    };

    const handleCreateSocialChange = (field: keyof AuthorItem['socialLinks'], value: string): void => {
        setNewAuthor(prevAuthor => {
            if (!prevAuthor) return null;

            return {
                ...prevAuthor,
                socialLinks: {
                    ...prevAuthor.socialLinks,
                    [field]: value || '',
                },
            };
        });
    };

    const handleEdit = (): void => {
        if (selectedAuthor) {
            updateAuthor(selectedAuthor);

            window.location.reload();
        }
    };

    const handleEditInputChange = (field: keyof AuthorItem, value: string): void => {
        if (selectedAuthor) {
            setSelectedAuthor({ ...selectedAuthor, [field]: value }); // Update the selected tag's data
        }
    };

    const handleEditSocialChange = (field: keyof AuthorItem['socialLinks'], value: string): void => {
        setSelectedAuthor(prevAuthor => {
            if (!prevAuthor) return null;

            return {
                ...prevAuthor,
                socialLinks: {
                    ...prevAuthor.socialLinks,
                    [field]: value || '',
                },
            };
        });
    };

    return (
        <>
            <div>
                <div className="container-lg posts" id="posts">
                    <div className="d-flex gap-4">
                        <Link href={'/admin'}>
                            <button className="btn-filled px-3 py-3 mt-4">←Back to console</button>
                        </Link>
                        <button className="btn-outlined px-3 py-2 mt-4" onClick={() => setRefreshAuthors(true)}>
                            <IoMdRefresh /> Refresh
                        </button>
                    </div>
                    <div className="container">
                        <div className="row post-list col-12 overflow-scroll">
                            <button className="btn-outlined px-3 py-3 my-4" type="button" data-bs-toggle="modal" data-bs-target="#createModal" onClick={() => handleCreateClick()}>
                                Create a new author
                            </button>

                            {authorData.length > 0 ? (
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            {/* <th scope="col">id</th> */}
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Biography</th>
                                            <th scope="col">Author Key</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {authorData.map(author => (
                                            <tr key={author.email}>
                                                <td>{author.fullName}</td>
                                                <td>{author.email}</td>
                                                <td>{author.bio}</td>
                                                <td>{author.authorKey}</td>
                                                <div className="d-flex gap-4">
                                                    <button
                                                        type="button"
                                                        className="py-2 px-5 btn-filled btn-filled my-3"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editModal"
                                                        onClick={() => handleEditClick(author)} // Pass the author to the modal
                                                    >
                                                        Edit
                                                    </button>
                                                    {/* <button type="button" className="py-2 btn-danger btn-filled my-3" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => handleDeleteClick(author)}>
                                                        Disable
                                                    </button> */}
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
                                    Create Author
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="col-form-label">
                                            <strong>Email:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={newAuthor?.email || ''} onChange={e => handleCreateInputChange('email', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="col-form-label">
                                            <strong>Full Name:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={newAuthor?.fullName || ''} onChange={e => handleCreateInputChange('fullName', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="bio" className="col-form-label">
                                            <strong>Biography:</strong>
                                        </label>
                                        <textarea className="form-control" value={newAuthor?.bio || ''} onChange={e => handleCreateInputChange('bio', e.target.value)}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="profileImageUrl" className="col-form-label">
                                            <strong>Profile Image URL:</strong>
                                        </label>
                                        <textarea className="form-control" value={newAuthor?.profileImageUrl || ''} onChange={e => handleCreateInputChange('profileImageUrl', e.target.value)}></textarea>
                                    </div>
                                    <p className="pt-3">
                                        <strong>Social Links:</strong>
                                    </p>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <MdEmail className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Email address for contact (optional)" value={newAuthor?.socialLinks?.emailAddress || ''} onChange={e => handleCreateSocialChange('emailAddress', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaGithub className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your GitHub profile URL (optional)" value={newAuthor?.socialLinks?.githubUrl || ''} onChange={e => handleCreateSocialChange('githubUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaInstagram className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Instagram profile URL (optional)" value={newAuthor?.socialLinks?.instagramUrl || ''} onChange={e => handleCreateSocialChange('instagramUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaLinkedin className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your LinkedIn profile URL (optional)" value={newAuthor?.socialLinks?.linkedInUrl || ''} onChange={e => handleCreateSocialChange('linkedInUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaXTwitter className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your X profile URL (optional)" value={newAuthor?.socialLinks?.xUrl || ''} onChange={e => handleCreateSocialChange('xUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaFacebookF className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Facebook profile URL (optional)" value={newAuthor?.socialLinks?.facebookUrl || ''} onChange={e => handleCreateSocialChange('facebookUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaRedditAlien className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Reddit profile URL (optional)" value={newAuthor?.socialLinks?.redditUrl || ''} onChange={e => handleCreateSocialChange('redditUrl', e.target.value)}></input>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleCreate}>
                                    Create author
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
                                    Edit Author
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="col-form-label">
                                            <strong>Email:</strong>
                                        </label>
                                        <input type="text" className="form-control" disabled value={selectedAuthor?.email || ''} onChange={e => handleEditInputChange('email', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="col-form-label">
                                            <strong>Full Name:</strong>
                                        </label>
                                        <input type="text" className="form-control" value={selectedAuthor?.fullName || ''} onChange={e => handleEditInputChange('fullName', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="bio" className="col-form-label">
                                            <strong>Biography:</strong>
                                        </label>
                                        <textarea className="form-control" value={selectedAuthor?.bio || ''} onChange={e => handleEditInputChange('bio', e.target.value)}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="profileImageUrl" className="col-form-label">
                                            <strong>Profile Image URL:</strong>
                                        </label>
                                        <textarea className="form-control" value={selectedAuthor?.profileImageUrl || ''} onChange={e => handleEditInputChange('profileImageUrl', e.target.value)}></textarea>
                                    </div>
                                    <p className="pt-3">
                                        <strong>Social Links:</strong>
                                    </p>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <MdEmail className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Email address for contact (optional)" value={selectedAuthor?.socialLinks?.emailAddress || ''} onChange={e => handleEditSocialChange('emailAddress', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaGithub className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your GitHub profile URL (optional)" value={selectedAuthor?.socialLinks?.githubUrl || ''} onChange={e => handleEditSocialChange('githubUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaInstagram className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Instagram profile URL (optional)" value={selectedAuthor?.socialLinks?.instagramUrl || ''} onChange={e => handleEditSocialChange('instagramUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaLinkedin className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your LinkedIn profile URL (optional)" value={selectedAuthor?.socialLinks?.linkedInUrl || ''} onChange={e => handleEditSocialChange('linkedInUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaXTwitter className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your X profile URL (optional)" value={selectedAuthor?.socialLinks?.xUrl || ''} onChange={e => handleEditSocialChange('xUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaFacebookF className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Facebook profile URL (optional)" value={selectedAuthor?.socialLinks?.facebookUrl || ''} onChange={e => handleEditSocialChange('facebookUrl', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaRedditAlien className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Reddit profile URL (optional)" value={selectedAuthor?.socialLinks?.redditUrl || ''} onChange={e => handleEditSocialChange('redditUrl', e.target.value)}></input>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleEdit}>
                                    Edit author
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deletion modal */}

                {/* <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteModalLabel">
                                    Disable Author
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        Are you <strong>ACTUALLY</strong> sure you want to disable an author with this name: <br />
                                        <h5 className="py-4 heading">{selectedAuthor?.fullName}</h5>
                                    </div>

                                    <div className="alert alert-danger" role="alert">
                                        <strong>WARNING: Disabling the Author will hide all posts created by it making them unaccessible for readers to read.</strong>
                                    </div>

                                    <div className="alert alert-warning" role="alert">
                                        An Author can be re-enabled afterwards and posts created by it will be visible again.
                                    </div>

                                    <p className="subheading-smaller pt-3">
                                        Write down the Full Name of this Author to proceed with disabling <strong>({selectedAuthor?.fullName})</strong>:
                                    </p>
                                    <input type="text" name="" id="" />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-danger py-2 px-3">
                                    Disable author
                                </button>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default AuthorsPage;
