import React from 'react';
import './CarSection.css';
import swiftImage from '../../assets/swift.jpg'; // Replace with your actual car images

const cars = [
  { name: 'Swift Dzire', desc: 'Comfortable & fuel-efficient sedan.', image: swiftImage },
  { name: 'Innova Crysta', desc: 'Perfect for family trips & group tours.', image: swiftImage },
  { name: 'Toyota Fortuner', desc: 'Luxury SUV for all terrains.', image: swiftImage },
  { name: 'Hyundai i20', desc: 'Compact and city-friendly.', image: swiftImage },
  { name: 'Maruti Ertiga', desc: 'Spacious MPV for family rides.', image: swiftImage },
  { name: 'Mahindra XUV700', desc: 'Modern SUV with advanced features.', image: swiftImage },
  { name: 'Kia Seltos', desc: 'Stylish & tech-loaded crossover.', image: swiftImage },
  { name: 'Tata Safari', desc: 'Powerful SUV with bold presence.', image: swiftImage },
  { name: 'Renault Triber', desc: 'Budget-friendly 7-seater.', image: swiftImage },
  { name: 'MG Hector', desc: 'Smart SUV with internet features.', image: swiftImage },
];

const CarSection = () => {
  return (
    <section className="car-section" id="cars">
      <h2>Featured Cars for Rent</h2>
      <div className="car-grid">
        {cars.map((car, index) => (
          <div className="car-card" key={index}>
            <img src={car.image} alt={car.name} />
            <h3>{car.name}</h3>
            <p>{car.desc}</p>
            <a href="booking.html"><button>Book Now</button></a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarSection;
