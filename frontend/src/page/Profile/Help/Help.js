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
      <div className="main-content position-fixed ">
        <div className="container">
          <div className="row ">
            <div className="col-md-8 mb-5">
              <div
                className="card bg-light p-4 "
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }}
              >
                <h4
                  className="text-center mb-4"
                  style={{ marginTop: "15px", padding: "2px", color: "green" }}
                >
                  <b>NEED HELP? CONTACT US!</b>
                </h4>
              </div>
              <div
                className="subcontainer"
                style={{
                  textAlign: "left",
                  borderRadius: "20px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="main2 mt-4">
                  <div className="col-sm-12 mt-2">
                    <p>
                      If you require assistance or have any questions, feel free
                      to reach out to us via{" "}
                      <span className="textGreen">email</span> or{" "}
                      <span className="textGreen">WhatsApp</span>.
                    </p>
                  </div>
                  <br />
                  <div className="col-sm-12">
                    <h6>
                      <b>Emai-ID :</b>{" "}
                      <span>
                          evpower@gmail.com
                      </span>
                    </h6>
                  </div>
                  <div className="col-sm-12">
                    <h6>
                      <span>
                        <b>WhatsApp Number : </b>95959XXXXX
                      </span>
                    </h6>
                  </div>
                  <br />
                  <div className="col-sm-12">
                    <p>We're here to help you!</p>
                  </div>
                </div>
                <div className="img mt-5" style={{ width: "100px" }}></div>
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
