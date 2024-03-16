import React, { useState, useRef } from 'react';
import './Login.css'; // Assuming Login.css is the CSS file for this component
import logo from '../../../assets/images/EV_Logo2.png';
import Swal from 'sweetalert2';



const Login = ({ handleLogin }) => {
  const [loginUsername, setUsername] = useState('');
  const [loginPasswords, setLoginPassword] = useState(['', '', '', '']);
  const inputRefs = useRef(Array.from({ length: 4 }, () => React.createRef()));
  const loginPassword = loginPasswords.join('');

  function LogError(Message){
    Swal.fire({
        title: "Login failed", 
        text: Message,
        icon: "error",
        customClass: {
            popup: 'swal-popup-center', // Center the entire popup
            icon: 'swal-icon-center',   // Center the icon within the popup
        },
    });
}
  // password pin change
  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newPasswords = [...loginPasswords];
      newPasswords[index] = value;
      setLoginPassword(newPasswords);

      if (value === '' && index > 0) {
        inputRefs.current[index - 1].current.focus(); // Move focus backward when deleting a digit
      } else if (index < inputRefs.current.length - 1 && value !== '') {
        inputRefs.current[index + 1].current.focus(); // Move focus forward when entering a digit
      }
    }
  };
  
    // Check login credentials
    const handleLoginRequest = async (e) => {
      e.preventDefault();
  
      // Validation for user name
      const processedLoginUsername = loginUsername.replace(/\s+/g, '_');
  
      // Validation for password (4-digit number)
      const passwordPattern = /^\d{4}$/;
  
      if (processedLoginUsername !== loginUsername) {
        let setMessage ='User Name should not contain spaces. eg: kesav_d';
        LogError(setMessage);
        return false;   
      }
  
      if (!passwordPattern.test(loginPassword)) {
        let setMessage ='Password must be a 4-digit number';
        LogError(setMessage);
        return false;   
      }
  
      try {
          const response = await fetch('/CheckLoginCredentials', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ loginUsername: processedLoginUsername, loginPassword }),
          });
  
          if (response.ok) {
              const data = await response.json();
              handleLogin(data, processedLoginUsername);
          } 
      } catch (error) {
        Swal.fire({
          position: " top-center",
          icon: "error",
          title: "Login failed",
          text: "Invalid Credentials",
          customClass: {
              popup: 'swal-popup-center', // Center the entire popup
              icon: 'swal-icon-center',   // Center the icon within the popup
          },
      });      }
  };

  // Check login credentials
  // const handleLoginRequest = async (e) => {
  //   e.preventDefault();

  //   // Validation for user name
  //   const processedLoginUsername = loginUsername.replace(/\s+/g, '_');
  //   // Validation for password (4-digit number)
  //   const passwordPattern = /^\d{4}$/;

  //   if (processedLoginUsername !== loginUsername) {
  //     let setMessage ='User Name should not contain spaces. eg: kesav_d';
  //     LogError(setMessage);
  //     return false;   
  //    }

  //   if (!passwordPattern.test(loginPasswords.join(''))) {
  //     let setMessage ='Password must be a 4-digit number';
  //     LogError(setMessage);
  //     return false;    }

  //   try {
  //     const response = await axios.post('/CheckLoginCredentials', {
  //       loginUsername: processedLoginUsername,
  //       loginPassword: loginPasswords.join(''),
  //     });

  //     if (response.status === 200) {
  //       console.log(response.data, processedLoginUsername);
  //       history.push('/Home')
  //     } 
  //   } catch (error) {
  //     Swal.fire({
  //       position: " top-center",
  //       icon: "error",
  //       title: "Login failed",
  //       text: "Invalid Credentials",
  //       customClass: {
  //           popup: 'swal-popup-center', // Center the entire popup
  //           icon: 'swal-icon-center',   // Center the icon within the popup
  //       },
  //   });
  // }
  // };

  return (
    <div className="container">
      <div className="login">
        <div className="content">
          <div className="log-on border_insc">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <form onSubmit={handleLoginRequest}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  placeholder="Username"
                  required
                  value={loginUsername}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="password-container">
                  {loginPasswords.map((_, index) => (
                    <input
                      key={index}
                      ref={inputRefs.current[index]}
                      type="password"
                      className="form-control"
                      name={`password${index + 1}`}
                      id={`password${index + 1}`}
                      value={loginPasswords[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      style={{ textAlign: 'center', width: '50px' }}
                      maxLength={1}
                      autoComplete="off"
                      required

                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="log_btn" style={{ borderRadius: "10px" }}>
                Sign in
              </button>
            </form>
          </div>
          <div className="sing-up border_insc" style={{ textAlign: 'center' }}>
            <p>
              New User?
              <a href="./register">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
