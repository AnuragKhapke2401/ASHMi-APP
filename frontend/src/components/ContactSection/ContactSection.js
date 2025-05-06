import React from 'react';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <section className="contact-full">
      <h2>Contact Us</h2>
      <p className="contact-subtitle">We’d love to hear from you!</p>

      <div className="contact-rows">
        <div className="contact-item">
          <div className="contact-icon"><i className="fas fa-envelope"></i></div>
          <a href="mailto:info@travelease.com">info@travelease.com</a>
        </div>
        <div className="contact-item">
          <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
          <a href="tel:+919876543210">+91 98765 43210</a>
        </div>
        <div className="contact-item">
          <div className="contact-icon"><i className="fab fa-instagram"></i></div>
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">@travelease</a>
        </div>
        <div className="contact-item">
          <div className="contact-icon"><i className="fab fa-facebook-f"></i></div>
          <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">Facebook Page</a>
        </div>
        <div className="contact-item">
          <div className="contact-icon"><i className="fab fa-whatsapp"></i></div>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
