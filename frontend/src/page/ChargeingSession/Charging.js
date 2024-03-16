/* eslint-disable default-case */
import React  from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const Charging = ({ userInfo, handleLogout, children }) => {
    
    const history = useHistory();

    return (
        <div className="container-fluid">

            <div className="row">
 
            <nav className="navbar container-fluid navbar-expand-lg navbar-light bg-none shadow-none p-none fixed-top "> 
                    <button
                        className="btn  text-dark mt-4 shadow"
                        onClick={() => history.goBack()}
                    >Go Back</button>
                </nav>
                {/* Main content */}
                <main role="main" className="col-md-9 ml-sm-auto mr-auto col-lg-9 px-md-4 bg-white  content-wrapper">
                
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap bg-white align-items-center pt-3 pb-2 mb-3 ">
                        <div className="container">

                        </div>
                    </div>
                    {children}
                </main>

                {/* Footer */}
                <Footer userInfo={userInfo} handleLogout={handleLogout} />
            </div>
        </div>
    );
};

export default Charging;
