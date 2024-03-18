import React from 'react';
import { useHistory } from 'react-router-dom';
import profile from '../../assets/images/faces/profile.jpg';
import './Profile.css';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

const Profile = ({ userInfo,handleLogout ,setSearchChargerID}) => {
    const ChargerID = setSearchChargerID;
    const history = useHistory();
    const Username = userInfo.username;
    
    const navigatesettings = async (e,userInfo) => {
      e.preventDefault();
      history.push('./settings' ,{Username})
    }

    // Logout server and client side
    const handleLogouts = async () => {
      try {
        if(ChargerID){
          const response = await fetch('/LogoutCheck', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({ChargerID: ChargerID}),
            });
     
            if (response.ok) {
              handleLogout()
            }
        }else(
          handleLogout()
        )
  
        } catch (error) {
          alert(error);
        }
    };

  return (
    <div className="main">
            <div className="header fixed-top pt-3 pb-3 bg-light">
            <div className="arrow-icon" onClick={() => history.goBack()}>
                <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
            </div>
            <div className="profile-title">
                <h3><b>Profile</b></h3>
            </div>
        </div>

      <div className="subcontainer mt-5">
        <div className="profile">
          <div className="img">
            <img src={profile} alt="profile" />
          </div>
          <div className="details">
            <h2>{userInfo.username}</h2>
          </div>
        </div>

        <div className="wallet-container mt-4">
          <div className="cards">
            <div className="card1">
              <i className="fa-solid fa-wallet" />
              <span> Wallet</span>
            </div>
            <div className="card2">
                <i className="fa-solid fa-clock-rotate-left"></i>
              <span> Session</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="sections">
          <div className="section1">
            <Link to="/settings">
            <i className="fa-solid fa-gear" onClick={() => navigatesettings({Username})}> </i>
              <span> Settings</span>
            </Link>
          </div>
          <div className="section2">
            <Link to="/help">
              <i className="fa-solid fa-circle-info"> </i>
              <span>Help</span>
            </Link>
          </div>
          <div className="section3">
            <Link to="/" onClick={() => handleLogouts(ChargerID)}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span style={{color:"red"}}>Logout</span>
            </Link>
          </div>
        </div>
      </div>
        {/* Footer */}
        <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
  );
};

export default Profile;
