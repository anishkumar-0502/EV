/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import "./style.css";
import { useHistory, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { Row, Col } from 'react-bootstrap';
import Car from '../../assets/images/car-2.png';
import Swal from 'sweetalert';


const Charging = ({ userInfo,handleLogout,isTimeoutRunning,handleSearchBox,startTimeout,stopTimeout,fetchWallletBal }) => {
    const [charging, setCharging] = useState(false);
    const [ChargerID, setChargerID] = useState(false);
    const [historys, setHistory] = useState([]);

    const history = useHistory();
    const location = useLocation();

    // Function to handle the goback and here by  making null active user of that particular charger
    const goBack = async() => {
        await handleSearchBox(ChargerID);
        history.goBack();
    };

    async function killChargerID(){
        await handleSearchBox(ChargerID);
    }

    // Alert message ( success, error)
    const [successData, setShowAlertsSuccess] = useState(false);
    const closeAlertSuccess = () => {
        setShowAlertsSuccess(false);
    };
    const [errorData, setShowAlerts] = useState(false);
    const closeAlert = () => {
        setShowAlerts(false);
    };

 
    // Show error history (toggle button) 
  
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isThresholdVisible, setIsThresholdVisible] = useState(false);

    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
        if (isThresholdVisible) setIsThresholdVisible(false); // Hide threshold if visible
    };

    const toggleThresholdVisibility = () => {
        setIsThresholdVisible(!isThresholdVisible);
        if (isTableVisible) setIsTableVisible(false); // Hide error history if visible
    };


    const [ChargerStatus, setChargerStatus] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [checkFault, setCheckFault] = useState(false);
    const [voltage, setVoltage] = useState(0);
    const [current, setCurrent] = useState(0);
    const [power, setPower] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [frequency, setFrequency] = useState(0);
    const [temperature, setTemperature] = useState(0);

    const AppendStatusTime = (ChargerStatus, CurrentTime) => {
        setChargerStatus(ChargerStatus);
        setTimestamp(CurrentTime);
    
        const startButton = document.getElementById("startTransactionBtn");
        const stopButton = document.getElementById("stopTransactionBtn");
    
        // Enabling start button when ChargerStatus is 'Preparing'
        startButton.disabled = ChargerStatus !== 'Preparing';
    
        // Enabling stop button when ChargerStatus is 'Charging'
        stopButton.disabled = ChargerStatus !== 'Charging';
    };
    // Alert loding function
    const [showAlertLoding, setShowAlertLoding] = useState(false);

    const handleAlertLodingStart = () => {
        setShowAlertLoding(true);
    }

    const handleAlertLodingStop = () => {
        setShowAlertLoding(false);
    }

    const formatTimestamp = (originalTimestamp) => {
        const date = new Date(originalTimestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        };  

    // Last status
    async function FetchLaststatus(ChargerID){
        try {
        const response = await fetch('/FetchLaststatus', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ChargerID }),
        });

        if (response.ok) {
            const data = await response.json();
            const status = data.message.status;
            const formattedTimestamp = formatTimestamp(data.message.timestamp);
            if(status === 'Available'){
                startTimeout();
            }
            setChargerStatus(status);
            setTimestamp(formattedTimestamp);
            AppendStatusTime(status, formattedTimestamp);
        } else {
            console.error(`Failed to fetch status. Status code: ${response.status}`);
        }
        } catch (error) {
        console.error(`Error while fetching status: ${error.message}`);
        }
    };
    
    useEffect(() => {
        // Extract user data from location state
        const { searchChargerID } = location.state;
        if (searchChargerID) {
            setChargerID(searchChargerID);
            FetchLaststatus(searchChargerID);
        }
    }, [location]);

    useEffect(() => {
        if (isTimeoutRunning) {
        // Start the timeout when isTimeoutRunning is true
        const id = setTimeout(() => {
            handleSearchBox(ChargerID);
            stopTimeout();
            history.goBack();
            Swal({
                title: 'Timeout',
                text: 'Please re-initiate the charger !',
                icon: 'warning',
                button: 'OK'
            });
        }, 45000); // Example: 5 seconds delay  
        // Cleanup function to stop the timeout when component unmounts or isTimeoutRunning becomes false
        return () => clearTimeout(id);
        }
    }, [isTimeoutRunning]); // useEffect will re-run whenever isTimeoutRunning changes

    
const [socket, setSocket] = useState(null);

