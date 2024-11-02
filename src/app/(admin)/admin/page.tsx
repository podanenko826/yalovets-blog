import React from 'react';

const AdminPage = () => {
    return (
        <div>
            <p className="m-4">AdminPage</p>
            <a href="/admin/edit">
                <button className="p-2 m-4">New post</button>
            </a>
        </div>
    );
};

export default AdminPage;
