'use client';
import React from 'react';

const StartReadingButton = () => {
    const handleStartReadingClick = () => {
        document.getElementById('latest-post')!.scrollIntoView({
            behavior: 'smooth',
        });
    };

    return (
        <button className="btn-filled" onClick={handleStartReadingClick}>
            Start Reading
        </button>
    );
};

export default StartReadingButton;