// Effect to handle WebSocket connection
useEffect(() => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Call scrollToTop when component mounts
    scrollToTop();
    // Check if the socket is not already open and ChargerID is provided
    if (!socket && ChargerID) {             
        
    //for Testing in Charger Simulator
    const newSocket = new WebSocket('ws://122.166.210.142:7050');


    newSocket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });

    newSocket.addEventListener('message', (response) => {
        const parsedMessage = JSON.parse(response.data);
        RcdMsg(parsedMessage);
    });

    newSocket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
    });

    newSocket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    // Set the socket state
    setSocket(newSocket);
    }
    // Cleanup function to close the WebSocket when the component is unmounted
    return () => {
    if (socket) {
        socket.close();
        setSocket(null);
    }
    };
    }, [ChargerID, socket]);
    const [isStarted, setIsStarted] = useState(false);

    // Effect to load isStarted from localStorage on component mount
    useEffect(() => {
        const storedIsStarted = localStorage.getItem("isStarted");
        setIsStarted(storedIsStarted === "true");
    }, []);

    // WebSocket event listener message (all data)
    function RcdMsg(parsedMessage){
        let ChargerStatus;
        let CurrentTime;
        let errorCode;
        let user = userInfo.username;
        const { DeviceID, message } = parsedMessage;
        if (DeviceID === ChargerID) {
            switch (message[2]) {
                case 'StatusNotification':
                    ChargerStatus = message[3].status;
                    CurrentTime = formatTimestamp(message[3].timestamp);
                    errorCode = message[3].errorCode;
                    console.log(`ChargerID ${DeviceID}: {"status": "${ChargerStatus}","time": "${CurrentTime}","error": "${errorCode}"}`);
                    if(ChargerStatus === 'Preparing'){
                        stopTimeout();
                        setIsStarted(false);
                        localStorage.setItem("isStarted", false);
                    }else if(ChargerStatus === 'Available'){
                        startTimeout();
                        setIsStarted(false);
                        localStorage.setItem("isStarted", false);
                    }else if(ChargerStatus === 'Charging'){
                    
                        // Store isStarted in localStorage
                        setIsStarted(true);
                        localStorage.setItem("isStarted", true);
                        handleAlertLodingStop();
                    }
                    // Update state variables to maintain the history
                    if (errorCode !== 'NoError') {
                        setHistory((historys) => [
                            ...historys,
                            {
                            serialNumber: historys.length + 1,
                            currentTime: CurrentTime,
                            chargerStatus: ChargerStatus,
                            errorCode: errorCode,
                            },
                        ]);
                        setCheckFault(true);
                    } else {
                        setCheckFault(false);
                    }
                break;
        
                case 'Heartbeat':
                    CurrentTime = getCurrentTime();
                    setTimestamp(CurrentTime);
                break;
        
                case 'MeterValues':
                    const meterValues = message[3].meterValue;
                    const sampledValue = meterValues[0].sampledValue;
                    const formattedJson = convertToFormattedJson(sampledValue);
        
                    // You can use state to store these values and update the state
                    const updatedValues = {
                        voltage: formattedJson['Voltage'],
                        current: formattedJson['Current.Import'],
                        power: formattedJson['Power.Active.Import'],
                        energy: formattedJson['Energy.Active.Import.Register'],
                        frequency: formattedJson['Frequency'],
                        temperature: formattedJson['Temperature'],
                    };
                    setChargerStatus('Charging');
                    setTimestamp(getCurrentTime());
                    setVoltage(updatedValues.voltage);
                    setCurrent(updatedValues.current);
                    setPower(updatedValues.power);
                    setEnergy(updatedValues.energy);
                    setFrequency(updatedValues.frequency);
                    setTemperature(updatedValues.temperature);
                    console.log(`{ "V": ${updatedValues.voltage},"A": ${updatedValues.current},"W": ${updatedValues.power},"Wh": ${updatedValues.energy},"Hz": ${updatedValues.frequency},"Kelvin": ${updatedValues.temperature}}`);
                break;
        
                case 'Authorize':
                    if (checkFault === false) {
                        ChargerStatus = 'Authorized';
                    }
                    CurrentTime = getCurrentTime();
                break;
        
                case 'FirmwareStatusNotification':
                    ChargerStatus = message[3].status.toUpperCase();
                break;
        
                case 'StopTransaction':
                    ChargerStatus = 'Finishing';
                    CurrentTime = getCurrentTime();
                    // Remove isStarted from localStorage
                    setIsStarted(false);
                    localStorage.removeItem("isStarted");
                    handleAlertLodingStart();
                    setTimeout(function () {
                        updateSessionPriceToUser(ChargerID, user);
                    }, 5000);
                break;
        
                case 'Accepted':
                ChargerStatus = 'ChargerAccepted';
                CurrentTime = getCurrentTime();
                break;
            }
        }
        if (ChargerStatus) {
            AppendStatusTime(ChargerStatus, CurrentTime);
        }
    }

    // Get current time
    const getCurrentTime = () => {
        const currentDate = new Date();
        const currentTime = currentDate.toISOString();
        return formatTimestamp(currentTime);
    };
    // Function to convert the structure
    const convertToFormattedJson = (measurandArray) => {
        const formattedJson = {};
        measurandArray.forEach(measurandObj => {
        const key = measurandObj.measurand;
        const value = measurandObj.value;
        formattedJson[key] = value;
        });
        return formattedJson;
    };

    // Alert message show
    const [showAlert, setShowAlert] = useState(false);
    const [chargingSession, setChargingSession] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});

    const setApiData = (chargerSession,uservalue) => {
        console.log(uservalue);
        setChargingSession(chargerSession);
        setUpdatedUser(uservalue);
        setShowAlert(true);
    };
    // Alert message close
    const handleCloseAlert = async () => {
        await killChargerID()
        await history.goBack();
        setShowAlert(false);


    };

        // start button
        const handleStartTransaction = async () => {
            try {
            setCharging(true);
            const response = await fetch('/start', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: ChargerID, user: userInfo.username }),
            });
        
            if (response.status === 200) {
                const data = await response.json();
                console.log('ChargerStartInitiated');
                console.log(data.message);
            }
            } catch (error) {
            console.error('Error:', error.message);
            }
        };

        // stop button
        const handleStopTransaction = async () => {
            try {
                setCharging(false);

            const response = await fetch('/stop', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: ChargerID }),
            });
        
            if (response.status === 200) {
                const data = await response.json();
                console.log('ChargerStopInitiated');
                console.log(data.message);
            }
            } catch (error) {
            console.error('Error:', error.message);
            }
        };

    const updateSessionPriceToUser = async (ChargerID, user) => {
        try {
        const response = await fetch('/getUpdatedCharingDetails', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            chargerID: ChargerID,
            user: user,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            let chargingSession = data.value.chargingSession;
            let updatedUser = data.value.user;
            console.log(chargingSession,updatedUser);
            setApiData(chargingSession,updatedUser);
            handleAlertLodingStop();
            handleSearchBox(ChargerID);
            await fetchWallletBal(userInfo.username);
            //await EndChargingSession(ChargerID);
        } else {
            // Log or handle error
            console.error('Update failed:', response.statusText);
        }
        } catch (error) {
        // Log or handle error
        console.error('Update failed:', error.message);
        }
    };

