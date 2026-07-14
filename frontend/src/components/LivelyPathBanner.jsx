import React from 'react';
import '../styles/LivelyPathBanner.css';

// Fallback image for when the video cannot load
const fallbackImage = 'path/to/your/fallback-image.jpg'; // Insert a good static image path
const backgroundVideo = 'path/to/your/background-video.mp4'; // Insert a high-quality video loop path

const LivelyPathBanner = () => {
  return (
    <div className="lively-container">
      {/* Background Video (Muted, Auto-played, Looped) */}
      <video
        className="background-video"
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline // Important for mobile browsers
        poster={fallbackImage}
      >
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="content-overlay">
        <div className="text-wrapper">
          <span className="category-title">EXPLORE YOUR PATH</span>
          <h1 className="main-headline">
            Ignite your story. Chase your dreams, far and fast.
          </h1>
          <p className="description-text">
            Discover a world where potential has no limits. Unleash your inner hero and embark on your greatest adventure. From internships to impact, your journey to an exceptional career starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LivelyPathBanner;