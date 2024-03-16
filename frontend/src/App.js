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

  const [userInfo, setUserInfo] = useState(storedUser || {});
  const [initialLoad, setInitialLoad] = useState(false);

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
            <Home userInfo={userInfo} handleLogout={handleLogout}/>
          ) : (
            <Home userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route path="/Charging">
        {loggedIn ? (
          initialLoad ? (
            <Charging userInfo={userInfo} handleLogout={handleLogout}/>
          ) : (
            <Charging userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route  path="/Wallet" component={Wallet} />
      <Route  path="/History" component={History} />
      <Route  path="/Profile" component={Profile} />
    </Router>
  );
};

export default App;
