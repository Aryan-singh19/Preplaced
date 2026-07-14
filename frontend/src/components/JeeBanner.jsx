import React from 'react';
import '../styles/JeeBanner.css';

const JeeBanner = () => {
  return (
    <div className="banner-container">
      <div className="banner-content">
        {/* Breadcrumb Section */}
        <div className="breadcrumb">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="home-icon"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="chevron">&gt;</span>
          <span className="breadcrumb-text">Aptitude Preparation</span>
        </div>

        {/* Main Heading */}
        <h1 className="banner-title">
          Master Your Aptitude Skills: Complete Preparation for Placements & Exams
        </h1>

        {/* Paragraph Text */}
        <p className="banner-description">
          Aptitude tests are the ultimate gateway to your dream career. This is your moment to sharpen your quantitative, logical, and verbal skills. Consistent practice is the secret to unlocking your true potential and standing out from the crowd. Dive into our comprehensive modules, push your limits, and build the speed and accuracy you need to conquer any assessment with absolute confidence!
        </p>
      </div>
    </div>
  );
};

export default JeeBanner;