import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const DBMS_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Relational Model & Architecture',
    topics: [
      { id: 'dbms-1', title: 'File Systems vs DBMS & 3-Tier Architecture', difficulty: 'Easy', time: '2h' },
      { id: 'dbms-2', title: 'Relational Model Concepts (Tables, Tuples, Attributes)', difficulty: 'Easy', time: '1h' },
      { id: 'dbms-3', title: 'Keys in DBMS (Primary, Foreign, Super, Candidate)', difficulty: 'Medium', time: '2h' },
      { id: 'dbms-4', title: 'ER Diagrams & Data Modeling', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: SQL Mastery',
    topics: [
      { id: 'dbms-5', title: 'DDL, DML, DCL, and TCL Commands', difficulty: 'Easy', time: '2h' },
      { id: 'dbms-6', title: 'Joins (Inner, Left, Right, Full, Cross)', difficulty: 'Medium', time: '3h' },
      { id: 'dbms-7', title: 'Nested Queries & Correlated Subqueries', difficulty: 'Hard', time: '4h' },
      { id: 'dbms-8', title: 'Views, Triggers, and Stored Procedures', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Database Design & Normalization',
    topics: [
      { id: 'dbms-9', title: 'Functional Dependencies & Closures', difficulty: 'Medium', time: '3h' },
      { id: 'dbms-10', title: 'First, Second, and Third Normal Forms (1NF, 2NF, 3NF)', difficulty: 'Medium', time: '4h' },
      { id: 'dbms-11', title: 'Boyce-Codd Normal Form (BCNF)', difficulty: 'Hard', time: '3h' },
      { id: 'dbms-12', title: 'Denormalization & Performance Trade-offs', difficulty: 'Easy', time: '2h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Transactions & Concurrency Control',
    topics: [
      { id: 'dbms-13', title: 'Transaction States & ACID Properties', difficulty: 'Medium', time: '2h' },
      { id: 'dbms-14', title: 'Schedules (Serializability & Recoverability)', difficulty: 'Hard', time: '5h' },
      { id: 'dbms-15', title: 'Concurrency Control (Lock-Based Protocols)', difficulty: 'Hard', time: '4h' },
      { id: 'dbms-16', title: 'Deadlocks (Prevention, Detection, Recovery)', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Storage, Indexing & Optimization',
    topics: [
      { id: 'dbms-17', title: 'File Organization (Sequential, Heap, Hash)', difficulty: 'Medium', time: '3h' },
      { id: 'dbms-18', title: 'Indexing (Primary, Secondary, Clustering)', difficulty: 'Medium', time: '3h' },
      { id: 'dbms-19', title: 'B-Trees and B+ Trees Architecture', difficulty: 'Hard', time: '6h' },
      { id: 'dbms-20', title: 'Query Processing & Execution Plans', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Advanced Databases (Beyond SQL)',
    topics: [
      { id: 'dbms-21', title: 'Distributed Databases & CAP Theorem', difficulty: 'Medium', time: '3h' },
      { id: 'dbms-22', title: 'NoSQL Databases (Document vs Key-Value vs Graph)', difficulty: 'Medium', time: '4h' },
      { id: 'dbms-23', title: 'Data Warehousing (OLAP vs OLTP)', difficulty: 'Easy', time: '2h' },
    ]
  }
];

const DBMSRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the DBMS roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('dbms-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('dbms-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = DBMS_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Database Management (DBMS)</h1>
        <p>Master database design, SQL queries, normalization, and internal architectures like B-Trees and Concurrency.</p>
        
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
        {DBMS_ROADMAP_DATA.map((section) => {
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

export default DBMSRoadmap;
