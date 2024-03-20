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
import SessionDetails from './page/History/SessionDetails';
import Profile from './page/Profile/Profile';
import Settings from './page/Profile/Settings/Settings';
import Help from './page/Profile/Help/Help';
import Charging from './page/ChargingSession/Charging';
import PaymentSuccess from './page/Wallet/PaymentSuccess';
import PaymentUnsuccess from './page/Wallet/PaymentUnsuccess'; 
import swal from 'sweetalert';
import Cookies from 'js-cookie';
const App = () => {
// Retrieve user data from session storage
const storedUserData = localStorage.getItem('user');
// Retrieve user data from cookies
const storedUserCookie = Cookies.get('user');
let storedUser;
// Check if user data exists in session storage
if (storedUserData) {
  storedUser = JSON.parse(storedUserData); // Parse the user data as JSON
}
// Check if user data exists in cookies
else if (storedUserCookie) {
  storedUser = JSON.parse(storedUserCookie); // Directly assign storedUserCookie to storedUser
  console.log("Parsed stored user cookie:", storedUser);
}
// If user data doesn't exist in either storage or cookies
else {
  storedUser = null; // Set storedUser to null
}
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
    localStorage.setItem('user', JSON.stringify({ username }));
    Cookies.set('user', JSON.stringify({ username }), { expires: 7 }); // Store user info in cookies for 7 days
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserInfo({});
    localStorage.removeItem('user');
    Cookies.remove('user');
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
              swal({
                title: 'Error',
                text: errorData.message,
                icon: 'error',
                button: 'OK'
              });
            }
      } catch (error) {
        swal({
          title: 'Error',
          text: error,
          icon: 'error',
          button: 'OK'
        });      }
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
          {loggedIn ? <Redirect to="/Home" /> : <Login handleLogin={handleLogin}  userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} handleSearchBox={handleSearchBox}/>}
        </Route>
        <Route  path="/register" component={register} />

      {/* Home route */}
      <Route path="/Home">
        {loggedIn ? (
          initialLoad ? (
            <Home userInfo={userInfo} handleLogout={handleLogout} setSearchChargerID={setSearchChargerID} handleSearchRequest={handleSearchRequest} handleSearchBox={handleSearchBox}/>
          ) : (
            <Home userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} handleSearchRequest={handleSearchRequest} handleSearchBox={handleSearchBox}/>
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
      <Route path="/History">
        {loggedIn ? (
          initialLoad ? (
            <History userInfo={userInfo} handleLogout={handleLogout}  />
          ) : (
            <History userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      
      {/* SessionDetails Route*/}
      <Route  path="/SessionDetails" >
        {loggedIn? (
          initialLoad? (
            <SessionDetails userInfo={userInfo} handleLogout={handleLogout}  />
          ) : (
            <SessionDetails userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad}  />
          )
          ) : (
            <Redirect to="/" />
          )}
      </Route>
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

      {/* Redirect to PaymentSuccess if logged in, otherwise show Login */}
      <Route path="/PaymentSuccess">
        {loggedIn ? <PaymentSuccess userInfo={userInfo}  handleLogout={handleLogout} /> : <Redirect to="/" />}
      </Route>

      {/* Redirect to PaymentUnsuccess if logged in, otherwise show Login */}
      <Route path="/PaymentUnsuccess">
        {loggedIn ? <PaymentUnsuccess userInfo={userInfo}  handleLogout={handleLogout} /> : <Redirect to="/" />}
      </Route>
      </Router>
  );
};

export default App;
