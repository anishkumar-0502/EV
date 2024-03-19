// Footer.js

import React  from 'react';
import "./Footer.css";
import { Link, useLocation } from 'react-router-dom';

const Footer = ({ killChargerID,ChargerID}) => {

    const location = useLocation();

    const KillCharger = async() => {
        if(ChargerID){
            await killChargerID();
        } 
    };


    return (
        <footer className="bg-light text-center fixed-bottom border-top" style={{ borderRadius: '30px' }}>
            {/* Grid container */}
            <div className="container-fluid">
                {/* Section: Social media */}
                <section className="mt-2 mb-1 d-flex justify-content-around">
                {/* Home */}
                <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/Home' || location.pathname === '/Charging' ? 'dark' : 'light'} ${location.pathname === '/Home' ? 'fw-bold' : ''}`}
                            to="/Home"
                            onClick={KillCharger}
                        >
                        <i className="fas fa-home fa-2x mb-1"></i>
                            <span className="d-block">Home</span>
                        </Link>
                    </div>

                    {/* Wallet */}
                    <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/Wallet' ? 'dark' : 'light'} ${location.pathname === '/Wallet' ? 'fw-bold' : ''}`}
                            to="/Wallet"  onClick={KillCharger}
                        >
                            <i className="fas fa-wallet fa-2x mb-1"></i>
                            <span className="d-block">Wallet</span>
                        </Link>
                    </div>

                    {/* History Sessions */}
                    <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/History' || location.pathname === '/sessionDetails' ? 'dark' : 'light'} ${location.pathname === '/History' ? 'fw-bold' : ''}`}
                            to="/History"  onClick={KillCharger}
                        >
                            <i className="fas fa-history fa-2x mb-1"></i>
                            <span className="d-block">History</span>
                        </Link>
                    </div>

                    {/* Profile */}
                    <div className="d-flex flex-column align-items-center">
                        <Link
                            className={`text-decoration-none text-dark text-${location.pathname === '/Profile' || location.pathname === '/settings' || location.pathname === '/help' ? 'dark' : 'light'} ${location.pathname === '/Profile' ? 'fw-bold' : ''}`}
                            to="/Profile"  onClick={KillCharger}
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
