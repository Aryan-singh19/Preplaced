import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Placemate AI</h2>
          <p>Master Skills. Ace Interviews. Get Hired.</p>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>

        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
                        <a href="https://github.com/Arti2410" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              {/* GitHub SVG Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="#181717"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/elitecodr0110/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              {/* Instagram SVG Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" fill="#E1306C"/>
                <circle cx="12" cy="12" r="5" fill="white"/>
                <circle cx="18" cy="6" r="1.5" fill="white"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                {/* YouTube SVG Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#FF0000"/>
                  <polygon points="10,8 16,12 10,16" fill="#fff"/>
                </svg>
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                {/* X (Twitter) SVG Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#000"/>
                  <path d="M7 7L17 17M17 7L7 17" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Placemate AI. Built by Arti Verma.</p>
      </div>
    </footer>
  );
};

export default Footer;
