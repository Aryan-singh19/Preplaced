import React, { useState, useEffect, useRef } from 'react';
import '../styles/StatsBanner.css';

// ----------------------------------------------------
// Component 1: The Live Traffic Counter
// Fluctuates upward to simulate real-time active users
// ----------------------------------------------------
const LiveCounter = ({ baseNumber }) => {
  const [count, setCount] = useState(baseNumber);

  useEffect(() => {
    // Ticks up by 1 to 3 "users" every 2 to 4 seconds
    const interval = setInterval(() => {
      const increase = Math.floor(Math.random() * 3) + 1;
      setCount((prev) => prev + increase);
    }, Math.random() * 2000 + 2000); 

    return () => clearInterval(interval);
  }, []);

  return <span>{count}</span>;
};

// ----------------------------------------------------
// Component 2: The Static Scroll-Triggered Counter
// Counts from 0 to the target once scrolled into view
// ----------------------------------------------------
const AnimatedCounter = ({ target }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Trigger animation only when visible and if it hasn't animated yet
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const duration = 2000; // 2 seconds

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            setCount(Math.floor(progress * target));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target, hasAnimated]);

  return <span ref={counterRef}>{count}</span>;
};

// ----------------------------------------------------
// Main Banner Component
// ----------------------------------------------------
const StatsBanner = () => {
  return (
    <div className="stats-container">
      {/* Live Counter */}
      <div className="stat-box">
        <div className="stat-number">
          <LiveCounter baseNumber={142} />
          <span className="live-dot"></span>
        </div>
        <div className="stat-text">Active Pioneers Online</div>
      </div>
      
      {/* Static Counter 1 */}
      <div className="stat-box">
        <div className="stat-number">
          <AnimatedCounter target={10} />K+
        </div>
        <div className="stat-text">Technical Minds Cultivated</div>
      </div>
      
      {/* Static Counter 2 */}
      <div className="stat-box">
        <div className="stat-number">
          <AnimatedCounter target={200} />+
        </div>
        <div className="stat-text">Open-Source Knowledge Assets</div>
      </div>
      
      {/* Static Counter 3 */}
      <div className="stat-box last-box">
        <div className="stat-number">
          <AnimatedCounter target={100} />%
        </div>
        <div className="stat-text">ATS Optimization Success</div>
      </div>
    </div>
  );
};

export default StatsBanner;