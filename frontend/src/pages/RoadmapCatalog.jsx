import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import '../styles/RoadmapCatalog.css';

const ROADMAP_SUBJECTS = [
  { id: 'frontend', title: 'Frontend Developer', icon: '🎨', desc: 'Master React, Next.js, advanced CSS, and responsive UI architecture.', modules: 12 },
  { id: 'backend', title: 'Backend Developer', icon: '⚙️', desc: 'Build scalable APIs, microservices, and master database integration.', modules: 14 },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: '🌐', desc: 'End-to-end development connecting rich UIs to robust servers.', modules: 24 },
  { id: 'dsa', title: 'Data Structures & Algo', icon: '🧩', desc: 'Crack technical interviews with Arrays, Graphs, DP, and more.', modules: 15 },
  { id: 'oops', title: 'Object-Oriented Design', icon: '🏗️', desc: 'Classes, design patterns, and SOLID principles for clean code.', modules: 6 },
  { id: 'dbms', title: 'Database Management', icon: '🗄️', desc: 'SQL queries, normalization, indexing, and high-level architecture.', modules: 8 },
  { id: 'data-analyst', title: 'Data Analyst', icon: '📊', desc: 'Python, Pandas, SQL, and Tableau for actionable business insights.', modules: 10 },
  { id: 'machine-learning', title: 'Machine Learning', icon: '🤖', desc: 'Algorithms, regression, reinforcement learning, and neural nets.', modules: 16 },
  { id: 'generative-ai', title: 'Generative AI', icon: '✨', desc: 'Master LLMs, Transformers, RAG architecture, and fine-tuning.', modules: 9 },
  { id: 'prompt-engineer', title: 'Prompt Engineer', icon: '✍️', desc: 'Zero-shot, chain-of-thought, and optimizing LLM interactions.', modules: 5 },
  { id: 'cyber-security', title: 'Cyber Security', icon: '🛡️', desc: 'Ethical hacking, cryptography, and securing modern networks.', modules: 18 },
];

const RoadmapCatalog = () => {
  const navigate = useNavigate(); // 2. Initialize navigate

  return (
    <div className="catalog-page dark-theme">
      <header className="catalog-header">
        <h1>Explore Learning Paths</h1>
        <p>Select a roadmap to start tracking your progress from beginner to expert.</p>
      </header>

      <div className="catalog-grid">
        {ROADMAP_SUBJECTS.map((subject) => (
          <article 
            key={subject.id} 
            className="catalog-card" 
            // 3. Use navigate to send user to the specific roadmap route
            onClick={() => navigate(`/roadmap/${subject.id}`)}
          >
            <div className="card-top">
              <div className="card-icon">{subject.icon}</div>
              <span className="module-badge">{subject.modules} Modules</span>
            </div>
            
            <h3 className="card-title">{subject.title}</h3>
            <p className="card-desc">{subject.desc}</p>
            
            <div className="card-bottom">
              <span className="start-text">View Roadmap</span>
              <span className="arrow">→</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RoadmapCatalog;