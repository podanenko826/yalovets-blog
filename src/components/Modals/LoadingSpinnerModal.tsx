import React from 'react';

type LoadingSpinnerModalProps = {
    message?: string;
};

const LoadingSpinnerModal = ({ message }: LoadingSpinnerModalProps) => {
    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", background: "rgba(255, 255, 255, 0.6)", backdropFilter: "var(--default-backdrop)", overflow: "hidden", zIndex: 10000, top: "0%", left: "0%" }}>
            <div className="container-sm pb-5 d-flex flex-column align-items-center">
                <div className='loading-spinning'></div>
                {message && (
                    <p className='subheading m-4'>{message}</p>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinnerModal;
