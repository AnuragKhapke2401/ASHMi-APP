import React from 'react';
import './AboutSection.css';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <h2>About Us</h2>
        <p>
          At <strong>ASHMiT Tours & Travels</strong>, we believe in turning journeys into unforgettable experiences. 
          Whether you're heading for a business trip or a vacation, our reliable car rentals and 
          curated travel services ensure comfort, safety, and satisfaction.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