return (
    <div className="main" id="ChargingSession">
        <div className="header fixed-top  pt-3 pb-3 bg-light">
            <div className="arrow-icon" onClick={goBack}>
                <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
            </div>
            <div className="profile-title">
                <h3><b>Charging Dashboard</b></h3>
            </div>
        </div>
        <div className=" mt-5 mb-4">
                <div className="charging-info text-center mt-3">
                    <h2><b>CHARGER STATUS</b></h2>
                    <h4>{ChargerID}</h4>
                    <h2 className="charging-status"><b>{ChargerStatus}</b></h2>
                    <p className='mt-2'>{timestamp}</p>
                </div>
                {/* Bunk */}
                <img src={Car} alt="Plugin img" style={{ width: '100%', marginTop: '40px',marginBottom:"40px" }} />
                {/* battery */}
                {isStarted && (
                        <div class="battery " style={{marginTop:"0px" , marginBottom:"35px"}}> </div>
                    )}
                <div className="charging-buttons text-center mb-5">
                    {/* Start button */}
                    <button type="submit" className="btn btn-success border-0 start-button shadow" style={{ background: 'linear-gradient(to top, #3f6c86c7, #88d2fd9b)', borderRadius: '15px' }} id="startTransactionBtn" onClick={handleStartTransaction} disabled={ChargerStatus !== 'Preparing'}>
                        <i className="bi bi-play-fill mr-2"></i> Start
                    </button>
                    
                    {/* Stop button */}
                    <button type="submit" className="btn btn-danger border-0 stop-button shadow" style={{ background: 'linear-gradient(to top, #ed3a3ab7, #f98c8ca7)', borderRadius: '15px' }} id="stopTransactionBtn"  onClick={handleStopTransaction} disabled={ChargerStatus !== 'Charging'}>
                        <i className="bi bi-stop-fill mr-2"></i> Stop
                    </button>
                </div>

                {isStarted && (
            <div className="container-fluid mt-5">
            <Row>
                {/* First row with three cards */}
                <Col sm={12} md={2} lg={4}>
                <div className="card bg-gradient mt-2 shadow">
                    <div
                    className="card-body d-flex justify-content-between align-items-center"
                    style={{
                        background: "linear-gradient(to top, #4fa852c7, #a9f9ac9b)",
                        borderRadius: "15px",
                    }}
                    >
                    <div className="text-center">
                        {" "}
                        {/* Changed class from "text-left" to "text-center" */}
                        <h3 className="mb-0 fw-r">
                        <span className="count ml-3">{voltage}</span>
                        </h3>
                        <p className="mt-1 m-0 ml-3">Voltage</p>
                    </div>
                    <div className="text-center">
                        {" "}
                        {/* Changed class from "text-center" to "text-center" */}
                        <h3 className="mb-0 fw-r">
                        <span className="count">{current}</span>
                        </h3>
                        <p className="mt-1 m-0">Current</p>
                    </div>
                    <div className="text-center">
                        {" "}
                        {/* Changed class from "text-right" to "text-center" */}
                        <h3 className="mb-0 fw-r">
                        <span className="count mr-3">{power}</span>
                        </h3>
                        <p className="mt-1 m-0 mr-3">Power</p>
                    </div>
                    </div>
                </div>
                </Col>
                <Col sm={12} md={2} lg={4}>
                <div className="card bg-gradient mt-2 shadow">
                    <div
                    className="card-body d-flex justify-content-between align-items-center"
                    style={{
                        background: "linear-gradient(to top, #4fa852c7, #a9f9ac9b)",
                        borderRadius: "15px",
                    }}
                    >
                    <div className="text-center">
                        {" "}
                        {/* Changed class from "text-left" to "text-center" */}
                        <h3 className="mb-0 fw-r">
                        <span className="count ml-1 pl-2">{energy}</span>
                        </h3>
                        <p className="mt-1 m-0 ml-3">Energy</p>
                    </div>
                    <div className="text-center">
                        {" "}
                        {/* Changed class from "text-center" to "text-center" */}
                        <h3 className="mb-0 fw-r">
                        <span className="count ml-1 pl-3">{frequency}</span>
                        </h3>
                        <p className="mt-1 m-0 mr-4 pl-5">Frequency</p>
                    </div>
                    <div className="text-center">
                        {" "}
                        {/* Changed class from "text-right" to "text-center" */}
                        <h3 className="mb-0 fw-r">
                        <span className="count mr-2 pl-3">{temperature}</span>
                        </h3>
                        <p className="mt-1 m-0 ">Temperature</p>
                    </div>
                    </div>
                </div>
                </Col>
            </Row>
                </div>
            )}
            {/* Hide & showbuttons */}
            <div className="row mb-5 mt-3 ">
                <div className="col text-center mt-0 ">
                <button
                    className="btn  button"
                    style={{
                    borderColor: "red",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    fontSize: "0.9rem",
                    width: "130px",
                    height: "40px",
                    color: "red",
                    }}
                    type="submit"
                    onClick={() => toggleTableVisibility()} // Pass "error" as the ID parameter
                >
                    {isTableVisible ? "Hide Error " : "Show Error "}
                </button>

                <button
                    className="btn  ml-3"
                    style={{
                    borderColor: "#43a5be",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    fontSize: "0.9rem",
                    height: "40px",
                    color: "#43a5be",
                    }}
                    type="button"
                    onClick={toggleThresholdVisibility}
                >
                    {isThresholdVisible ? "Hide Threshold" : "Show Threshold"}
                </button>
                </div>

                {isTableVisible && !isThresholdVisible && (
                <div className="container-fluid mt-0 mb-4 ml-3 " id="error">
                    {" "}
                    {/* Added mt-3 to create space below buttons */}
                    <Row>
                    <Col sm={12}>
                        <div
                        className="card bg-light mt-5 shadow border-danger"
                        style={{ width: "90%", borderRadius: "15px" }}
                        >
                        <div className="card-body">
                            <div className="row">
                            {historys.length > 0 ? (
                                historys.map((entry) => (
                                <React.Fragment key={entry.serialNumber}>
                                    <div className="col-6">
                                    <h4 className="mb-2">
                                        <span className="count">
                                        {entry.chargerStatus}
                                        </span>
                                    </h4>
                                    <p className="mb-0">{entry.currentTime}</p>
                                    </div>
                                    <div className="col-6 d-flex align-items-center justify-content-end">
                                    <h5 className="mb-4 mt-3 text-danger">
                                        {entry.errorCode}
                                    </h5>
                                    </div>
                                </React.Fragment>
                                ))
                            ) : (
                                <div className="col-12 text-center text-dark">
                                <h4 style={{ marginTop: "10px" }}>No Error Found</h4>
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    </Col>
                    </Row>
                </div>
                )}

                {!isTableVisible && isThresholdVisible && (
                <div className="container-fluid mt-5 ml-3">
                    {" "}
                    {/* Added mt-3 to create space below buttons */}
                    <div className="card mb-5 border-black " style={{ width: "90%" }}>
                    <div className="card-header border-dark-subtle">
                        <b>THRESHOLD LEVEL</b>
                    </div>
                    <div className="card-body">
                        {/* Threshold Details */}
                        <h5 className="card-title">Voltage level:</h5>
                        <p className="card-text">
                        Input under voltage - 175V and below. Input over voltage -
                        270V and above.
                        </p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Current:</h5>
                        <p className="card-text">Over Current - 33A</p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Frequency:</h5>
                        <p className="card-text">
                        {" "}
                        Under frequency - 47HZ. Over frequency - 53HZ.
                        </p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Temperature:</h5>
                        <p className="card-text">
                        {" "}
                        Low Temperature - 0 °C. High Temperature - 58 °C.
                        </p>
                    </div>
                    </div>
                </div>
                )}
            </div>
            </div>

            {/* Alert success message start */}
            {successData && (
                <div className="alert-overlay">
                    <div className="alert success alerts" style={{width:'500px', textAlign:'center'}}>
                    <span className="alertClose" onClick={closeAlertSuccess}>X</span>
                    <span className="alertText" style={{fontSize:'20px'}}><strong style={{color:'#155724'}}>{successData}</strong></span>
                    </div>
                </div>
            )}
            {/* Alert success message end */}
            {/* Loding alert */}
                {showAlertLoding && (
                    <div className="alert-overlay-loading" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="alert-loading success alerts" style={{ width: '200px', textAlign: 'center', padding: "20px" }}>
                            <div className="spinner-border text-success" role="status" style={{ fontSize: '20px' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Alert charger update Session Price To User start*/}
                {showAlert && (
                <div className="alert-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
                    <div className="card-deck " style={{position:"fixed", width:"90%"}}  >
                        <div className="card">
                            <div className="card-body text-left">
                                <div className="mb-4 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-success" width="50" height="40" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                    </svg>
                                </div>
                                <h3 className="text-center mb-4"><b>Charging Done</b></h3>
                                <ul className="list-group">
                                    <li className="list-group-item list-group-item-success">
                                        <b>Charger ID</b>&nbsp;&nbsp;{chargingSession.ChargerID}
                                    </li>
                                    <li className="list-group-item list-group-item-success">
                                        <b>Start Time</b>&nbsp;&nbsp;
                                        {chargingSession.StartTimestamp && (
                                            <span>
                                                {new Date(chargingSession.StartTimestamp).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}
                                                <br />
                                                <span style={{ marginLeft: '77px' }}>{new Date(chargingSession.StartTimestamp).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</span>
                                            </span>
                                        )}
                                    </li>
                                    <li className="list-group-item list-group-item-success">
                                        <b>Stop Time</b>&nbsp;&nbsp;
                                        {chargingSession.StopTimestamp && (
                                            <span>
                                                {new Date(chargingSession.StopTimestamp).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}
                                                <br />
                                                <span style={{ marginLeft: '77px' }}>{new Date(chargingSession.StopTimestamp).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</span>
                                            </span>
                                        )}
                                    </li>
                                    <li className="list-group-item list-group-item-success">
                                        <b>Unit Consumed</b>&nbsp;&nbsp;{chargingSession.Unitconsumed}
                                    </li>
                                    <li className="list-group-item list-group-item-success">
                                        <b>Charging Price</b>&nbsp;&nbsp;{chargingSession.price}
                                    </li>
                                    <li className="list-group-item list-group-item-success">
                                        <b>Available Balance</b>&nbsp;&nbsp;{updatedUser.walletBalance}
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer d-flex justify-content-center">
                                <button type="button" className="button-45 border-danger" id="left-panel-link" onClick={handleCloseAlert}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert charger update Session Price To User end*/}

            {/* Alert error message start */}
            {errorData && (
            <div className="alert alert-warning alert-dismissible fade show alert-container text-center" role="alert" style={{width:'415px'}}>
                <strong>{errorData}</strong> 
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={closeAlert} style={{top:'7px'}}>
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        )}
        {/* Alert error message end*/}
        {/* Footer */}
        <Footer userInfo={userInfo} handleLogout={handleLogout} killChargerID={killChargerID} ChargerID={ChargerID}/>
        
    </div>
);


    };

export default Charging;
