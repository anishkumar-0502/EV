/* eslint-disable no-unused-vars */
/* eslint-disable strict */
/* eslint-disable no-lone-blocks */
import React, { useState, useEffect  } from 'react';
import "./App.css"
import { BrowserRouter as Router, Route, Redirect, useHistory  } from 'react-router-dom'; // Import useHistory
import Login from './page/Auth/Login/Login';
import register from './page/Auth/Register/Register';
import Home from './page/Home';
import Wallet from './page/Wallet/Wallet';
import History from './page/History/History';
import Profile from './page/Profile/Profile';
import Settings from './page/Profile/Settings/Settings';
import Help from './page/Profile/Help/Help';
import Charging from './page/ChargeingSession/Charging';

const App = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const [loggedIn, setLoggedIn] = useState(!!storedUser);
  const [ChargerID, setSearchChargerID] = useState('');
  const [userInfo, setUserInfo] = useState(storedUser || {});
  const [initialLoad, setInitialLoad] = useState(false);
  const Username = userInfo.username;

  useEffect(() => {
    setInitialLoad(true);
  }, []);

  const handleLogin = (data, username) => {
    setUserInfo({ username });
    setLoggedIn(true);
    sessionStorage.setItem('user', JSON.stringify({ username }));
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserInfo({});
    sessionStorage.removeItem('user');
  };
  
    // Search charger Id
    const handleSearchRequest = async (e,searchChargerID) => {
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
              if(searchChargerID){
                return searchChargerID;
              }
          } else {
              const errorData = await response.json();
              alert(errorData.message);
          }
      } catch (error) {
          alert(error);
      }
  };
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);

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

    const [walletBalance, setWalletBalance] = useState(null);

  // Get user wallet balance
  const fetchWallletBal = async (Username) => {
    try {
      const response = await fetch(`/GetWalletBalance?username=${Username}`);
      const data = await response.json();
      setWalletBalance(data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };
    
  // Function to handle the "Back" button click
  async function handleSearchBox(ChargerID) {
    setSearchChargerID('');
    stopTimeout();
    await EndChargingSession(ChargerID);
  }

  return (
    <Router>
      {/* Login Route */}
      <Route exact path="/">
          {loggedIn ? <Redirect to="/Home" /> : <Login handleLogin={handleLogin}  userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} />}
        </Route>
        <Route  path="/register" component={register} />

      {/* Home route */}
      <Route path="/Home">
        {loggedIn ? (
          initialLoad ? (
            <Home userInfo={userInfo} handleLogout={handleLogout} setSearchChargerID={setSearchChargerID} handleSearchRequest={handleSearchRequest}/>
          ) : (
            <Home userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} handleSearchRequest={handleSearchRequest}/>
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route path="/Charging">
        {loggedIn ? (
          initialLoad ? (
            <Charging EndChargingSession={EndChargingSession} userInfo={userInfo} handleLogout={handleLogout} isTimeoutRunning={isTimeoutRunning} handleSearchBox={handleSearchBox} stopTimeout={stopTimeout} startTimeout={startTimeout} fetchWallletBal={fetchWallletBal}/>
          ) : (
            <Charging EndChargingSession={EndChargingSession} userInfo={userInfo} ChargerID={ChargerID} handleLogout={handleLogout} setInitialLoad={setInitialLoad} isTimeoutRunning={isTimeoutRunning} handleSearchBox={handleSearchBox} stopTimeout={stopTimeout} startTimeout={startTimeout} fetchWallletBal={fetchWallletBal}/>
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>

      {/* Wallet Route */}
      <Route path="/Wallet">
        {loggedIn ? (
          initialLoad ? (
            <Wallet userInfo={userInfo} handleLogout={handleLogout} walletBalance={walletBalance} fetchWallletBal={fetchWallletBal} />
          ) : (
            <Wallet userInfo={userInfo} ChargerID={ChargerID} handleLogout={handleLogout} setInitialLoad={setInitialLoad}  walletBalance={walletBalance} fetchWallletBal={fetchWallletBal}/>
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      {/* History Route */}
      <Route  path="/History" component={History} />
      
      {/* Profile Route */}
      <Route path="/Profile">
        {loggedIn ? (
          initialLoad ? (
            <Profile userInfo={userInfo} handleLogout={handleLogout}  handleSearchRequest={handleSearchRequest}/>
          ) : (
            <Profile userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} handleSearchRequest={handleSearchRequest} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route path="/settings" >
        {loggedIn ? (
          initialLoad? (
            <Settings userInfo={userInfo}  />
          ) : (
            <Settings userInfo={userInfo} setInitialLoad={setInitialLoad} />
          )
          ) : (
            <Redirect to="/" />
        )
          }
      </Route>
      <Route path="/help" >
        {loggedIn ? (
          initialLoad? (
            <Help userInfo={userInfo}  />
          ) : (
            <Help userInfo={userInfo} setInitialLoad={setInitialLoad} />
          )
          ) : (
            <Redirect to="/" />
        )
          }
      </Route>

      </Router>
  );
};

export default App;
