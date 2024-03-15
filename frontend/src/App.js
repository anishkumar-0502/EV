/* eslint-disable no-unused-vars */
/* eslint-disable strict */
/* eslint-disable no-lone-blocks */
import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Route,  Redirect } from 'react-router-dom'; // Import Redirect
import Login from './page/Auth/Login';
import register from './page/Auth/Register';
import Home from './page/Home';

const App = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const [loggedIn, setLoggedIn] = useState(!!storedUser);
  const [userInfo, setUserInfo] = useState(storedUser || {});
  const [initialLoad, setInitialLoad] = useState(false); // Define initialLoad state

  const handleLogin = (data) => {
    const {username, phone,email, ...rest } = data;
    setUserInfo({ username,phone,email, ...rest });
    setLoggedIn(true);
    sessionStorage.setItem('user', JSON.stringify({ username,phone,email, ...rest }));
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
        <Route path="/Home">
        {loggedIn ? (
          initialLoad ? (
            <Home userInfo={userInfo} handleLogout={handleLogout} setInitialLoad={setInitialLoad} />
          ) : (
            <Home userInfo={userInfo} handleLogout={handleLogout} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </Route>
        <Route  path="/register" component={register} />
    </Router>
  );
};

export default App;
