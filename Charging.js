/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import EV2 from '../../assets/images/EV_Logo2.png';

const Charging = ({ userInfo, handleLogout, children }) => {   
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [searchChargerID, setChargerID] = useState('');
    const [ChargerID, setSearchChargerID] = useState('');
    const Username = userInfo.username;
    const history = useHistory();

    const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);

    // Search charger Id
    const handleSearchRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/SearchCharger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchChargerID, Username }),
            });

            if (response.ok) {
                setSearchChargerID(searchChargerID);
                console.log("ChargerId" ,searchChargerID)
                document.getElementById('rechargeWalletSection').style.display = 'block';
                document.getElementById('searchBoxSection').style.display = 'block';
                document.getElementById('statusSection').style.display = 'block';
                document.getElementById('backSection').style.display = 'block';
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            alert(error);
        }
    };

  // Alert message ( success, error)
  const [successData, setShowAlertsSuccess] = useState(false);
  const closeAlertSuccess = () => {
    setShowAlertsSuccess(false);
  };
  const [errorData, setShowAlerts] = useState(false);
  const closeAlert = () => {
    setShowAlerts(false);
  };
  
      // Alert message show
  const [showAlert, setShowAlert] = useState(false);
  const [chargingSession, setChargingSession] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});

  // Alert loding function
  const [showAlertLoding, setShowAlertLoding] = useState(false);

  const setApiData = (chargerSession,uservalue) => {
    console.log(uservalue);
    setChargingSession(chargerSession);
    setUpdatedUser(uservalue);
    setShowAlert(true);
  };

   // Alert message close
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleAlertLodingStart = () => {
    setShowAlertLoding(true);
  }

  const handleAlertLodingStop = () => {
    setShowAlertLoding(false);
  }
  useEffect(() => {
    if (isTimeoutRunning) {
      // Start the timeout when isTimeoutRunning is true
      const id = setTimeout(() => {
        // Your timeout logic here
        alert('Timeout, Please re-initiate the charger !');
        stopTimeout();
      }, 45000); // Example: 5 seconds delay  

      // Update timeoutId state with the ID returned by setTimeout
      // setTimeoutId(id);

      // Cleanup function to stop the timeout when component unmounts or isTimeoutRunning becomes false
      return () => clearTimeout(id);
    }
  }, [isTimeoutRunning]); // useEffect will re-run whenever isTimeoutRunning changes

  const startTimeout = () => {
    setIsTimeoutRunning(true); // Start the timeout by setting isTimeoutRunning to true
  };

  const stopTimeout = () => {
    setIsTimeoutRunning(false); // Stop the timeout by setting isTimeoutRunning to false
  };

  const EndChargingSession = async (ChargerID) => {
    try{
      const response = await fetch(`/endChargingSession?ChargerID=${ChargerID}`);
      const data = await response.json();
      console.log(data);
    }catch(error){
      console.error('Error End Charging Session:', error);
    }
  }
  
  // Show error history (toggle button) 
  const [isTableVisible, setIsTableVisible] = useState(false);
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  // Get user wallet balance
  const fetchWallletBal = async (username) => {
    try {
      const response = await fetch(`/GetWalletBalance?username=${username}`);
      const data = await response.json();
      setWalletBalance(data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  useEffect(() => {
    fetchWallletBal(Username);
  }, [Username]);
  
 
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
 
  const [socket, setSocket] = useState(null);

  // Effect to handle WebSocket connection
  useEffect(() => {
    // Check if the socket is not already open and ChargerID is provided
    if (!socket && ChargerID) {
      const newSocket = new WebSocket('ws://192.168.1.13:7050');

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

  // WebSocket event listener message (all data)
  function RcdMsg(parsedMessage){
    let ChargerStatus;
    let CurrentTime;
    let errorCode;
    let user = Username;
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
            }
            if(ChargerStatus === 'Available'){
              startTimeout();
            }
            if(ChargerStatus === 'Charging'){
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

   // start button
   const handleStartTransaction = async () => {
    try {
      const response = await fetch('http://192.168.1.13:8052/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ChargerID, user: Username }),
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
      const response = await fetch('http://192.168.1.13:8052/stop', {
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

  const updateSessionPriceToUser = async (ChargerID, user) => {
    try {
      const response = await fetch('http://192.168.1.13:8052/getUpdatedCharingDetails', {
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
        setApiData(chargingSession,updatedUser);
        handleAlertLodingStop();
        await fetchWallletBal(Username);
        await EndChargingSession(ChargerID);
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
        <div className="container-fluid">
            <div className="row">
                {/* Main content */}
                <main role="main" className="col-md-9 ml-sm-auto mr-auto col-lg-9 px-md-4 bg-white  content-wrapper">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap bg-white align-items-center pt-3 pb-2 mb-3 ">
                        <div className="container">
        {/* Charger status Section  start*/}
        <div className="col-md-12" id="statusSection" >
          <blockquote className="blockquote">
            <div className="card">
              <div className="card-body">
                <div className="text-center">
                  <h2 className="card-title text-colors">CHARGER STATUS</h2>
                  <h5>{ChargerStatus}</h5>
                  <h5>{timestamp}</h5>
                  <h5 className="text-colors">{ChargerID}</h5>
                </div>
                <div className="container cardContainer">
                  <div className="row">
                    <div className="col-12 col-sm-4">
                      <div className="container mt-3">
                        <div className="card radius_bgColor">
                          <div className="card-body"><strong>Voltage : </strong> <span>{voltage}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="container mt-3">
                        <div className="card radius_bgColor">
                          <div className="card-body"><strong>Current : </strong> <span>{current}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="container mt-3">
                        <div className="card radius_bgColor">
                          <div className="card-body"><strong>Power :</strong> <span>{power}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="container mt-3">
                        <div className="card radius_bgColor">
                          <div className="card-body"><strong>Energy : </strong> <span>{energy}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="container mt-3">
                        <div className="card radius_bgColor">
                          <div className="card-body"><strong>Frequency : </strong> <span>{frequency}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="container mt-3">
                        <div className="card radius_bgColor">
                          <div className="card-body"><strong>Temperature : </strong> <span>{temperature}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="row justify-content-around text-center">
                    <div className="col-12 col-sm-5">
                      <div className="container mt-4">
                        <button type="submit" className="button-br btn btn-outline-success" onClick={handleStartTransaction} disabled={ChargerStatus !== 'Preparing'} id="startTransactionBtn" style={{width:'40%', borderRadius: '20px'}}><b>Start</b></button>    
                      </div>
                    </div>
                    <div className="col-12 col-sm-5">
                      <div className="container mt-4">
                        <button type="submit" className="button-br btn btn-outline-danger" onClick={handleStopTransaction} disabled={ChargerStatus !== 'Charging'} id="stopTransactionBtn" style={{width:'40%', borderRadius: '20px'}}><b>Stop</b></button>                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center paddingTop">
                  <button type="submit" className="button-br btn btn-outline-primary" onClick={toggleTableVisibility}>
                    <span>{isTableVisible ? 'Hide Error History' : 'Show Error History'}</span>
                  </button>
                </div>
                {isTableVisible && (
                  <div className="col-lg-12 grid-margin stretch-card" style={{paddingTop:'20px'}}>
                    <div className="card">
                      <div className="card-body">
                        <div className="table-container">
                          <table className="table table-striped text-center" >
                            <thead className="sticky-md-top">
                              <tr>
                                <th>Sl.No</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                                <th>Error</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historys.length > 0 ? (
                                historys.map((entry) => (
                                  <tr key={entry.serialNumber}>
                                    <td>{entry.serialNumber}</td>
                                    <td>{entry.currentTime}</td>
                                    <td>{entry.chargerStatus}</td>
                                    <td>{entry.errorCode}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" style={{ marginTop: '50px', textAlign: 'center' }}>No error found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-md-12 grid-margin stretch-card paddingTop" >
                  <div className="">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 card" style={{backgroundColor:'rgb(232 239 96 / 67%)', borderRadius:'30px'}}>
                          <div className="table-responsive">
                            <div className="danger" style={{paddingLeft: '10px', paddingBottom:'5px', color: 'black'}}>
                              <h4 className="paddingTop"><u>THRESHOLD LEVEL:</u></h4>
                              <p><strong>Voltage level : </strong> Input under voltage - 175V and below. &nbsp;&nbsp;&nbsp;Input over voltage - 270V and above.</p>
                              <p><strong>Current :</strong> Over Current - 33A.</p>
                              <p><strong>Frequency :</strong> Under frequency - 47HZ. &nbsp;&nbsp;&nbsp;Over frequency - 53HZ.</p>
                              <p><strong>Temperature :</strong> Low Temperature - 0 °C. &nbsp;&nbsp;&nbsp; High Temperature - 58 °C.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </blockquote>
        </div>
        {/* Charger status Section stop*/}
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
        {showAlertLoding &&  (
          <div className="alert-overlay-loding">
            <div className="alert-loding success alerts" style={{width:'200px', textAlign:'center', padding:"20px"}}>
              <div class="spinner-border text-success" role="status" style={{fontSize:'20px'}}>
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}
        {/* Loding alert */}

        {/* Alert charger update Session Price To User start*/}
        {showAlert && (
          <div className="alert-overlay">
            <div className="alert success alerts showAlert" style={{borderRadius:'25px'}}>
              <span className="alertClose" onClick={handleCloseAlert}>X</span>
              <div className="mb-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-success" width="55" height="55"  fill="currentColor"  viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-color">Charging Done !</h2>
                <div className="row text-padding"> 
                  <div className="col-sm-6">
                    <span className="alertText"><strong>ChargerID</strong></span>
                    <p>{chargingSession.ChargerID}</p>
                  </div>
                  <div className="col-sm-6">
                    <span className="alertText"><strong>Start Time</strong></span>
                    <p>{chargingSession.StartTimestamp && new Date(chargingSession.StartTimestamp).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})}</p>
                  </div>
                  <div className="col-sm-6">
                    <span className="alertText"><strong>Stop Time</strong></span>
                    <p>{chargingSession.StopTimestamp && new Date(chargingSession.StopTimestamp).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})}</p>
                  </div>
                  <div className="col-sm-6">
                    <span className="alertText"><strong>Unit Consumed</strong></span>
                    <p>{chargingSession.Unitconsumed}</p>
                  </div>
                  <div className="col-sm-6">
                    <span className="alertText"><strong>Charging Price</strong></span>
                    <p className="text-color"><strong>{chargingSession.price}</strong></p>
                  </div>
                  <div className="col-sm-6">
                    <span className="alertText"><strong>Available Balance</strong></span>
                    <p>{updatedUser.walletBalance}</p>
                  </div>
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

export default Charging;
