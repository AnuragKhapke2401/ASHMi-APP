import React from 'react';
import './PredefinedRoutes.css';

const routes = [
  { from: 'Shirdi', to: 'Nashik', fare: 1500, time: '2 hrs' },
  { from: 'Shirdi', to: 'Mumbai', fare: 3500, time: '5 hrs' },
  { from: 'Shirdi', to: 'Pune', fare: 3000, time: '4.5 hrs' },
  { from: 'Shirdi Airport', to: 'Saibaba Mandir', fare: 300, time: '15 mins' },
];

const openBooking = (from, to, fare, time) => {
  alert(`Booking from ${from} to ${to}\nFare: ₹${fare}\nEstimated Time: ${time}`);
};

const PredefinedRoutes = () => {
  return (
    <section className="routes-section" id="routes">
      <h2>Popular Routes</h2>
      <div className="routes-grid">
        {routes.map((route, index) => (
          <div className="route-card" key={index}>
            <h3>{route.from} → {route.to}</h3>
            <p>Fare: ₹{route.fare}</p>
            <p>Estimated Time: {route.time}</p>
            <button onClick={() => openBooking(route.from, route.to, route.fare, route.time)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PredefinedRoutes;
