import React, { useState } from "react";
import "../styles/styles.css";  // Import external CSS

const images = [
  "assets/img1.MTN.jpg",
  "assets/img2.MTN.jpg",
  "assets/img3.MTN.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="carousel-container">
      <img src={images[currentIndex]} alt="carousel" className="carousel-image" />
      <button className="next-btn" onClick={nextSlide}>›</button>
    </div>
  );
};

export default Carousel;
