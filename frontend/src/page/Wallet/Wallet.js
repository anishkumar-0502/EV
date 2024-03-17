/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Footer from '../../components/Footer/Footer'
import { useHistory } from 'react-router-dom';

const Wallet = ({ userInfo, handleLogout ,children}) => {
    const history = useHistory();

return (
    <div className="main">
    <div className="header">
    <div className="arrow-icon" onClick={() => history.goBack()}>
        <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="profile-title">
        <h3>Wallet</h3>
        </div>
    </div>



                {/* Footer */}
                <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
)
};

export default Wallet;
