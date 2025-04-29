import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onLoginClick, user, authLoading, onLogout, onViewBookings, onViewProfile }) => { 
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-content">
        <div className="logo">
          <span className="logo-main">ASHMiT</span>
          <span className="logo-sub">Car Rental & Tours</span>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </div>

        <ul ref={menuRef} className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#cars">Cars</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>

          <li className="profile-menu-container">
            {!authLoading && (
              user ? (
                <div className="profile-icon" onClick={toggleProfileMenu}>
                  <FaUserCircle size={30} color="white" />
                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      {/* View Profile Button */}
                      <button onClick={onViewProfile}>View Profile</button>

                      {/* View Bookings Button */}
                      <button onClick={onViewBookings}>View Bookings</button>

                      {/* Logout Button */}
                      <button onClick={onLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={onLoginClick} className="login-btn">Login</button>
              )
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
