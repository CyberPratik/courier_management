// src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Ensure your custom CSS is imported

// Import images directly
import image1 from '../assets/Red Delivery Car 3D Rendering.jpg';
import image2 from '../assets/15026.jpg';
import image3 from '../assets/Internet Tech Delivery Background.jpg';


const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Array of images for the slideshow
  const images = [image1, image2,image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, [images.length]);

  return (
    <div className="homepage">
      <div className="slideshow-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slideshow ${index}`}
            className={`slideshow-image ${currentIndex === index ? 'active' : ''}`}
          />
        ))}
      </div>
      <div className="homepage-content text-center d-flex flex-column justify-content-center align-items-center">
        <h1 className="homepage-title">Welcome to Rocket Couriers </h1>
        <p className="homepage-subtitle">
          Your one-stop solution for managing courier deliveries effectively and easily.
        </p>
        <div className="homepage-buttons">
          <Link to="/track-order" className="btn btn-primary me-3">
            Track Your Order
          </Link>
          <Link to="/customer-form" className="btn btn-primary me-3">
            Submit a New Request
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
