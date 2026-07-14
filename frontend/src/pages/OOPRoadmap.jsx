import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const OOP_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: OOP Fundamentals',
    topics: [
      { id: 'oop-1', title: 'Classes, Objects & Instantiation', difficulty: 'Easy', time: '2h' },
      { id: 'oop-2', title: 'Constructors, Destructors & Memory (Stack vs Heap)', difficulty: 'Medium', time: '3h' },
      { id: 'oop-3', title: 'Access Modifiers (Public, Private, Protected)', difficulty: 'Easy', time: '1h' },
      { id: 'oop-4', title: 'Static Keyword, Methods & Variables', difficulty: 'Medium', time: '2h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: The Four Pillars of OOP',
    topics: [
      { id: 'oop-5', title: 'Encapsulation & Data Hiding', difficulty: 'Easy', time: '2h' },
      { id: 'oop-6', title: 'Abstraction (Abstract Classes & Methods)', difficulty: 'Medium', time: '3h' },
      { id: 'oop-7', title: 'Inheritance (Single, Multiple, Multilevel)', difficulty: 'Medium', time: '4h' },
      { id: 'oop-8', title: 'Polymorphism (Compile-time vs Run-time)', difficulty: 'Hard', time: '5h' },
      { id: 'oop-9', title: 'Method Overloading vs Overriding', difficulty: 'Medium', time: '2h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Advanced Class Concepts',
    topics: [
      { id: 'oop-10', title: 'Interfaces & Multiple Inheritance Workarounds', difficulty: 'Medium', time: '3h' },
      { id: 'oop-11', title: 'Composition vs Inheritance (Has-A vs Is-A)', difficulty: 'Hard', time: '4h' },
      { id: 'oop-12', title: 'Coupling and Cohesion', difficulty: 'Medium', time: '2h' },
      { id: 'oop-13', title: 'Generics & Templates (Language Specific)', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: SOLID Principles',
    topics: [
      { id: 'oop-14', title: 'Single Responsibility Principle (SRP)', difficulty: 'Medium', time: '2h' },
      { id: 'oop-15', title: 'Open/Closed Principle (OCP)', difficulty: 'Hard', time: '3h' },
      { id: 'oop-16', title: 'Liskov Substitution Principle (LSP)', difficulty: 'Hard', time: '3h' },
      { id: 'oop-17', title: 'Interface Segregation Principle (ISP)', difficulty: 'Medium', time: '2h' },
      { id: 'oop-18', title: 'Dependency Inversion Principle (DIP)', difficulty: 'Hard', time: '3h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Essential Design Patterns',
    topics: [
      { id: 'oop-19', title: 'Creational: Singleton & Factory Method', difficulty: 'Medium', time: '4h' },
      { id: 'oop-20', title: 'Creational: Builder & Abstract Factory', difficulty: 'Hard', time: '4h' },
      { id: 'oop-21', title: 'Structural: Adapter, Decorator & Facade', difficulty: 'Hard', time: '5h' },
      { id: 'oop-22', title: 'Behavioral: Observer, Strategy & State', difficulty: 'Hard', time: '6h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Low-Level Design (LLD) Practice',
    topics: [
      { id: 'oop-23', title: 'UML Basics (Class, Use Case, Sequence Diagrams)', difficulty: 'Medium', time: '3h' },
      { id: 'oop-24', title: 'LLD Problem: Design a Parking Lot', difficulty: 'Hard', time: '4h' },
      { id: 'oop-25', title: 'LLD Problem: Design a Library Management System', difficulty: 'Hard', time: '4h' },
      { id: 'oop-26', title: 'LLD Problem: Design an Elevator System', difficulty: 'Hard', time: '5h' },
    ]
  }
];

const OOPRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the OOP roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('oop-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('oop-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = OOP_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Object-Oriented Design (OOP)</h1>
        <p>Master the four pillars of OOP, SOLID principles, and design patterns to ace Low-Level Design interviews.</p>
        
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
        {OOP_ROADMAP_DATA.map((section) => {
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

export default OOPRoadmap;