import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const FULLSTACK_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Frontend Architecture (React/Next.js)',
    topics: [
      { id: 'fs-1', title: 'Advanced State Management (Redux/Zustand)', difficulty: 'Medium', time: '4h' },
      { id: 'fs-2', title: 'Server-Side Rendering (SSR) & Static Generation (SSG)', difficulty: 'Hard', time: '5h' },
      { id: 'fs-3', title: 'Form Handling & Validation (Formik/Yup)', difficulty: 'Easy', time: '2h' },
      { id: 'fs-4', title: 'Frontend Performance & Core Web Vitals', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Backend & API Design',
    topics: [
      { id: 'fs-5', title: 'Designing RESTful APIs Best Practices', difficulty: 'Medium', time: '3h' },
      { id: 'fs-6', title: 'GraphQL Integration (Apollo Server/Client)', difficulty: 'Hard', time: '6h' },
      { id: 'fs-7', title: 'File Uploads & Cloud Storage (AWS S3/Cloudinary)', difficulty: 'Medium', time: '4h' },
      { id: 'fs-8', title: 'Error Handling & Global Logging', difficulty: 'Medium', time: '2h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Databases & Data Modeling',
    topics: [
      { id: 'fs-9', title: 'Designing Database Schemas (SQL vs NoSQL)', difficulty: 'Medium', time: '4h' },
      { id: 'fs-10', title: 'Advanced ORM/ODM Usage (Prisma, Mongoose)', difficulty: 'Medium', time: '5h' },
      { id: 'fs-11', title: 'Database Migrations & Seeding', difficulty: 'Medium', time: '3h' },
      { id: 'fs-12', title: 'Caching Queries (Redis Integration)', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Full-Stack Security & Auth',
    topics: [
      { id: 'fs-13', title: 'Implementing JWT Authentication Flow', difficulty: 'Medium', time: '4h' },
      { id: 'fs-14', title: 'OAuth2 (Google, GitHub Login Providers)', difficulty: 'Hard', time: '5h' },
      { id: 'fs-15', title: 'Role-Based Access Control (RBAC)', difficulty: 'Medium', time: '3h' },
      { id: 'fs-16', title: 'Securing Headers (Helmet, CORS policies)', difficulty: 'Easy', time: '2h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Real-time & Asynchronous Systems',
    topics: [
      { id: 'fs-17', title: 'WebSockets (Socket.io) Implementation', difficulty: 'Medium', time: '4h' },
      { id: 'fs-18', title: 'Server-Sent Events (SSE)', difficulty: 'Medium', time: '2h' },
      { id: 'fs-19', title: 'Background Jobs & Task Queues (BullMQ/RabbitMQ)', difficulty: 'Hard', time: '5h' },
      { id: 'fs-20', title: 'Sending Emails & Notifications (SendGrid/Twilio)', difficulty: 'Easy', time: '2h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: DevOps, Testing & Deployment',
    topics: [
      { id: 'fs-21', title: 'End-to-End (E2E) Testing (Cypress/Playwright)', difficulty: 'Medium', time: '4h' },
      { id: 'fs-22', title: 'Dockerizing a Full Stack Application', difficulty: 'Hard', time: '5h' },
      { id: 'fs-23', title: 'CI/CD Pipelines (GitHub Actions/GitLab CI)', difficulty: 'Medium', time: '4h' },
      { id: 'fs-24', title: 'Deploying to Cloud (Vercel/Render/AWS)', difficulty: 'Medium', time: '3h' },
    ]
  }
];

const FullStackRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the Full Stack roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('fullstack-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('fullstack-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = FULLSTACK_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Full Stack Engineer Roadmap</h1>
        <p>Master end-to-end development by connecting scalable backends to dynamic frontend interfaces.</p>
        
        <div className="progress-container">
          <div className="progress-stats">
            <span>Overall Progress</span>
            <span>{progressPercentage}% ({completedCount}/{totalTopics})</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="roadmap-content">
        {FULLSTACK_ROADMAP_DATA.map((section) => {
          const isSectionOpen = openSections[section.id];
          const sectionTotal = section.topics.length;
          const sectionCompleted = section.topics.filter(t => completedTopics[t.id]).length;
          const isSectionDone = sectionTotal === sectionCompleted;

          return (
            <div key={section.id} className={`roadmap-section ${isSectionDone ? 'section-completed' : ''}`}>
              
              <button className="section-header" onClick={() => toggleSection(section.id)}>
                <div className="section-header-left">
                  <span className="toggle-icon">{isSectionOpen ? '▼' : '▶'}</span>
                  <h3>{section.title}</h3>
                </div>
                <div className="section-header-right">
                  <span className="section-stats">{sectionCompleted}/{sectionTotal}</span>
                </div>
              </button>

              {isSectionOpen && (
                <div className="section-body">
                  {section.topics.map((topic) => {
                    const isDone = completedTopics[topic.id];
                    return (
                      <div key={topic.id} className={`topic-row ${isDone ? 'done' : ''}`} onClick={() => toggleTopic(topic.id)}>
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

export default FullStackRoadmap;