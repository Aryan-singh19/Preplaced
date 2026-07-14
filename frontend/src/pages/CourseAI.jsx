import React from 'react';
import '../styles/CourseAI.css';
import HeroBanner from '../components/HeroBanner';

// Mock data structures replacing the old learning path
const DSA_RESOURCES = [
  { title: "DSA Bootcamps", subtitle: "Comprehensive guides" },
  { title: "DSA 1 on 1", subtitle: "Live mentoring" },
  { title: "27 Days Striver DSA Challenge", subtitle: "C++ Focus" },
];

const POPULAR_COMPANIES = [
  { title: "TCS NQT 2025", subtitle: "70 playlists", isFeatured: true }, // Added featured flag for the glow effect
  { title: "Cognizant", subtitle: "43 playlists" },
  { title: "Accenture", subtitle: "35 playlists" },
  { title: "IBM", subtitle: "18 playlists" },
  { title: "Infosys", subtitle: "2 playlists" },
];

const CSE_CORE_SUBJECTS = [
  { title: "Core CSE", subtitle: "Foundations" },
  { title: "Computer Network", subtitle: "24 playlists" },
  { title: "OOPs", subtitle: "15 playlists" },
  { title: "Operating System", subtitle: "12 playlists" },
  { title: "DBMS", subtitle: "30 playlists" },
];

// Reusable Card Component to match the image UI
const ExploreCard = ({ item }) => {
  return (
    <article className={`explore-card ${item.isFeatured ? 'featured-glow' : ''}`}>
      <div className="card-header">
        <div className="card-icon-placeholder">
          {/* You can replace this div with an actual <img src={item.logo} /> later */}
          <span className="icon-text">{item.title.charAt(0)}</span>
        </div>
        <div className="card-title-group">
          <h4>{item.title}</h4>
          <p>{item.subtitle}</p>
        </div>
      </div>
      <button className="explore-button">Explore →</button>
    </article>
  );
};

const CourseAI = () => {
  return (
    <div className="course-container dark-theme">
      <HeroBanner />

      <main className="dashboard-content">
        
        {/* --- DSA SECTION --- */}
        <section className="category-section" aria-labelledby="dsa-heading">
          <div className="section-header">
            <h2 id="dsa-heading">DSA</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="card-grid">
            {DSA_RESOURCES.map((item) => (
              <ExploreCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        {/* --- POPULAR ONE SECTION --- */}
        <section className="category-section" aria-labelledby="popular-heading">
          <div className="section-header">
            <h2 id="popular-heading">Popular One</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="card-grid">
            {POPULAR_COMPANIES.map((item) => (
              <ExploreCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        {/* --- CSE CORE SECTION --- */}
        <section className="category-section" aria-labelledby="core-heading">
          <div className="section-header">
            <h2 id="core-heading">CSE Core</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="card-grid">
            {CSE_CORE_SUBJECTS.map((item) => (
              <ExploreCard key={item.title} item={item} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default CourseAI;