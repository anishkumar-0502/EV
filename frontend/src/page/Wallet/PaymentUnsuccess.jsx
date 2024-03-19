import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const PaymentUnsuccess  = () => {
  const [paymentMessage, setPaymentMessage] = useState('');

  // Payment unsuccess message
  useEffect(() => {
    const message = Cookies.get('message');
    setPaymentMessage(message);

  }, []);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div>
        <div className="mb-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white bg-danger" width="75" height="75" fill="currentColor" viewBox="0 0 16 16" style={{ borderRadius: "50%" }}>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
        <div className="text-center">
          <h3><b>Payment Unsuccessful !</b></h3>
          <p className='mt-3'>Payment amount not added to your wallet.</p>
          <p className='mt-3'>{paymentMessage || "No Payment Data"}</p>
          <div className="d-flex justify-content-center mt-4">
              <Link to="/Wallet">
                  <button className="button-45 border-0">Go Back</button>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentUnsuccess


