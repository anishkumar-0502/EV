/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Import Link component
import Footer from '../../components/Footer/Footer';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


const History = ({ userInfo, handleLogout }) => {
    const history = useHistory();
    const Username = userInfo.username;
   

    // Get user charging session details
    const handleChargingSessionDetails = (Username) => {
        fetchChargingSessionDetails(Username);
    }

    const [sessionDetails, setSessionDetails] = useState('');
    
    // const ChargerID = sessionDetails.ChargerID;
   

    const fetchChargingSessionDetails = async (Username) => {
        try {
            const response = await fetch(`/getChargingSessionDetails?username=${Username}`);
            const data = await response.json();
            setSessionDetails(data.value);
        } catch (error) {
            console.error('Error fetching charging session details:', error);
        }
    };

    useEffect(() => {
        handleChargingSessionDetails(Username);
    }, [Username]);

   
    const navigateSession = (sessionDetails, ChargingSessionID) => {
        if (ChargingSessionID) {
            // Find the object with matching ChargerID
            const matchingData = sessionDetails.find(data => data.ChargingSessionID === ChargingSessionID);
            if (matchingData) {
                // If a matching object is found, navigate to sessionDetails with the matched data
                history.push('./sessionDetails', {matchingData});
            } else {
                console.log('No matching data found for the given ChargerID.');
            }
        } else {
            alert('Invalid sessionDetails or ChargerID provided.');
        }
    };
    
    

    return (
        <div className="main">
            {/* Header */}
            <div className="header fixed-top pt-3 pb-3 bg-light">
                <div className="arrow-icon" onClick={() => history.goBack()}>
                    <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
                </div>
                <div className="profile-title">
                    <h3><b>History</b></h3>
                </div>
            </div>

            {/* Session History */}
            <div className="fluid w-100 mt-4">
    <div className=" custom-container mt-5">
        <h3 className="card-title ml-1 mt-1"><b>Session History</b><i className="fa-solid fa-clock-rotate-left ml-2" style={{ fontSize: '1.3rem' }}></i></h3>
        <Row>
            <Col sm={12}>
                <div className="card bg-light mt-4  shadow" style={{ width: '100%', borderRadius: '15px' , marginBottom: "80px"}}>
                    <div className="card-body">
                        <div className="row">
                            {Array.isArray(sessionDetails) && sessionDetails.length > 0 ? (
                                sessionDetails.map((sessionItem, index) => (
                                    <React.Fragment key={sessionItem.serialNumber}>
                                        <div className="col-7" style={{color:"black"}} onClick={() => navigateSession(sessionDetails,sessionItem.ChargingSessionID)}>
                                            <h4 className="mb-2">
                                                <b><span className="count">{sessionItem.ChargerID ? sessionItem.ChargerID : "-"}</span></b>
                                            </h4>
                                            <p className="mb-0" style={{ fontSize: "0.8rem" }}>{sessionItem.StopTimestamp ? new Date(sessionItem.StopTimestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : "-"}</p>
                                        </div>
                                        <div className="col-5 d-flex align-items-center justify-content-end" onClick={() => navigateSession(sessionDetails,sessionItem.ChargingSessionID)}>
                                            <h5 className="mb-4 mt-3" style={{ color: "red" }}><b>- Rs. {sessionItem.price ? sessionItem.price : "-"}</b></h5>
                                        </div>
                                        {index < sessionDetails.length - 1 && (
                                            <div className="col-12">
                                                <hr style={{ margin: "10px 0" }} />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="col-12 text-center text-dark">
                                    <h4 style={{ marginTop: '10px' }}>No Error Found</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</div>

            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    )
};

export default History;
