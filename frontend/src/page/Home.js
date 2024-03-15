import React from 'react';


const Home = ({ userInfo, handleLogout }) => {
    return (
        <div className='mt-5 text-center' >
                <h1>Dashboard
                <button className="btn btn-danger mb-1 ml-3" onClick={handleLogout}>
                Logout
                </button>
                </h1>

            </div>
    );
};

export default Home;
