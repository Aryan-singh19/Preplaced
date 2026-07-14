import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css';

const FRONTEND_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Internet & Web Fundamentals',
    topics: [
      { id: 'fe-1', title: 'How the Internet Works (HTTP/HTTPS, DNS)', difficulty: 'Easy', time: '2h' },
      { id: 'fe-2', title: 'Semantic HTML5 & Best Practices', difficulty: 'Easy', time: '3h' },
      { id: 'fe-3', title: 'Web Accessibility (a11y) & ARIA', difficulty: 'Medium', time: '2h' },
      { id: 'fe-4', title: 'CSS Box Model, Selectors & Specificity', difficulty: 'Easy', time: '4h' },
      { id: 'fe-5', title: 'Flexbox & CSS Grid Architecture', difficulty: 'Medium', time: '5h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Advanced CSS & Tooling',
    topics: [
      { id: 'fe-6', title: 'Responsive Design & Media Queries', difficulty: 'Medium', time: '3h' },
      { id: 'fe-7', title: 'CSS Variables & CSS-in-JS', difficulty: 'Easy', time: '2h' },
      { id: 'fe-8', title: 'Utility-First CSS (Tailwind CSS)', difficulty: 'Medium', time: '4h' },
      { id: 'fe-9', title: 'Version Control (Git & GitHub Workflows)', difficulty: 'Easy', time: '3h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: JavaScript Core (Vanilla JS)',
    topics: [
      { id: 'fe-10', title: 'Data Types, Functions & DOM Manipulation', difficulty: 'Easy', time: '5h' },
      { id: 'fe-11', title: 'Execution Context, Hoisting & Closures', difficulty: 'Hard', time: '4h' },
      { id: 'fe-12', title: 'ES6+ Features (Destructuring, Spread, Modules)', difficulty: 'Medium', time: '3h' },
      { id: 'fe-13', title: 'Asynchronous JS (Promises, Async/Await)', difficulty: 'Hard', time: '5h' },
      { id: 'fe-14', title: 'Network Requests (Fetch API & Axios)', difficulty: 'Medium', time: '2h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: React.js Mastery',
    topics: [
      { id: 'fe-15', title: 'Components, JSX & Props', difficulty: 'Easy', time: '3h' },
      { id: 'fe-16', title: 'State & Lifecycle (useState, useEffect)', difficulty: 'Medium', time: '5h' },
      { id: 'fe-17', title: 'Advanced Hooks (useRef, useMemo, useCallback)', difficulty: 'Hard', time: '4h' },
      { id: 'fe-18', title: 'Global State Management (Redux Toolkit / Zustand)', difficulty: 'Hard', time: '6h' },
      { id: 'fe-19', title: 'Client-Side Routing (React Router)', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Next.js & Performance',
    topics: [
      { id: 'fe-20', title: 'Next.js App Router Architecture', difficulty: 'Medium', time: '4h' },
      { id: 'fe-21', title: 'Rendering Strategies (SSR, SSG, ISR)', difficulty: 'Hard', time: '5h' },
      { id: 'fe-22', title: 'Server Components vs Client Components', difficulty: 'Hard', time: '3h' },
      { id: 'fe-23', title: 'Core Web Vitals & Performance Optimization', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Testing & Deployment',
    topics: [
      { id: 'fe-24', title: 'Build Tools (Vite, Webpack basics)', difficulty: 'Medium', time: '2h' },
      { id: 'fe-25', title: 'Unit Testing (Jest, React Testing Library)', difficulty: 'Hard', time: '5h' },
      { id: 'fe-26', title: 'E2E Testing (Cypress / Playwright)', difficulty: 'Medium', time: '3h' },
      { id: 'fe-27', title: 'CI/CD Pipelines & Hosting (Vercel/Netlify)', difficulty: 'Easy', time: '2h' },
    ]
  }
];

const FrontendRoadmap = () => {
  // 1. Load saved progress using a unique key for the Frontend roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('frontend-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  // 2. Keep track of which accordion sections are open
  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 3. Save to local storage whenever completedTopics changes
  useEffect(() => {
    localStorage.setItem('frontend-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // 4. Calculate overall progress
  const totalTopics = FRONTEND_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Frontend Developer Roadmap</h1>
        <p>Master the modern web from semantic HTML to advanced React and Next.js.</p>
        
        {/* Progress Bar Component */}
        <div className="progress-container">
          <div className="progress-stats">
            <span>Overall Progress</span>
            <span>{progressPercentage}% ({completedCount}/{totalTopics})</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="roadmap-content">
        {FRONTEND_ROADMAP_DATA.map((section) => {
          const isSectionOpen = openSections[section.id];
          
          // Calculate progress per section
          const sectionTotal = section.topics.length;
          const sectionCompleted = section.topics.filter(t => completedTopics[t.id]).length;
          const isSectionDone = sectionTotal === sectionCompleted;

          return (
            <div key={section.id} className={`roadmap-section ${isSectionDone ? 'section-completed' : ''}`}>
              
              {/* Accordion Header */}
              <button 
                className="section-header" 
                onClick={() => toggleSection(section.id)}
              >
                <div className="section-header-left">
                  <span className="toggle-icon">{isSectionOpen ? '▼' : '▶'}</span>
                  <h3>{section.title}</h3>
                </div>
                <div className="section-header-right">
                  <span className="section-stats">{sectionCompleted}/{sectionTotal}</span>
                </div>
              </button>

              {/* Accordion Body */}
              {isSectionOpen && (
                <div className="section-body">
                  {section.topics.map((topic) => {
                    const isDone = completedTopics[topic.id];
                    return (
                      <div 
                        key={topic.id} 
                        className={`topic-row ${isDone ? 'done' : ''}`}
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <div className="topic-left">
                          <div className={`custom-checkbox ${isDone ? 'checked' : ''}`}>
                            {isDone && '✓'}
                          </div>
                          <span className="topic-title">{topic.title}</span>
                        </div>
                        
                        <div className="topic-right">
                          <span className={`difficulty-tag ${topic.difficulty.toLowerCase()}`}>
                            {topic.difficulty}
                          </span>
                          <span className="time-tag">⏱ {topic.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FrontendRoadmap;