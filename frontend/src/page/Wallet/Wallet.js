/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect  } from 'react';
import Footer from '../../components/Footer/Footer'
import { useHistory } from 'react-router-dom';
import "./Wallet.css";
const Wallet = ({ userInfo, handleLogout ,fetchWallletBal, walletBalance}) => {
    const Username = userInfo.username;
    const history = useHistory();
    // Get user wallet balance

    useEffect(() => {
        fetchWallletBal(Username);
      }, [Username]);
    
return (
    <div className="main">
        <div className="header fixed-top pt-3 pb-3 bg-light">
            <div className="arrow-icon" onClick={() => history.goBack()}>
                <i className="fa-solid fa-arrow-left ml-4 mt-1"></i>
            </div>
            <div className="profile-title">
                <h3><b>My Wallet</b></h3>
            </div>
        </div>
        <div className="fluid w-100 mt-5">
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card bg-light shadow">
                        <div className="card-content">
                            <div className="card-body clearfix">
                                <div className="row">
                                    <div className="media align-items-stretch">
                                        <div className="col-md-6">
                                            <div className="align-self-center">
                                                {/* <h3 className="mr-2">Rs. 5000</h3> */}
                                                {walletBalance !== null ? (
                                                    <h4 className="mt-1"><b>Rs. {walletBalance}</b></h4>
                                                    ) : (
                                                    <h4>Loading..</h4>
                                                    )}
                                                <h5>Balance</h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="align-self-left">
                                                <i className="fas fa-wallet fa-3x p- ml-3 pl-5 pb-2 "></i>
                                            </div>
                                        </div>                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 custom-container"> 
                <h3 className="card-title ml-1"><b>Recharge</b><i className="fa-solid fa-money-check-dollar ml-2 "></i></h3>          
                <form action="http://122.166.210.142:8052/pay" method="get" className="d-flex flex-column mt-4">
                    <div className="d-flex justify-content-center">
                    <button type="submit" value="500" name="amount" className="button-45 mr-2">Rs.500</button>
                    <button type="submit" value="1000" name="amount" className="button-45 mr-2">Rs.1000</button>
                    <button type="submit" value="2000" name="amount" className="button-45">Rs.2000</button>
                    </div>
                    <input type="hidden" name="RCuser" value={Username} /></form>
                <form action="http://122.166.210.142:8052/pay" method="get" className="d-flex flex-column" style={{ paddingTop: '10px' }}>
                    <div className="d-flex justify-content-center">
                    <input type="number" min="500" name="amount" className="form-control inputBorder text-center" placeholder="Enter Amount" required />&nbsp;
                    <button type="submit" className="button-br btn btn-outline-success">Submit</button>
                    </div>
                    <input type="hidden" name="RCuser" value={Username} />
                </form>
            </div>
            <div className="mt-5 custom-container"> 
            <h3 className="card-title ml-1"><b>History</b><i className="fa-solid fa-clock-rotate-left ml-2" style={{ fontSize: '1.3rem' }}></i></h3>
            </div>
        </div>

        {/* Footer */}
        <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
)
};

export default Wallet;
