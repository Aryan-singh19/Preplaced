import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const PROMPT_ENGINEER_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: LLM Fundamentals & Basic Prompting',
    topics: [
      { id: 'pe-1', title: 'How LLMs Work (Tokens, Context Windows)', difficulty: 'Easy', time: '2h' },
      { id: 'pe-2', title: 'Model Parameters (Temperature, Top-P, Frequency Penalty)', difficulty: 'Medium', time: '2h' },
      { id: 'pe-3', title: 'Zero-Shot & Basic Instruction Formatting', difficulty: 'Easy', time: '1h' },
      { id: 'pe-4', title: 'Role Prompting & Persona Assignment', difficulty: 'Easy', time: '2h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Intermediate Techniques',
    topics: [
      { id: 'pe-5', title: 'Few-Shot Prompting (Selecting Good Examples)', difficulty: 'Medium', time: '3h' },
      { id: 'pe-6', title: 'Chain-of-Thought (CoT) Prompting ("Let\'s think step by step")', difficulty: 'Medium', time: '3h' },
      { id: 'pe-7', title: 'Formatting Outputs (JSON, Markdown, CSV extraction)', difficulty: 'Medium', time: '2h' },
      { id: 'pe-8', title: 'System Prompts vs User Prompts', difficulty: 'Easy', time: '1h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Advanced Prompt Engineering',
    topics: [
      { id: 'pe-9', title: 'Self-Consistency & Majority Voting', difficulty: 'Hard', time: '3h' },
      { id: 'pe-10', title: 'Tree of Thoughts (ToT) Framework', difficulty: 'Hard', time: '4h' },
      { id: 'pe-11', title: 'Generated Knowledge Prompting', difficulty: 'Medium', time: '2h' },
      { id: 'pe-12', title: 'Directional Stimulus Prompting', difficulty: 'Hard', time: '3h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Pipelines & Context Management',
    topics: [
      { id: 'pe-13', title: 'Prompt Chaining (Breaking down complex tasks)', difficulty: 'Medium', time: '4h' },
      { id: 'pe-14', title: 'Managing Context Limits (Summarization strategies)', difficulty: 'Medium', time: '3h' },
      { id: 'pe-15', title: 'Dynamic Prompt Templates (Variables & Injection)', difficulty: 'Easy', time: '2h' },
      { id: 'pe-16', title: 'Retrieval-Augmented Generation (RAG) for Prompters', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Safety, Security & Mitigation',
    topics: [
      { id: 'pe-17', title: 'Prompt Injection Attacks & Defense Tactics', difficulty: 'Hard', time: '4h' },
      { id: 'pe-18', title: 'Jailbreaks & Red Teaming LLMs', difficulty: 'Hard', time: '5h' },
      { id: 'pe-19', title: 'Mitigating Hallucinations (Grounding techniques)', difficulty: 'Medium', time: '3h' },
      { id: 'pe-20', title: 'Handling Bias and Toxicity Restrictions', difficulty: 'Medium', time: '2h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Tooling & APIs',
    topics: [
      { id: 'pe-21', title: 'Using the OpenAI / Anthropic APIs', difficulty: 'Medium', time: '3h' },
      { id: 'pe-22', title: 'Prompt Evaluation Metrics (BLEU, ROUGE, LLM-as-a-judge)', difficulty: 'Hard', time: '4h' },
      { id: 'pe-23', title: 'Function Calling / Tool Use Basics', difficulty: 'Hard', time: '4h' },
      { id: 'pe-24', title: 'Prompt Management Platforms (LangSmith, Weights & Biases)', difficulty: 'Medium', time: '3h' },
    ]
  }
];

const PromptEngineerRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the Prompt Engineer roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('prompt-engineer-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('prompt-engineer-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = PROMPT_ENGINEER_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Prompt Engineer Roadmap</h1>
        <p>Master the techniques of crafting optimized, secure, and complex prompt pipelines for Large Language Models.</p>
        
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
        {PROMPT_ENGINEER_ROADMAP_DATA.map((section) => {
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

export default PromptEngineerRoadmap;
