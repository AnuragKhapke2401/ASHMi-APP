import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card animate-up">
            <h3>Car Rentals</h3>
            <p>Choose from a wide variety of cars for every occasion — from economy to luxury.</p>
          </div>
          <div className="service-card animate-up delay-1">
            <h3>Tour Packages</h3>
            <p>Book pre-planned or customizable holiday packages for an effortless travel experience.</p>
          </div>
          <div className="service-card animate-up delay-2">
            <h3>Airport Transfers</h3>
            <p>Reliable and timely pickups/drop-offs to and from the airport, 24/7.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
