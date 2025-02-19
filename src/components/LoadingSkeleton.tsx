import React from 'react'

const LoadingSkeleton = () => {
    return (
        <div className="container d-flex justify-content-center py-4" style={{marginBottom: '75vh'}}>
            <div className="loading-spinning"></div>
        </div>
    )
}

export default LoadingSkeleton