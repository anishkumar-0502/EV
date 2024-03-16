import React, { useRef, useState } from 'react';
import './Register.css'; // Assuming Register.css is the CSS file for this component
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../../../assets/images/EV_Logo2.png';

const Register = () => {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPasswords, setRegisterPasswords] = useState(['', '', '', '']);
  const history = useHistory();
  const passwordRefs = useRef(Array.from({ length: 4 }, () => React.createRef()));
  function RegError(Message){
    Swal.fire({
        title: "SignUp failed", 
        text: Message,
        icon: "error",
        customClass: {
            popup: 'swal-popup-center', // Center the entire popup
            icon: 'swal-icon-center',   // Center the icon within the popup
        },
    });
}
  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newPasswords = [...registerPasswords];
      newPasswords[index] = value;
      setRegisterPasswords(newPasswords);

      if (value === '' && index > 0) {
        passwordRefs.current[index - 1].current.focus();
      } else if (index < passwordRefs.current.length - 1 && value !== '') {
        passwordRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formattedUsername = registerUsername.replace(/\s+/g, '_');
    const passwordPattern = /^\d{4}$/;
    const phonePattern = /^\d{10}$/;

    if (!/^[a-zA-Z]+$/.test(registerUsername)) {
      let setMessage ="Username must contain only capital and small alphabets";
      RegError(setMessage);
      return false;
    }

    if (formattedUsername !== registerUsername) {
      let setMessage ="Username should not contain spaces. Example: kesav_d";
      RegError(setMessage);
      return false;    }

    if (!phonePattern.test(registerPhone)) {
      let setMessage ="Phone number must be a 10-digit number";
      RegError(setMessage);
      return false;    }

    if (!passwordPattern.test(registerPasswords.join(''))) {
      let setMessage = "Password must be a 4-digit number";
      RegError(setMessage);
      return false;    }

    try {
      const response = await axios.post('http://192.168.1.13:8052/RegisterNewUser', {
        registerUsername: formattedUsername,
        registerPhone,
        registerPassword: registerPasswords.join(''),
      });
      console.log(response.data);
      history.push('/');
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "SignUp failed", 
        text: error,
        customClass: {
            popup: 'swal-popup-center', // Center the entire popup
            icon: 'swal-icon-center',   // Center the icon within the popup
        },
    });    }
  };

  return (
    <div className="container">
      <div className="login">
        <div className="content">
          <div className="log-on border_insc">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  placeholder="Username"
                  required
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number"
                  required
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="password-container">
                  {passwordRefs.current.map((ref, index) => (
                    <input
                      key={index}
                      ref={ref}
                      type="password"
                      className="form-control"
                      name="password"
                      id={`password${index + 1}`}
                      onChange={(e) => handleChange(index, e.target.value)}
                      style={{ textAlign: 'center', width: '50px' }}
                      maxLength={1}
                      autoComplete="off"
                      required

                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="log_btn" style={{ borderRadius: '10px' }}>
                Sign up
              </button>
            </form>
          </div>
        </div>
        <div className="sing-up border_insc">
          <p>
            Already a User?
            <a href="./">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;