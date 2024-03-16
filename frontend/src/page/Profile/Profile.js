import React from 'react';
import profile from '../../assets/images/faces/profile.jpg';
import './Profile.css';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

const Profile = ({ userInfo,handleLogout ,setSearchChargerID}) => {
    const ChargerID = setSearchChargerID;
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
      <div className="header">
        <div className="arrow-icon">
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="profile-title">
         <h3>Profile</h3>
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
                {/* <i class="fa-solid fa-clock-rotate-left"></i> */}
                <i class="fa-solid fa-clock-rotate-left"></i>
              <span> Session</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="sections">
          <div className="section1">
            <Link to="/settings">
              <i className="fa-solid fa-gear"> </i>
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
