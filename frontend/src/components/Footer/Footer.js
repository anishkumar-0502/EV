// Footer.js

import React from 'react';
import "./Footer.css";
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    // Get the current location using useLocation hook
    const location = useLocation();

    return (
        <footer className="bg-light text-center fixed-bottom border-top" style={{ borderRadius: '30px' }}>
            {/* Grid container */}
            <div className="container-fluid">
                {/* Section: Social media */}
                <section className="mt-2 mb-1 d-flex justify-content-around">
                {/* Home */}
                <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/Home' ? 'dark' : 'light'} ${location.pathname === '/Home' ? 'fw-bold' : ''}`}
                            to="/Home"
                        >
                        <i className="fas fa-home fa-2x mb-1"></i>
                            <span className="d-block">Home</span>
                        </Link>
                    </div>

                    {/* Wallet */}
                    <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/Wallet' ? 'dark' : 'light'} ${location.pathname === '/Wallet' ? 'fw-bold' : ''}`}
                            to="/Wallet"
                        >
                            <i className="fas fa-wallet fa-2x mb-1"></i>
                            <span className="d-block">Wallet</span>
                        </Link>
                    </div>

                    {/* History Sessions */}
                    <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/History' ? 'dark' : 'light'} ${location.pathname === '/History' ? 'fw-bold' : ''}`}
                            to="/History"
                        >
                            <i className="fas fa-history fa-2x mb-1"></i>
                            <span className="d-block">History</span>
                        </Link>
                    </div>

                    {/* Profile */}
                    <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/Profile' ? 'dark' : 'light'} ${location.pathname === '/Profile' ? 'fw-bold' : ''}`}
                            to="/Profile"
                        >
                            <i className="fas fa-user-circle fa-2x mb-1 "></i>
                            <span className="d-block">Profile</span>
                        </Link>
                    </div>
                </section>
                {/* Section: Social media */}
            </div>
            {/* Grid container */}
        </footer>
    );
};

export default Footer;
