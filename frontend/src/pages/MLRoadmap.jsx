import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; // Ensure this points to your CSS

const ML_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Foundations & Classical ML',
    topics: [
      { id: 'ml-1', title: 'Linear & Logistic Regression', difficulty: 'Easy', time: '3h' },
      { id: 'ml-2', title: 'Decision Trees & Random Forests', difficulty: 'Medium', time: '4h' },
      { id: 'ml-3', title: 'Support Vector Machines (SVM) & Kernels', difficulty: 'Medium', time: '4h' },
      { id: 'ml-4', title: 'Clustering (K-Means, DBSCAN, PCA)', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Deep Learning Architectures',
    topics: [
      { id: 'ml-5', title: 'Neural Network Fundamentals (Backprop, Optimizers)', difficulty: 'Medium', time: '5h' },
      { id: 'ml-6', title: 'Convolutional Neural Networks (CNNs) & Computer Vision', difficulty: 'Medium', time: '5h' },
      { id: 'ml-7', title: 'Sequence Models: RNNs, LSTMs, and GRUs', difficulty: 'Hard', time: '6h' },
      { id: 'ml-8', title: 'Attention Mechanisms & Transformers', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Reinforcement Learning (RL)',
    topics: [
      { id: 'ml-9', title: 'Markov Decision Processes (MDPs)', difficulty: 'Medium', time: '3h' },
      { id: 'ml-10', title: 'Q-Learning & Deep Q-Networks (DQN)', difficulty: 'Hard', time: '5h' },
      { id: 'ml-11', title: 'Dueling DQN & Prioritized Experience Replay', difficulty: 'Hard', time: '6h' },
      { id: 'ml-12', title: 'Policy Gradients & PPO', difficulty: 'Hard', time: '6h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: ML Engineering & Ops (MLOps)',
    topics: [
      { id: 'ml-13', title: 'Data Pipeline Engineering (Pandas, DVC)', difficulty: 'Medium', time: '4h' },
      { id: 'ml-14', title: 'Model Tracking & Experimentation (Weights & Biases)', difficulty: 'Easy', time: '2h' },
      { id: 'ml-15', title: 'Distributed Training & GPU Optimization', difficulty: 'Hard', time: '6h' },
      { id: 'ml-16', title: 'Model Deployment (FastAPI, Docker, Triton Inference)', difficulty: 'Medium', time: '5h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Research & Specialized Topics',
    topics: [
      { id: 'ml-17', title: 'De Novo Drug Design Pipeline', difficulty: 'Hard', time: '8h' },
      { id: 'ml-18', title: 'Generative Models (GANs, VAEs, Diffusion)', difficulty: 'Hard', time: '6h' },
      { id: 'ml-19', title: 'Evaluation Metrics (ROC-AUC, CAP, Accuracy Ratio)', difficulty: 'Medium', time: '3h' },
    ]
  }
];

const MLRoadmap = () => {
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('ml-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  useEffect(() => {
    localStorage.setItem('ml-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = ML_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      <div className="roadmap-header">
        <h1>Machine Learning Roadmap</h1>
        <p>From classical algorithms to advanced deep reinforcement learning pipelines for drug discovery.</p>
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
        {ML_ROADMAP_DATA.map((section) => {
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
                          <div className={`custom-checkbox ${isDone ? 'checked' : ''}`}>{isDone && '✓'}</div>
                          <span className="topic-title">{topic.title}</span>
                        </div>
                        <div className="topic-right">
                          <span className={`difficulty-tag ${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
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

export default MLRoadmap;