import React from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-section-vigorous">
      <div className="about-container">
        
        {/* Left Side: Energetic Image */}
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
            alt="Collaborative Success" 
            className="about-main-img"
          />
          <div className="image-experience-badge">
            <span className="years">AI</span>
            <span className="text">Powered Growth</span>
          </div>
        </div>

        {/* Right Side: Bold Content */}
        <div className="about-text-content">
          <span className="about-label">Who We Are</span>
          <h2 className="about-title-bold">Empowering Your <br /><span>Professional Journey</span></h2>
          
          <p className="about-description">
            At <strong>Placement AI</strong>, we don't just prepare you for jobs; we architect your career. 
            By combining advanced AI diagnostics with industry-standard modules, we bridge the 
            gap between academic potential and corporate excellence.
          </p>

          <div className="about-stats">
            <div className="stat-item">
              <h4>95%</h4>
              <p>Placement Rate</p>
            </div>
            <div className="stat-item">
              <h4>500+</h4>
              <p>Mock Interviews</p>
            </div>
            <div className="stat-item">
              <h4>AI</h4>
              <p>Driven Analysis</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;