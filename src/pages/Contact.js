import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="container-contact">
      <div className="contact-form-container">
        <div className="text-container">
          <h1 className="main-title">Contact Us</h1>
        </div>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScdOJjiaFYN11A_Q7mbCHkdcMTnlukD3p7WA1HopY7ZSFN08g/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
};

export default Contact;
