import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; 

const GENAI_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Deep Learning & NLP Foundations',
    topics: [
      { id: 'genai-1', title: 'Neural Network Fundamentals & Backpropagation', difficulty: 'Medium', time: '4h' },
      { id: 'genai-2', title: 'Deep Learning Frameworks (PyTorch/TensorFlow)', difficulty: 'Medium', time: '5h' },
      { id: 'genai-3', title: 'Word Embeddings (Word2Vec, GloVe)', difficulty: 'Easy', time: '3h' },
      { id: 'genai-4', title: 'Language Modeling Basics (N-grams to Neural LMs)', difficulty: 'Medium', time: '2h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Sequence Models & Attention',
    topics: [
      { id: 'genai-5', title: 'Recurrent Networks: RNNs, LSTMs, and GRU Memory Duration', difficulty: 'Hard', time: '5h' },
      { id: 'genai-6', title: 'Sequence-to-Sequence (Seq2Seq) Architecture', difficulty: 'Medium', time: '3h' },
      { id: 'genai-7', title: 'The Attention Mechanism (Bahdanau & Luong)', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: The Transformer Architecture',
    topics: [
      { id: 'genai-8', title: 'Self-Attention & Multi-Head Attention', difficulty: 'Hard', time: '4h' },
      { id: 'genai-9', title: 'Positional Encoding & Feed-Forward Networks', difficulty: 'Medium', time: '3h' },
      { id: 'genai-10', title: 'Encoder-Only Models (BERT & Masked Language Modeling)', difficulty: 'Medium', time: '4h' },
      { id: 'genai-11', title: 'Decoder-Only Models (GPT Architecture)', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Large Language Models (LLMs) & Fine-Tuning',
    topics: [
      { id: 'genai-12', title: 'LLM Tokenization Strategies (BPE, SentencePiece)', difficulty: 'Medium', time: '3h' },
      { id: 'genai-13', title: 'Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA)', difficulty: 'Hard', time: '5h' },
      { id: 'genai-14', title: 'Reinforcement Learning for LLMs (RLHF & DQN Agent Pipelines)', difficulty: 'Hard', time: '6h' },
      { id: 'genai-15', title: 'Prompt Engineering & In-Context Learning (Few-Shot, CoT)', difficulty: 'Easy', time: '3h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Retrieval-Augmented Generation (RAG)',
    topics: [
      { id: 'genai-16', title: 'Vector Databases & Similarity Search (Pinecone, Milvus)', difficulty: 'Medium', time: '4h' },
      { id: 'genai-17', title: 'Embedding Models (OpenAI, HuggingFace BGE)', difficulty: 'Easy', time: '2h' },
      { id: 'genai-18', title: 'Building RAG Pipelines (LangChain, LlamaIndex)', difficulty: 'Medium', time: '5h' },
      { id: 'genai-19', title: 'Advanced RAG (Semantic Chunking, Reranking, Multi-Query)', difficulty: 'Hard', time: '4h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Agents & Multimodal AI',
    topics: [
      { id: 'genai-20', title: 'Building Autonomous AI Agents (ReAct Framework)', difficulty: 'Hard', time: '5h' },
      { id: 'genai-21', title: 'Function Calling & Tool Usage in LLMs', difficulty: 'Medium', time: '4h' },
      { id: 'genai-22', title: 'Diffusion Models & Image Generation (Stable Diffusion)', difficulty: 'Hard', time: '4h' },
      { id: 'genai-23', title: 'Vision-Language Models (VLMs) Architecture', difficulty: 'Medium', time: '3h' },
    ]
  }
];

const GenAIRoadmap = () => {
  // 1. Load saved progress using a UNIQUE KEY for the GenAI roadmap
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('genai-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // 2. Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('genai-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = GENAI_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Generative AI Roadmap</h1>
        <p>Master the architectures behind modern AI, from Transformers to RLHF, and build production-ready LLM applications.</p>
        
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
        {GENAI_ROADMAP_DATA.map((section) => {
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

export default GenAIRoadmap;