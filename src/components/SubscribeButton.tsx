'use client';
import React from 'react';
import { useUserConfigStore } from './userConfig/store';

export default function SubscribeButton() {
    const setSubscribeModalOpen = useUserConfigStore(state => state.setSubscribeModalOpen);

    return (
        <button className="btn-outlined py-2 px-4" onClick={() => setSubscribeModalOpen(true)}>
            Subscribe
        </button>
    );
}
