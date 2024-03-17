/* eslint-disable no-unused-vars */
/* eslint-disable strict */
/* eslint-disable no-lone-blocks */
import React, { useState, useEffect  } from 'react';
import "./App.css"
import { BrowserRouter as Router, Route,  Redirect } from 'react-router-dom'; // Import Redirect
import Login from './page/Auth/Login/Login';
import register from './page/Auth/Register/Register';
import Home from './page/Home';
import Wallet from './page/Wallet/Wallet';
import History from './page/History/History';
import Profile from './page/Profile/Profile';

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
  return (
    <Router>
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
            <Charging userInfo={userInfo} handleLogout={handleLogout} />
          ) : (
            <Charging userInfo={userInfo} ChargerID={ChargerID} handleLogout={handleLogout} setInitialLoad={setInitialLoad} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route  path="/Wallet" component={Wallet} />
      <Route  path="/History" component={History} />
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
      </Router>
  );
};

export default App;
