/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect  } from 'react';
import Footer from '../../components/Footer/Footer'
import { useHistory } from 'react-router-dom';
import "./Wallet.css";
import { Row, Col } from 'react-bootstrap';

const Wallet = ({ userInfo, handleLogout ,fetchWallletBal, walletBalance}) => {
    const [transactionDetails, setTransactionDetails] = useState('');
    const Username = userInfo.username;
    const history = useHistory();
    // Get user wallet balance

    useEffect(() => {
        fetchWallletBal(Username);
    }, [Username]);
    
    const fetchTransactionDetails = async (Username) => {
    try {
        const response = await fetch(`/getTransactionDetails?username=${Username}`);
        const data = await response.json();
        setTransactionDetails(data.value);
    } catch (error) {
        console.error('Error fetching transaction details:', error);
    }
    };

    useEffect(() => {
        fetchTransactionDetails(Username);
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
                <form action="http://192.168.1.3:8052/pay" method="get" className="d-flex flex-column mt-4">
                    <div className="d-flex justify-content-center">
                    <button type="submit" value="500" name="amount" className="button-45 mr-2">Rs.500</button>
                    <button type="submit" value="1000" name="amount" className="button-45 mr-2">Rs.1000</button>
                    <button type="submit" value="2000" name="amount" className="button-45">Rs.2000</button>
                    </div>
                    <input type="hidden" name="RCuser" value={Username} /></form>
                <form action="http://192.168.1.3:8052/pay" method="get" className="d-flex flex-column contact-form mt-3" style={{ paddingTop: '10px' }}>
                    <div className="d-flex justify-content-center">
                    <input type="number" min="500" name="amount" className="mt-1 input-text js-input col-6 text-center" placeholder="Enter Amount" required />&nbsp;
                    <button type="submit" className="button-46 ml-3">Submit</button>
                    </div>                    
                    <input type="hidden" name="RCuser" value={Username} />
                </form>
            </div>
            <div className="mt-5 custom-container"> 
            <h3 className="card-title ml-1"><b>History</b><i className="fa-solid fa-clock-rotate-left ml-2" style={{ fontSize: '1.3rem' }}></i></h3>
            <Row>
                <Col sm={12}>
                    <div className="card bg-light mt-4  shadow" style={{ width: '100%', borderRadius: '15px' , marginBottom: '80px' }}>
                        <div className="card-body">
                            <div className="row">
                                {Array.isArray(transactionDetails) && transactionDetails.length > 0 ? (
                                    transactionDetails.map((transactionItem, index) => (
                                        <React.Fragment key={transactionItem.index}>
                                            <div className="col-7">
                                                <h4 className="mb-2">
                                                    <b><span className="count">{transactionItem.status ? transactionItem.status : "-"}</span></b>
                                                </h4>
                                                <p className="mb-0" style={{ fontSize: "0.8rem" }}>{transactionItem.time ? new Date(transactionItem.time).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : "-"}</p>
                                            </div>
                                            <div className="col-5 d-flex align-items-center justify-content-end">
                                            <h5 className="mb-4 mt-3" style={{ color: transactionItem.status === 'Credited' ? 'green' : transactionItem.status === 'Deducted' ? 'red' : 'black' }}><b>{transactionItem.amount ? (transactionItem.status === 'Credited' ? "+ Rs. " + transactionItem.amount : transactionItem.status === 'Deducted' ? "- Rs. " + transactionItem.amount : "-") : "-"}</b></h5>
                                            </div>
                                            {index < transactionDetails.length - 1 && (
                                                <div className="col-12">
                                                    <hr style={{ margin: "10px 0" }} />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <div className="col-12 text-center text-dark">
                                        <h4 style={{ marginTop: '10px' }}>No Transaction Found</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        </div>

        {/* Footer */}
        <Footer userInfo={userInfo} handleLogout={handleLogout} />
    </div>
)
};

export default Wallet;
