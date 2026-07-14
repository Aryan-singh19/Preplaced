import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const BACKEND_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Internet & OS Fundamentals',
    topics: [
      { id: 'be-1', title: 'How the Internet Works (HTTP/HTTPS, DNS)', difficulty: 'Easy', time: '2h' },
      { id: 'be-2', title: 'OS Basics & Memory Management', difficulty: 'Medium', time: '3h' },
      { id: 'be-3', title: 'Basic Terminal Commands & Bash Scripting', difficulty: 'Easy', time: '2h' },
      { id: 'be-4', title: 'Networking Concepts (TCP/UDP, Sockets)', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Language & APIs',
    topics: [
      { id: 'be-5', title: 'Advanced Language Core (Concurrency, Event Loop)', difficulty: 'Hard', time: '5h' },
      { id: 'be-6', title: 'Building RESTful APIs', difficulty: 'Medium', time: '4h' },
      { id: 'be-7', title: 'Middleware & Error Handling', difficulty: 'Medium', time: '3h' },
      { id: 'be-8', title: 'Working with JSON & Data Serialization', difficulty: 'Easy', time: '2h' },
      { id: 'be-9', title: 'GraphQL Fundamentals (Queries, Mutations)', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Databases & Storage',
    topics: [
      { id: 'be-10', title: 'Relational Databases & SQL (PostgreSQL, MySQL)', difficulty: 'Medium', time: '5h' },
      { id: 'be-11', title: 'NoSQL Databases (MongoDB, Cassandra)', difficulty: 'Medium', time: '4h' },
      { id: 'be-12', title: 'ORMs & Query Builders (Prisma, Sequelize, SQLAlchemy)', difficulty: 'Medium', time: '3h' },
      { id: 'be-13', title: 'Database Indexing & Normalization', difficulty: 'Hard', time: '4h' },
      { id: 'be-14', title: 'ACID Properties & Transactions', difficulty: 'Hard', time: '3h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Security & Authentication',
    topics: [
      { id: 'be-15', title: 'Hashing vs Encryption (Bcrypt)', difficulty: 'Easy', time: '2h' },
      { id: 'be-16', title: 'Session-based Authentication', difficulty: 'Medium', time: '3h' },
      { id: 'be-17', title: 'Token-based Authentication (JWT)', difficulty: 'Medium', time: '3h' },
      { id: 'be-18', title: 'OAuth & Single Sign-On (SSO)', difficulty: 'Hard', time: '4h' },
      { id: 'be-19', title: 'Web Security Basics (CORS, CSRF, XSS)', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Scaling & Architecture',
    topics: [
      { id: 'be-20', title: 'Caching Strategies (Redis, Memcached)', difficulty: 'Medium', time: '4h' },
      { id: 'be-21', title: 'Message Brokers & Queues (RabbitMQ, Kafka)', difficulty: 'Hard', time: '5h' },
      { id: 'be-22', title: 'Monolithic vs Microservices Architecture', difficulty: 'Medium', time: '3h' },
      { id: 'be-23', title: 'WebSockets & Real-time Communication', difficulty: 'Medium', time: '4h' },
      { id: 'be-24', title: 'Rate Limiting & API Gateways', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Deployment & DevOps Basics',
    topics: [
      { id: 'be-25', title: 'Containerization (Docker Basics)', difficulty: 'Medium', time: '4h' },
      { id: 'be-26', title: 'CI/CD Pipelines (GitHub Actions)', difficulty: 'Medium', time: '3h' },
      { id: 'be-27', title: 'Cloud Providers Basics (AWS EC2, S3)', difficulty: 'Medium', time: '4h' },
      { id: 'be-28', title: 'Server Monitoring & Logging (Prometheus, Grafana)', difficulty: 'Hard', time: '3h' },
    ]
  }
];

const BackendRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the Backend roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('backend-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('backend-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = BACKEND_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Backend Developer Roadmap</h1>
        <p>Master scalable APIs, databases, security, and microservices architecture.</p>
        
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
        {BACKEND_ROADMAP_DATA.map((section) => {
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

export default BackendRoadmap;