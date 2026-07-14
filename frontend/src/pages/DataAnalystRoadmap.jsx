import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const DATA_ANALYST_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Spreadsheets & Foundations',
    topics: [
      { id: 'da-1', title: 'Advanced Formulas (VLOOKUP, INDEX/MATCH, XLOOKUP)', difficulty: 'Easy', time: '3h' },
      { id: 'da-2', title: 'Pivot Tables & Pivot Charts', difficulty: 'Medium', time: '2h' },
      { id: 'da-3', title: 'Data Cleaning in Excel', difficulty: 'Easy', time: '2h' },
      { id: 'da-4', title: 'Power Query Fundamentals', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Database & SQL Mastery',
    topics: [
      { id: 'da-5', title: 'Basic Queries (SELECT, WHERE, ORDER BY)', difficulty: 'Easy', time: '2h' },
      { id: 'da-6', title: 'Grouping & Aggregation (GROUP BY, HAVING)', difficulty: 'Medium', time: '3h' },
      { id: 'da-7', title: 'Advanced Joins & Set Operations', difficulty: 'Medium', time: '4h' },
      { id: 'da-8', title: 'Subqueries & CTEs (Common Table Expressions)', difficulty: 'Hard', time: '3h' },
      { id: 'da-9', title: 'Window Functions (RANK, DENSE_RANK, LEAD/LAG)', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Business Intelligence (BI) Tools',
    topics: [
      { id: 'da-10', title: 'Connecting Data Sources in Tableau / Power BI', difficulty: 'Easy', time: '2h' },
      { id: 'da-11', title: 'Building Interactive Dashboards', difficulty: 'Medium', time: '5h' },
      { id: 'da-12', title: 'Calculated Fields & DAX Basics (Power BI)', difficulty: 'Hard', time: '6h' },
      { id: 'da-13', title: 'Data Storytelling & Design Best Practices', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Programming with Python',
    topics: [
      { id: 'da-14', title: 'Python Basics (Variables, Loops, Functions)', difficulty: 'Easy', time: '4h' },
      { id: 'da-15', title: 'Data Structures (Lists, Dictionaries, Sets)', difficulty: 'Medium', time: '3h' },
      { id: 'da-16', title: 'Data Manipulation with Pandas (Series & DataFrames)', difficulty: 'Hard', time: '6h' },
      { id: 'da-17', title: 'Numerical Computing with NumPy', difficulty: 'Medium', time: '3h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Statistics & Exploratory Data Analysis',
    topics: [
      { id: 'da-18', title: 'Descriptive Statistics (Mean, Median, Variance)', difficulty: 'Easy', time: '2h' },
      { id: 'da-19', title: 'Probability Distributions & Central Limit Theorem', difficulty: 'Medium', time: '4h' },
      { id: 'da-20', title: 'Hypothesis Testing & A/B Testing Basics', difficulty: 'Hard', time: '5h' },
      { id: 'da-21', title: 'EDA & Visualizations in Python (Matplotlib/Seaborn)', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Advanced Analytics & Career Prep',
    topics: [
      { id: 'da-22', title: 'Introduction to Predictive Modeling (Linear Regression)', difficulty: 'Hard', time: '5h' },
      { id: 'da-23', title: 'Web Scraping Basics (BeautifulSoup)', difficulty: 'Medium', time: '3h' },
      { id: 'da-24', title: 'Version Control (Git & GitHub for Data Analysts)', difficulty: 'Easy', time: '2h' },
      { id: 'da-25', title: 'Building an End-to-End Portfolio Project', difficulty: 'Hard', time: '8h' },
    ]
  }
];

const DataAnalystRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the Data Analyst roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('data-analyst-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('data-analyst-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = DATA_ANALYST_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Data Analyst Roadmap</h1>
        <p>Master data manipulation, advanced SQL, Python, and interactive visualizations to drive business decisions.</p>
        
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
        {DATA_ANALYST_ROADMAP_DATA.map((section) => {
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

export default DataAnalystRoadmap;