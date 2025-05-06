import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onLoginClick, user, authLoading, onLogout, onViewBookings, onViewProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    if (menuOpen) {
      setIsAnimating(true);
      navLinks.classList.remove('show');
      navLinks.classList.add('hiding');
      setTimeout(() => {
        navLinks.classList.remove('hiding');
        setIsAnimating(false);
        setMenuOpen(false);
      }, 800); // Match the close transition duration
    } else {
      setMenuOpen(true);
    }
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
        if (menuOpen) toggleMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const handleLinkClick = () => {
    if (menuOpen && !isAnimating) toggleMenu();
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-content">
        <div className="logo">
          <span className="logo-main">ASHMiT</span>
          <span className="logo-sub">Car Rental & Tours</span>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </div>

        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><a href="#home" onClick={handleLinkClick}>Home</a></li>
          <li><a href="#cars" onClick={handleLinkClick}>Cars</a></li>
          <li><a href="#about" onClick={handleLinkClick}>About</a></li>
          <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
          <li><a href="#contact" onClick={handleLinkClick}>Contact</a></li>

          <li className="profile-menu-container">
            {!authLoading && (
              user ? (
                <div className="profile-icon" onClick={toggleProfileMenu}>
                  <FaUserCircle size={30} color="white" />
                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      <button onClick={onViewProfile}>View Profile</button>
                      <button onClick={onViewBookings}>View Bookings</button>
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
