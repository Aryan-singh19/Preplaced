import React, { useState } from 'react';
import '../styles/Roadmaps.css';

const InterviewAI = () => {
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h1>AI Mock Interview</h1>
        <p>Practice technical and HR rounds with our real-time AI interviewer.</p>
      </div>

      <div className="interview-workspace">
        {/* Left Side: Video Feed Placeholder */}
        <div className="video-section">
          <div className="camera-box">
            {isLive ? (
              <div className="live-indicator">LIVE</div>
            ) : (
              <div className="camera-off">Camera is Off</div>
            )}
          </div>
          <div className="controls">
            <button 
              className={isLive ? "stop-btn" : "start-btn"} 
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? "End Session" : "Start Interview"}
            </button>
          </div>
        </div>

        {/* Right Side: AI Interaction */}
        <div className="ai-interaction">
          <div className="chat-window">
            <div className="ai-message">
              <strong>AI:</strong> Welcome! Are you ready to begin the frontend developer mock interview?
            </div>
            {isLive && (
              <div className="user-transcript">
                <em>[Listening for your response...]</em>
              </div>
            )}
          </div>
          <div className="feedback-hint">
            <h4>Real-time Feedback</h4>
            <p>Speak clearly. AI will analyze your confidence and technical accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAI;