import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/HeroBanner.css'; // Make sure this path matches your folder structure!

const slides = [
  {
    id: 1,
    tag: 'New Batch',
    title: 'Crack Your Dream',
    subtitle: 'Placement with AI',
    description: 'Master the skills you need for the 2025 Placement Season.',
    ctaText: 'Start Learning',
    features: ['Live Mentoring', 'Placement Support'],
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    accent: '#6366f1', // Indigo
  },
  {
    id: 2,
    tag: 'Resume AI',
    title: 'Build a Resume',
    subtitle: 'That Gets Noticed',
    description: 'Smart AI-powered resume checker and builder.',
    ctaText: 'Craft Resume',
    features: ['ATS Friendly', 'Instant Score'],
    bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
    accent: '#10b981', // Emerald
  },
  {
    id: 3,
    tag: 'Roadmaps',
    title: 'Your Custom',
    subtitle: 'Learning Path',
    description: 'Step-by-step guidance tailored to land top tech roles.',
    ctaText: 'View Roadmaps',
    features: ['Role-Based', 'Progress Tracking'],
    bg: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
    accent: '#a855f7', // Purple
  },
  {
    id: 4,
    tag: 'Practice',
    title: 'Master Coding',
    subtitle: 'With Real Challenges',
    description: 'Hand-picked problems from top company interviews.',
    ctaText: 'Start Coding',
    features: ['Company Tags', 'Live Compiler'],
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    accent: '#3b82f6', // Blue
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState(0); 
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('left');
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const timerRef = useRef(null);
  const currentRef = useRef(0); 

  const goTo = useCallback((index, dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setCurrent(index);
    currentRef.current = index;
    setTimeout(() => {
      setDisplayed(index); 
      setAnimating(false);
    }, 450);
  }, [animating]);

  const next = useCallback(() => {
    const index = (currentRef.current + 1) % slides.length;
    goTo(index, 'left');
  }, [goTo]);

  const prev = useCallback(() => {
    const index = (currentRef.current - 1 + slides.length) % slides.length;
    goTo(index, 'right');
  }, [goTo]);

  const goToIndex = useCallback((i) => {
    if (i === currentRef.current) return;
    goTo(i, i > currentRef.current ? 'left' : 'right');
  }, [goTo]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const index = (currentRef.current + 1) % slides.length;
      const dir = 'left';
      setDirection(dir);
      setAnimating(true);
      setCurrent(index);
      currentRef.current = index;
      setTimeout(() => {
        setDisplayed(index);
        setAnimating(false);
      }, 450);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = slides[displayed]; 

  return (
    <div
      className="hero-wrapper"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`hero-slide ${animating ? `exit-${direction}` : 'enter'}`}
        style={{ background: slide.bg }}
      >
        <button className="hero-arrow left" onClick={prev}>&#8249;</button>
        <button className="hero-arrow right" onClick={next}>&#8250;</button>

        <div className="hero-content">
          <div className="hero-center-block">
            <span className="hero-tag" style={{ background: slide.accent, boxShadow: `0 0 15px ${slide.accent}80` }}>
              {slide.tag}
            </span>
            
            <h2 className="hero-title">
              {slide.title}{' '}
              <span style={{ color: slide.accent, textShadow: `0 0 30px ${slide.accent}40` }}>
                {slide.subtitle}
              </span>
            </h2>
            
            <p className="hero-desc">{slide.description}</p>

            <div className="hero-features-container">
              {slide.features.map((feature, idx) => (
                <span key={idx} className="hero-feature-pill">
                  ✨ {feature}
                </span>
              ))}
            </div>

            <div className="hero-bottom">
              <button 
                className="hero-cta-btn" 
                style={{ background: slide.accent, boxShadow: `0 8px 25px ${slide.accent}60` }}
              >
                {slide.ctaText} &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => goToIndex(i)}
              style={{
                background: i === current ? slides[current].accent : 'rgba(255,255,255,0.3)',
                width: i === current ? '30px' : '8px',
                boxShadow: i === current ? `0 0 10px ${slides[current].accent}` : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;