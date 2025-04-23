import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // To reference the navbar menu
  const navbarRef = useRef(null); // To reference the whole navbar (including the hamburger)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the state to open/close menu
  };

  // Close the menu if a click outside of the menu or navbar is detected
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the navbar and the menu
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false); // Close the menu if click is outside the navbar
      }
    };

    // Adding the event listener
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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

        {/* Wrapping the menu in a ref so we can detect clicks outside of it */}
        <ul ref={menuRef} className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#cars">Cars</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><button onClick={onLoginClick} className="login-btn">Login</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
