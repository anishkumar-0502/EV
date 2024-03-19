import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import profile from '../../assets/images/CC.jpg';

const SessionDetails = ({ userInfo, handleLogout }) => {
    const location = useLocation();
    const [sessionItem, setSessionItems] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const { matchingData } = location.state;
        if (matchingData) {
            setSessionItems(matchingData);
        }
    }, [location]);

    return (
        <div className="main" style={{marginTop:"0px"}}>
            {sessionItem && (
                <div className="header fixed-top pt-3 pb-3 bg-light">
                    <div className="arrow-icon" onClick={() => history.goBack()}>
                        <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
                    </div>
                    <div className="profile-title">
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Session Details</h3>
                    </div>
                </div>
            )}
            {sessionItem && (
                <div className="mt-2" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="img">
                        <img src={profile} alt="profile" style={{ width: '250px', height: '250px', borderRadius: "none" , marginBottom:"-50px" }} />
                    </div>
                    <div className="content" style={{ width: '280px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '20px', textAlign: "left" }}>
                        <div style={{ marginBottom: '15px' }}><strong >Charger ID</strong><br /> <p className='mt-1'>{sessionItem.ChargerID ? sessionItem.ChargerID : "-"}</p></div>
                        <div style={{ marginBottom: '15px' }}><strong>Charging Session ID</strong><br /> <p className='mt-1'> {sessionItem.ChargingSessionID ? sessionItem.ChargingSessionID : "-"}</p></div>
                        <div style={{ marginBottom: '15px' }}><strong>Start Time</strong><br />  <p className='mt-1'>{sessionItem.StartTimestamp ? new Date(sessionItem.StartTimestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : "-"}</p></div>
                        <div style={{ marginBottom: '15px' }}><strong>Stop Time</strong><br />  <p className='mt-1'>{sessionItem.StopTimestamp ? new Date(sessionItem.StopTimestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : "-"}</p></div>
                        <div style={{ marginBottom: '15px' }}><strong>Unit Consumed</strong><br /> <p className='mt-1'> {sessionItem.Unitconsumed ? sessionItem.Unitconsumed : "-"}</p></div>
                        <div><strong>Price</strong><br /> <p className='mt-1'> Rs. {sessionItem.price ? sessionItem.price : "-"}</p></div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    );
};

export default SessionDetails;
