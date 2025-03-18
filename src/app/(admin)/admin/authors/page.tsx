'use client';
import { createAuthor, emptyAuthorObject, getAuthors, updateAuthor } from '@/lib/authors';
import { AuthorItem } from '@/types';
import { Modal } from 'bootstrap';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { IoMdRefresh } from 'react-icons/io';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaLinkedin, FaRedditAlien, FaInstagram, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { uploadProfilePicture } from '@/lib/images';

const AuthorsPage = () => {
    const [authorData, setAuthorData] = useState<AuthorItem[]>([]);
    const [refreshAuthors, setRefreshAuthors] = useState<boolean>(true);

    const [selectedAuthor, setSelectedAuthor] = useState<AuthorItem | null>(null);
    const [newAuthor, setNewAuthor] = useState<AuthorItem>(emptyAuthorObject);

    const [currentModal, setCurrentModal] = useState<bootstrap.Modal | null>(null);
    const modalRef = useRef<Modal | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null); // Store the image preview
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for the file input

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
        setNewAuthor(emptyAuthorObject);
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

    const handleCreateInputChange = (field: keyof AuthorItem, value: string | boolean): void => {
        setNewAuthor({ ...(newAuthor as AuthorItem), [field]: value }); // Update the selected tag's data
    };

    const handleCreateSocialChange = (field: keyof AuthorItem['socialLinks'], value: string): void => {
        setNewAuthor(prevAuthor => {
            if (!prevAuthor) return emptyAuthorObject;

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

    const handleEditInputChange = (field: keyof AuthorItem, value: string | boolean): void => {
        if (selectedAuthor) {
            setSelectedAuthor({ ...selectedAuthor, [field]: value }); // Update the selected tag's data
        }
    };

    const handleEditSocialChange = (field: keyof AuthorItem['socialLinks'], value: string): void => {
        setSelectedAuthor(prevAuthor => {
            if (!prevAuthor) return null;

            console.log(field, value);
            

            return {
                ...prevAuthor,
                socialLinks: {
                    ...prevAuthor.socialLinks,
                    [field]: value || '',
                },
            };
        });
    };

    // Handle file selection
    const handleCreatePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Get the first selected file
        if (file) {
            const newName = file.name.replace(/\s+/g, '');
            // Create a new File object with the modified name
            const newFile = new File([file], newName, { type: file.type, lastModified: file.lastModified });

            const { filePath } = await uploadProfilePicture(newFile);

            handleCreateInputChange('profileImageUrl', filePath);

            const reader = new FileReader(); // Create a new FileReader

            // Once the file is loaded, set the image preview
            reader.onloadend = () => {
                if (reader.result) {
                    setImagePreview(reader.result as string); // Store the image data URL in state
                }
            };

            reader.readAsDataURL(file); // Read the file as a data URL (image)
        }
    };

    const handleEditPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Get the first selected file
        if (file) {
            const newName = file.name.replace(/\s+/g, '');
            // Create a new File object with the modified name
            const newFile = new File([file], newName, { type: file.type, lastModified: file.lastModified });

            const { filePath } = await uploadProfilePicture(newFile);

            handleEditInputChange('profileImageUrl', filePath);

            const reader = new FileReader(); // Create a new FileReader

            // Once the file is loaded, set the image preview
            reader.onloadend = () => {
                if (reader.result) {
                    setImagePreview(reader.result as string); // Store the image data URL in state
                }
            };

            reader.readAsDataURL(file); // Read the file as a data URL (image)
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
                                            <th scope="col">Is Guest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {authorData.map(author => (
                                            <tr key={author.email}>
                                                <td>{author.fullName}</td>
                                                <td>{author.email}</td>
                                                <td>{author.bio}</td>
                                                <td>{author.authorKey}</td>
                                                <td>{String(author.isGuest)}</td>
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
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCreatePictureChange}
                                            ref={fileInputRef} // Assigning ref to file input
                                        />
                                        <Image
                                            className="admin-image"
                                            src={imagePreview || selectedAuthor?.profileImageUrl || '/ui/placeholder-pfp.png'} // Using the image URL, including the placeholder logic if needed
                                            alt={'Profile Picture Preview'}
                                            title={'Profile Picture Preview'}
                                            loading="lazy"
                                            style={{width: '100px'}}
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="isGuest" className="col-form-label">
                                            <strong>Is a guest author?</strong>
                                        </label>
                                        <input type="checkbox" className='mx-3' checked={newAuthor?.isGuest || false} onChange={e => handleCreateInputChange('isGuest', e.target.checked)} />
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
                                        <input className="form-control" placeholder="Enter your Email address for contact (optional)" value={newAuthor?.socialLinks?.Email || ''} onChange={e => handleCreateSocialChange('Email', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaGithub className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your GitHub profile URL (optional)" value={newAuthor?.socialLinks?.GitHub || ''} onChange={e => handleCreateSocialChange('GitHub', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaInstagram className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Instagram profile URL (optional)" value={newAuthor?.socialLinks?.Instagram || ''} onChange={e => handleCreateSocialChange('Instagram', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaLinkedin className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your LinkedIn profile URL (optional)" value={newAuthor?.socialLinks?.LinkedIn || ''} onChange={e => handleCreateSocialChange('LinkedIn', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaXTwitter className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your X profile URL (optional)" value={newAuthor?.socialLinks?.X || ''} onChange={e => handleCreateSocialChange('X', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaFacebookF className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Facebook profile URL (optional)" value={newAuthor?.socialLinks?.Facebook || ''} onChange={e => handleCreateSocialChange('Facebook', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaRedditAlien className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Reddit profile URL (optional)" value={newAuthor?.socialLinks?.Reddit || ''} onChange={e => handleCreateSocialChange('Reddit', e.target.value)}></input>
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
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditPictureChange}
                                            ref={fileInputRef} // Assigning ref to file input
                                        />
                                        <Image
                                            className="admin-image"
                                            src={imagePreview || selectedAuthor?.profileImageUrl || '/ui/placeholder-pfp.png'} // Using the image URL, including the placeholder logic if needed
                                            alt={'Profile Picture Preview'}
                                            title={'Profile Picture Preview'}
                                            loading="lazy"
                                            style={{width: '100px'}}
                                            width={100}
                                            height={100}
                                        />
                                        {/* <textarea className="form-control" value={selectedAuthor?.profileImageUrl || ''} onChange={e => handleEditInputChange('profileImageUrl', e.target.value)}></textarea> */}
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="isGuest" className="col-form-label">
                                            <strong>Is a guest author?</strong>
                                        </label>
                                        <input type="checkbox" className='mx-3' checked={selectedAuthor?.isGuest || false} onChange={e => handleEditInputChange('isGuest', e.target.checked)} />
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
                                        <input className="form-control" placeholder="Enter your Email address for contact (optional)" value={selectedAuthor?.socialLinks?.Email || ''} onChange={e => handleEditSocialChange('Email', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaGithub className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your GitHub profile URL (optional)" value={selectedAuthor?.socialLinks?.GitHub || ''} onChange={e => handleEditSocialChange('GitHub', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaInstagram className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Instagram profile URL (optional)" value={selectedAuthor?.socialLinks?.Instagram || ''} onChange={e => handleEditSocialChange('Instagram', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaLinkedin className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your LinkedIn profile URL (optional)" value={selectedAuthor?.socialLinks?.LinkedIn || ''} onChange={e => handleEditSocialChange('LinkedIn', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaXTwitter className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your X profile URL (optional)" value={selectedAuthor?.socialLinks?.X || ''} onChange={e => handleEditSocialChange('X', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaFacebookF className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Facebook profile URL (optional)" value={selectedAuthor?.socialLinks?.Facebook || ''} onChange={e => handleEditSocialChange('Facebook', e.target.value)}></input>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <label htmlFor="socialLinks" className="col-form-label mx-2">
                                            <strong>
                                                <FaRedditAlien className="subheading" />
                                            </strong>
                                        </label>
                                        <input className="form-control" placeholder="Enter your Reddit profile URL (optional)" value={selectedAuthor?.socialLinks?.Reddit || ''} onChange={e => handleEditSocialChange('Reddit', e.target.value)}></input>
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
