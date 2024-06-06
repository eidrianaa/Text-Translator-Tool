import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import logo from './logo.jpg';
import './Navbar.css';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const Navbar = ({ isAuthenticated }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(true);
    };

    const toggleLightMode = () => {
        setIsDarkMode(false);
    };

    const modeClass = isDarkMode ? 'dark-mode' : 'light-mode';

    return (
        <nav className={`app__navbar ${modeClass}`}> 
            <div className="app__navbar-logo">
                <img src={logo} alt="app logo" style={{width: '70px'}}/>
            </div>
            <ul className="app__navbar-links">
                <li className="p__opensans"><Link to="/home">Home</Link></li>
                <li className="p__opensans"><Link to="/translateform">Translate</Link></li>
                <li className="p__opensans"><Link to="/contact">Contact</Link></li>
                <li className="p__opensans"><Link to="/history">History</Link></li>

            </ul>
            {isDarkMode ? (
                <MdDarkMode color="#fff" fontSize={27} onClick={toggleLightMode} />
            ) : (
                <MdLightMode color={isDarkMode ? '#fff' : '#000'} fontSize={27} onClick={toggleDarkMode} />
            )}
            <div className="app__navbar-login">
                {isAuthenticated ? (
                    <span className="p__opensans">Logged in as User</span>
                ) : (
                    <>
                        <Link to="/login" className="p__opensans">Log in</Link> / <Link to="/register" className="p__opensans">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
