/* eslint-disable default-case */
import React, { useState } from 'react';
import Footer from '../components/Footer/Footer';
import EV2 from '../assets/images/EV_Logo2.png';
import { useHistory } from 'react-router-dom';

const Home = ({ userInfo, handleLogout,handleSearchRequest }) => {   
    const [searchChargerID, setChargerID] = useState('');  
    const history = useHistory();
    
    const handleSearch = async(e) => {
        e.preventDefault();
        const result = await handleSearchRequest(e,searchChargerID);
        if(result === searchChargerID){
            history.push('/Charging', { searchChargerID });
        }
    };

    return (
        <div className="main">
            <div className="header fixed-top  ">
                {/* Navbar */}
                <nav className="navbar container-fluid navbar-expand-lg navbar-light bg-none shadow-none p-none fixed-top "> 
                    <a className="navbar-brand" href="/Home">
                        <img src={EV2} className='ml-2' alt="logo" style={{ width: '120px' }} />
                    </a>
                </nav>
                {/* Form */}
                <form onSubmit={handleSearch} className="container">
                    <div className="input-group md-form form-sm form-2">
                        <input type="text" className="form-control my-0 py-1 red-border" style={{ borderRadius: '500px 0 0 500px' }} id="chargerID" name="chargerID" value={searchChargerID} onChange={(e) => setChargerID(e.target.value)} placeholder="Enter DeviceID" required />
                        <div className="input-group-append">
                            <button className="input-group-text bg-success " id="basic-text1" type='submit' style={{ borderRadius: '0 500px 500px 0' }}>
                                <i className="fas fa-search text-white" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    );
};

export default Home;
