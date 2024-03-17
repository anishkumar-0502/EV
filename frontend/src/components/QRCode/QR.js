import React, { useEffect } from 'react';
import {Html5QrcodeScanner} from 'html5-qrcode';
import  './style.css';
const QRCodeScanner = () => {
    useEffect(() => {
        const domReady = (fn) => {
            if (
                document.readyState === "complete" ||
                document.readyState === "interactive"
            ) {
                setTimeout(fn, 1000);
            } else {
                document.addEventListener("DOMContentLoaded", fn);
            }
        };

        domReady(() => {
            // If found your qr code
            const onScanSuccess = (decodeText, decodeResult) => {
                alert("Your QR code is: " + decodeText);
            };

            const htmlScanner = new Html5QrcodeScanner(
                "my-qr-reader",
                { fps: 10, qrbox: 250 } // Fixed typo in 'qrbos' to 'qrbox'
            );
            htmlScanner.render(onScanSuccess);
        });
    }, []);

    return (
        <div className="container">
            <h1>Scan QR Codes</h1>
            <div className="section">
                <div id="my-qr-reader"></div>
            </div>
        </div>
    );
};

export default QRCodeScanner;
