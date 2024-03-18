import React from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../../../components/Footer/Footer';

const Help = ({ userInfo ,handleLogout}) => {
  const history = useHistory();

  return (
    <div className="main">
      <div className="header fixed-top pt-3 pb-3 bg-light">
        <div className="arrow-icon" onClick={() => history.goBack()}>
          <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
        </div>
        <div className="profile-title">
          <h3><b>Help</b></h3>
        </div>
      </div>
      <div className="main-content position-fixed bg-light">
        <div className="container">
          <div className="row ">
            <div className="col-md-8">
              <div className="card bg-light p-4 shadow">
                <h3 className="text-center mb-4">Need help? Contact us!</h3>
                <p className="text-center mb-4">If you require assistance or have any questions, feel free to reach out to us via email or WhatsApp.</p>
                <div className="row">
                  <div className="col-sm-6">
                    <h6>Email-ID:</h6>
                    <p className="mb-0"><a href="mailto:evpower@gmail.com" className="mail">evpower[at]gmail.com</a></p>
                  </div>
                  <div className="col-sm-6">
                    <h6>WhatsApp Number:</h6>
                    <p className="mb-0">95959XXXXX</p>
                  </div>
                </div>
                <p className="text-center mt-4">We're here to help you!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
  );
  
};

export default Help;
