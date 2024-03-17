/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import axios from "axios";
import WebSocket from 'ws';

const Charging = ({ userInfo, handleLogout ,ChargerID }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);

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
    const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);

    const history = useHistory();
    const Username = userInfo.username;

    const [socket, setSocket] = useState(null);

    // Effect to handle WebSocket connection
    useEffect(() => {
      // Check if the socket is not already open and ChargerID is provided
      if (!socket && ChargerID) {
        console.log("Websocket")
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
        // handleSearchBox();
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
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // Alert loding function
  const [showAlertLoding, setShowAlertLoding] = useState(false);

  const handleAlertLodingStart = () => {
    setShowAlertLoding(true);
  }

  const handleAlertLodingStop = () => {
    setShowAlertLoding(false);
  }

  // Get table data
  useEffect(() => {
    // Define the API URL based on the event detail
    const url = `/GetAllChargerDetails`;
    axios.get(url).then((res) => {
        setData(res.data.value);
        setLoading(false);
    })
       .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Error fetching data. Please try again.');
        setLoading(false);
      });
  }, []);

  // View data
  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (dataItem) => {
    // Update state to store the selected item
    setSelectedItem(dataItem);
  };

  
  // Get user details
  const handleUderDetails = (Username) => {
    fetchUserDetails(Username);

  }

  const [userName, setUserUname] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userPass, setUserPass] = useState(null);
  const [otpFields, setOtpFields] = useState(['', '', '', '']);
  const [profileMessage, setProfileMessage] = useState(null);

  const fetchUserDetails = async (Username) => {
    try {
      const response = await fetch(`/getUserDetails?username=${Username}`);
      const data = await response.json();
      setUserUname(data.value.username);
      setUserPhone(data.value.phone);
      setUserPass(data.value.password);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

    useEffect(() => {
  }, [Username]);
  
  // Function to handle changes in OTP fields
  const handleOtpChange = (index, value) => {
    // Ensure input is a digit
    if (/^\d$/.test(value)) {
      const newOtpFields = [...otpFields];
      newOtpFields[index] = value;
      setOtpFields(newOtpFields);
      setUserPass(newOtpFields.join(''));
    } else if (value === '') { // If value is empty, remove digit
      const newOtpFields = [...otpFields];
      newOtpFields[index] = '';
      setOtpFields(newOtpFields);
      setUserPass(newOtpFields.join(''));
    }
  };

  useEffect(() => {
    // Ensure userPass has exactly 4 digits
    if (userPass !== null && userPass.length === 4 && /^\d+$/.test(userPass)) {
      setOtpFields(userPass.split(''));
    }
  }, [userPass]);

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
        {/* Charger status Section start*/}
        <div className="col-md-12" id="statusSection">
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
                                    <div className="card radius_bgColor mt-3">
                                        <div className="card-body"><strong>Voltage : </strong> <span>{voltage}</span></div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="card radius_bgColor mt-3">
                                        <div className="card-body"><strong>Current : </strong> <span>{current}</span></div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="card radius_bgColor mt-3">
                                        <div className="card-body"><strong>Power :</strong> <span>{power}</span></div>
                                    </div>
                                </div>
                                {/* More similar columns */}
                            </div>
                        </div>
                        <div className="container">
                            <div className="row justify-content-around text-center mt-4">
                                <div className="col-12 col-sm-5">
                                    <button type="submit" className="button-br btn btn-outline-success" onClick={handleStartTransaction} disabled={ChargerStatus !== 'Preparing'} id="startTransactionBtn"><b>Start</b></button>
                                </div>
                                <div className="col-12 col-sm-5">
                                    <button type="submit" className="button-br btn btn-outline-danger" onClick={handleStopTransaction} disabled={ChargerStatus !== 'Charging'} id="stopTransactionBtn"><b>Stop</b></button>
                                </div>
                            </div>
                        </div>
                        <div className="text-center paddingTop">
                            <button type="submit" className="button-br btn btn-outline-primary" onClick={toggleTableVisibility}>
                                <span>{isTableVisible ? 'Hide Error History' : 'Show Error History'}</span>
                            </button>
                        </div>
                        {/* Error history table */}
                        {isTableVisible && (
                            <div className="col-lg-12 grid-margin stretch-card paddingTop">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="table-container">
                                            <table className="table table-striped text-center">
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
                                                        historys.map((entry, index) => (
                                                            <tr key={entry.serialNumber}>
                                                                <td>{index + 1}</td>
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

                        {/* Threshold level information */}
                        <div className="col-md-12 grid-margin stretch-card paddingTop">
                            <div className="card" style={{ backgroundColor: 'rgb(232 239 96 / 67%)', borderRadius: '30px' }}>
                                <div className="card-body">
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
            </blockquote>
        </div>
        {/* Footer */}
        <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
);


    };

export default Charging;
