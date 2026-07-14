import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const CYBERSECURITY_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: IT & Networking Fundamentals',
    topics: [
      { id: 'cs-1', title: 'OSI & TCP/IP Models', difficulty: 'Easy', time: '3h' },
      { id: 'cs-2', title: 'Networking Hardware (Routers, Switches, Firewalls)', difficulty: 'Medium', time: '2h' },
      { id: 'cs-3', title: 'Linux Basics & CLI Navigation', difficulty: 'Medium', time: '4h' },
      { id: 'cs-4', title: 'Windows Active Directory Basics', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Security Foundations & Cryptography',
    topics: [
      { id: 'cs-5', title: 'The CIA Triad & Threat Modeling', difficulty: 'Easy', time: '2h' },
      { id: 'cs-6', title: 'Symmetric vs Asymmetric Encryption', difficulty: 'Medium', time: '3h' },
      { id: 'cs-7', title: 'Hashing Algorithms (SHA, MD5) & Salting', difficulty: 'Medium', time: '2h' },
      { id: 'cs-8', title: 'Public Key Infrastructure (PKI) & Digital Certificates', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Offensive Security (Red Team)',
    topics: [
      { id: 'cs-9', title: 'Reconnaissance & OSINT Techniques', difficulty: 'Medium', time: '3h' },
      { id: 'cs-10', title: 'Network Scanning & Enumeration (Nmap)', difficulty: 'Medium', time: '4h' },
      { id: 'cs-11', title: 'Vulnerability Scanning (Nessus/OpenVAS)', difficulty: 'Medium', time: '3h' },
      { id: 'cs-12', title: 'Exploitation Frameworks (Metasploit)', difficulty: 'Hard', time: '5h' },
      { id: 'cs-13', title: 'Privilege Escalation (Windows & Linux)', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Web Application Security',
    topics: [
      { id: 'cs-14', title: 'OWASP Top 10 Overview', difficulty: 'Medium', time: '2h' },
      { id: 'cs-15', title: 'SQL Injection (SQLi) & Defense', difficulty: 'Hard', time: '4h' },
      { id: 'cs-16', title: 'Cross-Site Scripting (XSS) & CSRF', difficulty: 'Hard', time: '4h' },
      { id: 'cs-17', title: 'Using Web Proxies (Burp Suite / ZAP)', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Defensive Security (Blue Team)',
    topics: [
      { id: 'cs-18', title: 'Intrusion Detection/Prevention Systems (IDS/IPS)', difficulty: 'Medium', time: '3h' },
      { id: 'cs-19', title: 'SIEM Tools (Splunk, ELK Stack)', difficulty: 'Hard', time: '5h' },
      { id: 'cs-20', title: 'Incident Response Lifecycle', difficulty: 'Medium', time: '3h' },
      { id: 'cs-21', title: 'Basic Malware Analysis & Sandboxing', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Cloud Security & Governance',
    topics: [
      { id: 'cs-22', title: 'Cloud Shared Responsibility Model', difficulty: 'Easy', time: '2h' },
      { id: 'cs-23', title: 'Identity & Access Management (IAM)', difficulty: 'Medium', time: '3h' },
      { id: 'cs-24', title: 'Zero Trust Architecture', difficulty: 'Medium', time: '2h' },
      { id: 'cs-25', title: 'Compliance & Frameworks (NIST, ISO 27001, GDPR)', difficulty: 'Medium', time: '3h' },
    ]
  }
];

const CyberSecurityRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the Cyber Security roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('cybersecurity-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('cybersecurity-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = CYBERSECURITY_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Cyber Security Roadmap</h1>
        <p>Master networking, ethical hacking, and defensive strategies to protect systems and data from modern threats.</p>
        
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
        {CYBERSECURITY_ROADMAP_DATA.map((section) => {
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

export default CyberSecurityRoadmap;