/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Footer from '../../components/Footer/Footer'

const History = ({ userInfo, handleLogout ,children}) => {
    return (
        <div className="container-fluid">
        <div className="row ">
            {/* Navbar */}
            <nav className="navbar container-fluid navbar-expand-lg navbar-light bg-none shadow-none p-none"> 
                <h1>History</h1>
            </nav>
            {/* Main content */}
            <main
                role="main"
                className="col-md-9 ml-sm-auto mr-auto col-lg-9 px-md-4 bg-white  content-wrapper"
            >
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap bg-white align-items-center pt-3 pb-2 mb-3 ">
                    <div className="container  ">
                        <main className="p-3 p-md-5  rounded position-relative">
                        </main>
                    </div>
                </div>
                {children}
            </main>
            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    </div>
    )
};

export default History;
