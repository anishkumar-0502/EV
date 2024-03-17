/* eslint-disable default-case */
import React, { useState } from 'react';
import Footer from '../components/Footer/Footer';
import EV2 from '../assets/images/EV_Logo2.png';
import { useHistory } from 'react-router-dom';

const Home = ({ userInfo, handleLogout, children,handleSearchRequest }) => {   
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
        <div className="container-fluid">
            <div className="row">
                {/* Navbar */}
                <nav className="navbar container-fluid navbar-expand-lg navbar-light bg-none shadow-none p-none fixed-top "> 
                    <a className="navbar-brand" href="/Home">
                        <img src={EV2} className='ml-2' alt="logo" style={{ width: '120px' }} />
                    </a>
                </nav>
                {/* Form */}
                <form onSubmit={handleSearch} className="container ">
                    <div className="input-group md-form form-sm form-2">
                        <input type="text" className="form-control my-0 py-1 red-border" style={{ borderRadius: '500px 0 0 500px' }} id="chargerID" name="chargerID" value={searchChargerID} onChange={(e) => setChargerID(e.target.value)} placeholder="Enter DeviceID" required />
                        <div className="input-group-append">
                            <button className="input-group-text bg-success " id="basic-text1" type='submit' style={{ borderRadius: '0 500px 500px 0' }}>
                                <i className="fas fa-search text-white" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </form>
                {/* Main content */}
                <main role="main" className="col-md-9 ml-sm-auto mr-auto col-lg-9 px-md-4 bg-white  content-wrapper">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap bg-white align-items-center pt-3 pb-2 mb-3 ">
                        <div className="container">

                        </div>
                    </div>
                    {children}
                </main>

                {/* Footer */}
                <Footer userInfo={userInfo} handleLogout={handleLogout} />
            </div>
        </div>
    );
};

export default Home;
