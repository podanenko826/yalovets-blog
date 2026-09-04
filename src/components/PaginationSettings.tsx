'use client';
import React, { useState } from 'react';
import { MdSettings } from 'react-icons/md';
import PaginationPreferences from './Modals/PaginationPreferences';

export default function PaginationSettings({ currentPostsPerPage }: { currentPostsPerPage: number }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <button onClick={() => setModalOpen(prev => !prev)} className="btn-pill py-2 px-2">
                <MdSettings className="btn-pill-svg" />
            </button>
            {modalOpen && <PaginationPreferences postsPerPage={currentPostsPerPage} setModalOpen={setModalOpen} />}
        </>
    );
}
