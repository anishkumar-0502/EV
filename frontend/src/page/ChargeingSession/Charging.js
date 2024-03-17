/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const Charging = ({ userInfo, handleLogout }) => {
    const [ChargerStatus, setChargerStatus] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [checkFault, setCheckFault] = useState(false);
    const [historys, setHistory] = useState([]);
    const [voltage, setVoltage] = useState(0);
    const [current, setCurrent] = useState(0);
    const [power, setPower] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [frequency, setFrequency] = useState(0);
    const [temperature, setTemperature] = useState(0);
  
    const history = useHistory();

    return (
        <div className="main">
            <div className="header">
                <div className="arrow-icon" onClick={() => history.goBack()}>
                    <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    <div className="profile-title">
                    <h3>Charging Session</h3>
                </div>
            </div>
            
            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    )
    };

export default Charging;
