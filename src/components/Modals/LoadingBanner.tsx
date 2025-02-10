'use client';
import React, { useEffect, useState } from 'react';

import { FaCoffee } from 'react-icons/fa';

const LoadingBanner = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100); // Simulate loading time

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", background: "white", overflow: "hidden", zIndex: 10000, top: "0%", left: "0%" }}>
            <div className="container-sm pb-5 d-flex justify-content-center">
            <h4 className="col-primary" style={{ fontFamily: "'Rubik', sans-serif", fontWeight: 500, fontSize: "1.85rem", color: "var(--col-primary)" }}>
                    Yalovets Blog
                    <FaCoffee style={{ alignSelf: 'center', fontSize: '32px' }} />
                </h4>
            </div>
        </div>
    );
};

export default LoadingBanner;
