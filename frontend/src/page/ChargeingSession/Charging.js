/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import "./style.css";
import { useHistory, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { Row, Col } from 'react-bootstrap';

// import axios from "axios";
// import WebSocket from 'ws';

const Charging = ({ userInfo, handleLogout  }) => {
    const [charging, setCharging] = useState(false);
    const [ChargerID, setChargerID] = useState(false);

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Extract user data from location state
        const { searchChargerID } = location.state;
        if (searchChargerID) {
            setChargerID(searchChargerID);
        }
    }, [location]);
    const handleStartClick = () => {
        setCharging(true);
    };

    const handleStopClick = () => {
        setCharging(false);
    };
        
return (
    <div className="main">
        <div className="header fixed-top pt-3 pb-3 bg-light">
            <div className="arrow-icon" onClick={() => history.goBack()}>
                <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
            </div>
            <div className="profile-title">
                <h3><b>Charging Session</b></h3>
            </div>
        </div>
        <div className="charging-page mt-5 mb-4">
                <div className="charging-info text-center">
                    <h2><b>CHARGER STATUS</b></h2>
                    <span className="charging-status">Charging</span>
                    <p className='mt-2'>Timestamp</p>
                    <p>{ChargerID}</p>
                </div>
                <div className="grey-bg container-fluid">
                <Row>
                    {/* First row with three cards */}
                    <Col sm={12} md={2} lg={4}>
                        <div className="card  bg-gradient mt-2 shadow">
                        <div className="card-body d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(to top, #4fa852c7, #a9f9ac9b)', borderRadius: '15px' }}>
                                <div className="text-left">
                                    <h3 className="mb-0 fw-r">
                                        <span className="currency float-left mr-1"></span>
                                        <span className="count ml-3">0</span>
                                    </h3>
                                    <p className=" mt-1 m-0">Voltage</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="mb-0 fw-r">
                                        <span className="currency float-left mr-1"></span>
                                        <span className="count">0</span>
                                    </h3>
                                    <p className=" mt-1 m-0">Current</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="mb-0 fw-r">
                                        <span className="currency float-left mr-1"></span>
                                        <span className="count mr-3">0</span>
                                    </h3>
                                    <p className=" mt-1 m-0">Power</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={2} lg={4}>
                        <div className="card  bg-gradient mt-2 shadow">
                        <div className="card-body d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(to top, #4fa852c7, #a9f9ac9b)', borderRadius: '15px' }}>
                                <div className="text-left">
                                    <h3 className="mb-0 fw-r">
                                        <span className="currency float-left mr-1"></span>
                                        <span className="count ml-3">0</span>
                                    </h3>
                                    <p className=" mt-1 m-0">Energy</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="mb-0 fw-r">
                                        <span className="currency float-left mr-1"></span>
                                        <span className="count">0</span>
                                    </h3>
                                    <p className=" mt-1 m-0">Frequency</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="mb-0 fw-r">
                                        <span className="currency float-left mr-1"></span>
                                        <span className="count mr-3">0</span>
                                    </h3>
                                    <p className=" mt-1 m-0">Power</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="charging-buttons text-center">
                {!charging && (
                    <button className="btn btn-success start-button shadow" style={{ background: 'linear-gradient(to top, #3f6c86c7, #88d2fd9b)', borderRadius: '15px' }} onClick={handleStartClick}>
                    <i className="bi bi-play-fill mr-2"></i> Start 
                    </button>
                )}
                {charging && (
                    <button className="btn btn-danger stop-button shadow" style={{ background: 'linear-gradient(to top, #ed3a3ab7, #f98c8ca7)', borderRadius: '15px' }} onClick={handleStopClick}>
                    <i className="bi bi-stop-fill mr-2"></i> Stop 
                    </button>
                )}
                </div>
                <div className="card mt-5 border-black">
                    <div className="card-header border-dark-subtle">
                    <b>THRESHOLD LEVEL</b>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Voltage level:</h5>
                        <p className="card-text">Input under voltage - 175V and below. Input over voltage - 270V and above.</p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Current:</h5>
                        <p className="card-text">Over Current - 33A</p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Frequency:</h5>
                        <p className="card-text"> Under frequency - 47HZ. Over frequency - 53HZ.</p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Temperature:</h5>
                        <p className="card-text"> Low Temperature - 0 °C. High Temperature - 58 °C.</p>
                    </div>
                </div>
            </div>
        {/* Footer */}
        <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
);


    };

export default Charging;
