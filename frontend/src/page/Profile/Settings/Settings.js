import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Profile.css';
import Footer from '../../../components/Footer/Footer';

const Settings = ({ userInfo ,handleLogout}) => {
  const history = useHistory();
  const Username = userInfo.username;

  const [userName, setUserName] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userPass, setUserPass] = useState(null);
  const [otpFields, setOtpFields] = useState(['', '', '', '']);
  const [profileMessage,] = useState(null);

  useEffect(() => {
    // Fetch user details when the component mounts
    fetchUserDetails(Username);
  }, [Username]);

  // Function to fetch user details
  const fetchUserDetails = async (Username) => {
    try {
      const response = await fetch(`/getUserDetails?username=${Username}`);
      if (response.ok) {
        const data = await response.json();
        setUserName(data.value.username);
        setUserPhone(data.value.phone);
        setUserPass(data.value.password);
      } else {
        throw new Error('Error fetching user details');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  // Function to handle changes in OTP fields
  const handleOtpChange = (index, value) => {
    // Ensure input is a digit
    if (/^\d$/.test(value)) {
      const newOtpFields = [...otpFields];
      newOtpFields[index] = value;
      setOtpFields(newOtpFields);
      setUserPass(newOtpFields.join(''));

      // Move focus to the next input field
      if (index < otpFields.length - 1) {
        document.getElementById(`otpField${index + 1}`).focus();
      }
    } else if (value === '') {
      // If value is empty, remove digit
      const newOtpFields = [...otpFields];
      newOtpFields[index] = '';
      setOtpFields(newOtpFields);
      setUserPass(newOtpFields.join(''));

      // Move focus to the previous input field
      if (index > 0) {
        document.getElementById(`otpField${index - 1}`).focus();
      }
    }
  };

  useEffect(() => {
    // Ensure userPass has exactly 4 digits
    if (userPass !== null && userPass.length === 4 && /^\d+$/.test(userPass)) {
      setOtpFields(userPass.split(''));
    }
  }, [userPass]);

  // Function to handle user details update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = {
      updateUsername: userName, // Get username directly from state
      updatePhone: userPhone, // Get user phone directly from state
      updatePass: otpFields.join(''), // Get password from OTP fields
    };

    // Array to store error messages
    const errors = [];

    // Validation for username
    const formattedUsername = updatedData.updateUsername.replace(/\s+/g, '_');
    if (formattedUsername !== updatedData.updateUsername) {
      errors.push('Username should not contain spaces, e.g., kesav_d');
    }

    // Validation for password (4-digit number)
    const passwordPattern = /^\d{4}$/;
    if (!passwordPattern.test(updatedData.updatePass)) {
      errors.push('Password must be a 4-digit number');
    }

    // Validation for phone number (10 digits)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(updatedData.updatePhone)) {
      errors.push('Phone number must be a 10-digit number');
    }

    if (errors.length > 0) {
      // If there are errors, show them in SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: errors.map(error => `<p>${error}</p>`).join(''),
      });
      return;
    }

    try {
      const response = await fetch('updateUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        // Show SweetAlert2 success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
        });
      } else {
        throw new Error('Error in updating , kindly check the credentials');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  return (
    <div className="main">
            <div className="header fixed-top pt-3 pb-3 bg-light">
            <div className="arrow-icon" onClick={() => history.goBack()}>
                <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
            </div>
            <div className="profile-title">
                <h3><b>Settings</b></h3>
            </div>
        </div>
      <div className="form mt-5" >

        {/* new form */}
        <form className="contact-form row" onSubmit={handleUpdate}>
          <div className="form-field col-lg-6"  style={{marginTop:"0px"}}>
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" id="username" name="updateUsername" className="input-text js-input" style={{borderColor:"lightgrey"}} value={userName || ''} readOnly required />
          </div>
          <div className="form-field col-lg-6"  style={{marginTop:"0px"}}>
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input type="text" id="phoneNumber" name="updatePhone" className="input-text js-input"  style={{borderColor:"lightgrey"}} value={userPhone || ''} onChange={(e) => setUserPhone(e.target.value)} required />
          </div>
          <div className="form-field col-lg-6"  style={{marginTop:"0px"}}>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="otp-field mb-4">
              {otpFields.map((digit, index) => (
                <input
                  style={{ textAlign: "center" , borderColor:"lightgrey" }}
                  key={index}
                  id={`otpField${index}`}
                  type="text"
                  className="input-text js-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength="1"
                />
              ))}
            </div>
          </div>
          <div className="form-field col-lg-12 d-flex flex-column align-items-center"  style={{marginTop:"0px"}}>
            <div id="validationMessage" className="text-danger mb-2"></div>
            <button type="submit" className="log_btn" style={{Color:"#007bff" , borderRadius:"20px"}}>Update</button>
          </div>
        </form>
        {profileMessage && (
          <div className="alert alert-danger" role="alert">
            {profileMessage}
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
  );
};

export default Settings;
