import React from 'react';
import './Translate.css';

const Translate = () => {
    return (
        <div className="translate-page">
            <h1 className="translate-title">Translate</h1>
            <div className="translate-container">
                {/* First box with language dropdown */}
                <div className="translate-box">
                    <select className="language-dropdown">
                        <option value="en">English</option>
                        <option value="ro">French</option>
                        {/* Add more options for other languages */}
                    </select>
                    <textarea placeholder="Enter text to translate..." />
                </div>
                {/* Second box with language dropdown */}
                <div className="translate-box">
                    <select className="language-dropdown">
                        <option value="ro">English</option>
                        <option value="rn">French</option>
                        {/* Add more options for other languages */}
                    </select>
                    <textarea placeholder="Enter text to translate..." />
                </div>
            </div>
            <button className="translate-button">Translate</button>
        </div>
    );
};

export default Translate;
