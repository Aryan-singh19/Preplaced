import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import ReviewCard from '../components/ReviewCard';
import AboutUs from '../pages/AboutUs';
import StatsBanner from '../pages/StatsBanner'; // <-- IMPORTED STATS BANNER HERE
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const quickActions = [
    { 
      title: 'Aptitude Test', 
      path: '/aptitude', 
      icon: '📝', 
      quote: "Your Aptitude, not your attitude, will determine your altitude.— Zig Ziglar" 
    },
    { 
      title: 'Resume Analyzer', 
      path: '/resume-checker', 
      icon: '📄', 
      quote: "The beginning is NOW. — Roy T. Bennett" 
    },
    { 
      title: 'AI Interview', 
      path: '/interview-ai', 
      icon: '🤖', 
      quote: "The way to get started is to quit talking and begin doing. — Walt Disney" 
    },
    { 
      title: 'Courses', 
      path: '/course-ai', 
      icon: '🎓', 
      quote: "Your success will be determined by your own confidence and fortitude. — Michelle Obama" 
    },
  ];

  // UPDATED: Added vigorous images
  const features = [
    { 
      title: "Aptitude Mastery", 
      description: "Subject-wise practice modules.", 
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      title: "AI Resume Checker", 
      description: "Instant ATS feedback.", 
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      title: "Interview Simulator", 
      description: "Role-specific mock interviews.", 
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const reviews = [
  { 
    name: "Khushboo", 
    role: "Software Developer",
    review: "Placemate AI helped me bridge the gap to industry! The AI Interview simulator felt like a real HR round.", 
    rating: 5,
    initials: "K"
  },
  { 
    name: "Rahul Sharma", 
    role: "Engineering Student",
    review: "The Resume Checker is a game changer. I went from 0 calls to 3 interviews in a week.", 
    rating: 5,
    initials: "R" 
  },
  { 
    name: "Sneha Kapoor", 
    role: "Data Analyst",
    review: "The course modules are crisp and direct. Exactly what recruiters are looking for today.", 
    rating: 5,
    initials: "S" 
  }
];  

  return (
    <div className="landing-container">
      <header className="hero-section hero-with-image">
        <div className="hero-content">
          <div className="bold-white">Master Your Career with</div>
          <div className="bold-white">PLACEMATE AI</div>
          <div className="hero-slogan">"Master Skills. Ace Interviews. Get Hired"</div>
          <div className="hero-btn-container">
            <button className="cta-btn white-btn" onClick={() => navigate('/about')}>
              Explore Features
            </button>
          </div>
        </div>
      </header>

      <div className="slide-up-container">
        <AboutUs />

        {/* --- ADDED STATS BANNER HERE --- */}
        <section className="stats-banner-section" style={{ padding: '20px', margin: '20px 0' }}>
          <StatsBanner />
        </section>
        {/* ------------------------------- */}

        <section className="quick-grid">
          {quickActions.map((action, index) => {
            const [quoteText, authorName] = action.quote.split(/[—–-]/);
            return (
              <div key={index} className="action-card" onClick={() => navigate(action.path)}>
                <div className="icon-wrapper">
                  <span className="action-icon">{action.icon}</span>
                </div>
                <h3>{action.title}</h3>
                <div className="quote-wrapper">
                  <p className="quote-text-main">{quoteText.trim()}</p>
                  {authorName && <p className="quote-author-name">— {authorName.trim()}</p>}
                </div>
                <div className="start-link">Start now →</div>
              </div>
            );
          })}
        </section>

        {/* UPDATED: Features Section with White Background */}
        <section className="features-section-white">
          <h2 className="section-title-dark">Our AI-Powered Features</h2>
          <div className="features-grid-vigorous">
            {features.map((f, i) => (
              <div key={i} className="vigorous-card">
                <img src={f.image} alt={f.title} className="card-bg-image" />
                <div className="card-overlay">
                  <div className="card-text-bottom">
                    <h3>{f.title}</h3>
                    <p>{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews-section-premium">
          <div className="reviews-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of successful candidates who used Placemate AI to land their dream jobs.</p>
          </div>
          
          <div className="reviews-grid-modern">
            {reviews.map((r, i) => (
              <div key={i} className="modern-review-card">
                <div className="stars">{"★".repeat(r.rating)}</div>
                <p className="review-text">"{r.review}"</p>
                <div className="reviewer-info">
                  <div className="avatar-circle">{r.initials}</div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{r.name}</h4>
                    <span className="reviewer-role">{r.role}</span>
                  </div>
                  <div className="verified-check">✓</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;