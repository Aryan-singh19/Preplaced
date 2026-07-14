import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JeeBanner from '../components/JeeBanner';
import LivelyPathBanner from '../components/LivelyPathBanner'; // Adjust path if needed
import '../styles/Aptitude.css';

const Aptitude = () => {
  const navigate = useNavigate();
  const [expandedSubject, setExpandedSubject] = useState(null);
  
  const subjects = [
    { id: 1, name: 'Quantitative Aptitude', topics: 'Arithmetic, Algebra, Geometry', icon: '🔢' },
    { id: 2, name: 'Logical Reasoning', topics: 'Series, Puzzles, Syllogisms', icon: '🧠' },
    { id: 3, name: 'Verbal Ability', topics: 'Grammar, Reading, Vocabulary', icon: '✍️' },
    { id: 4, name: 'Data Interpretation', topics: 'Graphs, Charts, Tables', icon: '📊' },
    { id: 5, name: 'Programming MCQ', topics: 'C++, Java, Python, DSA', icon: '💻' },
    { id: 6, name: 'General Awareness', topics: 'Current Affairs, Static GK', icon: '🌍' },
  ];

  // Dynamically generate 3 tests for whichever subject is selected
  const testsToGenerate = [1, 2, 3];

  const handleToggle = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const handleTestSelect = (subjectId, testNumber) => {
    navigate(`/quiz/${subjectId}/test${testNumber}`);
  };

  return (
    <>
      <JeeBanner />
      <div className="apti-container enhanced-bg">
        <div className="apti-header">
          <h1>Practice Aptitude</h1>
          <p>Select a subject to start your practice session</p>
        </div>
        
        <div className="subject-list-vertical">
          {subjects.map((sub) => (
            <div key={sub.id} className="subject-box-vertical">
              
              {/* Accordion Header (Clickable) */}
              <div 
                className="subject-header-row" 
                onClick={() => handleToggle(sub.id)}
              >
                <div className="sub-icon-vertical">{sub.icon}</div>
                <div className="subject-info-vertical">
                  <h3>{sub.name}</h3>
                  <p>{sub.topics}</p>
                </div>
                
                {/* Chevron Arrow */}
                <div className={`chevron-container ${expandedSubject === sub.id ? 'open' : ''}`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* Accordion Expanded Content */}
              {expandedSubject === sub.id && (
                <div className="subject-tests-container">
                  {testsToGenerate.map((num) => (
                    <div
                      key={num}
                      className="test-item"
                      onClick={() => handleTestSelect(sub.id, num)}
                    >
                      <span className="test-name">{`${sub.name} ${num}`}</span>
                      <span className="play-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <LivelyPathBanner />
    </>
  );
};

export default Aptitude;