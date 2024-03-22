/* eslint-disable default-case */
import React, { useState ,useEffect, useRef } from 'react';
import Footer from '../components/Footer/Footer';
import EV2 from '../assets/images/EV_Logo2.png';
import Car from '../assets/images/Car.png';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';

const Home = ({ userInfo, handleLogout,handleSearchRequest ,handleSearchBox}) => {   
    const [searchChargerID, setChargerID] = useState(''); 
    const [RecentSessionDetails, setRecentSessionDetails] = useState('');
    const Username =userInfo.username;
    const history = useHistory();      

    const fetchRecentSessionDetails = async (Username) => {
        try {
        const response = await fetch(`/getRecentSessionDetails?username=${Username}`);
        const data = await response.json();
        setRecentSessionDetails(data.value);
        } catch (error) {
        console.error('Error fetching Recent Charger:', error);
        }
    };

    useEffect(() => {
        fetchRecentSessionDetails(Username);
    }, [Username]);

    // Handle Searching Charger with ChargerID
    const handleSearch = async(e) => {
        e.preventDefault();
        const result = await handleSearchRequest(e,searchChargerID);
        if(result === searchChargerID){
            history.push('/Charging', { searchChargerID });
        }
    };
    
    // Handle Searching Charger with ChargerID
    const handleSearchRecent = async(e,searchChargerID) => {
        e.preventDefault();
        const result = await handleSearchRequest(e,searchChargerID);
        if(result === searchChargerID){
            history.push('/Charging', { searchChargerID });
        }
    };

    const headerRef = useRef();
    const textBoxRef = useRef();

    const handleTextBoxClick = (e) => {
        // if (headerRef.current && textBoxRef.current) {
        //     const headerOffset = headerRef.current.getBoundingClientRect().top;
        //     const textBoxOffset = textBoxRef.current.getBoundingClientRect().top;
        //     const scrollOffset = textBoxOffset - headerOffset;
        //     window.scrollTo({ top: scrollOffset, behavior: 'smooth' });
        // }
        // Check if the 'fixed-top' class is already added
        var isFixedTop = $('#search').hasClass('fixed-top');
        // Toggle the 'fixed-top' class
        if(isFixedTop === false){
            $('#search').toggleClass('fixed-top container-fluid', !isFixedTop,).css({
                // Add styles when the class is added
                'top': isFixedTop ? '' : '0',
                'left': isFixedTop ? '' : '0',
                'width': isFixedTop ? '' : '100%',
                'height': isFixedTop ? '' : '100%',
                'background-color': isFixedTop ? '' : 'rgba(0, 0, 0, 0.5)',
                'zIndex': isFixedTop ? '' : '9999',
            });
            $('#searchMargin').css('margin-top', '15px');
        }else{
            if(e.target.id === 'search'){
                $('#search').removeClass('fixed-top').css({
                    'position': '',
                    'top': '',
                    'left': '',
                    'width': '',
                    'height': '',
                    'background-color': 'transparent', // Example background color
                    'zIndex': '',              
                });
                $('#searchMargin').css('margin-top', '0px');
            }
        }
    };

    return (
        <div className="main">
            <div className="header fixed-top">
                {/* Navbar */}
                <nav ref={headerRef} className="navbar container-fluid navbar-expand-lg navbar-light bg-none shadow-none p-none fixed-top "> 
                    <a className="navbar-brand" href="/Home">
                        <img src={EV2} className='ml-2' alt="logo" style={{ width: '120px' }} />
                    </a>
                </nav>
            </div>
            {/* Landing Page Image */}
            <img src={Car}  alt="landing_page_image" style={{ width: '100%', marginTop: '50px' }} />

                {/* Form */}
            <form onSubmit={handleSearch} id="search" className="search w-100" onClick={handleTextBoxClick}>
                <div className="input-group md-form form-sm form-2" id="searchMargin">
                    <input type="text" className="form-control my-0 py-1 red-border" ref={textBoxRef} style={{ borderRadius: '500px 0 0 500px', height: '44px' }} id="chargerID" name="chargerID" value={searchChargerID} onChange={(e) => setChargerID(e.target.value)} placeholder="Enter DeviceID" required />
                    <div className="input-group-append">
                        <button className="input-group-text bg-success " id="basic-text1" type='submit' style={{ borderRadius: '0 500px 500px 0', border: 'none' }}>
                            <i className="fas fa-search text-white" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-5 container-fluid"> 
                <h3 className="card-title ml-1 "><b>Previously Used</b><i className="fa-solid fa-clock-rotate-left ml-2" style={{ fontSize: '1.3rem' }}></i></h3>
                <Row>
                    <Col sm={12}>
                        <div className="card bg-light mt-4 shadow" style={{ width: '100%', borderRadius: '15px', marginBottom: '80px' }}>
                            <div className="card-body">
                                <div className="row">
                                    {Array.isArray(RecentSessionDetails) && RecentSessionDetails.length > 0 ? (
                                        RecentSessionDetails
                                            .sort((a, b) => new Date(b.StopTimestamp) - new Date(a.StopTimestamp)) // Sort sessions in descending order by StopTimestamp
                                            .map((RecentSession, index) => (
                                                <React.Fragment key={RecentSession.serialNumber}>
                                                    <div className="col-12" onClick={(e) => handleSearchRecent(e,RecentSession)} >
                                                        <h5 className="mb-2">
                                                            <span className="count" >{RecentSession}</span>
                                                        </h5>
                                                    </div>
                                                    
                                                    {index < RecentSessionDetails.length - 1 && (
                                                        <div className="col-12">
                                                            <hr style={{ margin: "10px 0" }} />
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))
                                    ) : (
                                        <div className="col-12 text-center text-dark">
                                            <h4 style={{ marginTop: '10px' }}>Yet to charge</h4>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    );
};

export default Home;