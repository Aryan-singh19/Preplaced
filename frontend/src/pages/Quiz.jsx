import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizData } from '../data/quizData';
import '../styles/Quiz.css';

const Quiz = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const questions = quizData[subjectId] || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="result-card">
          <h2>No questions available!</h2>
          <button onClick={() => navigate('/aptitude')} className="btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <div className="quiz-container">
      {showResult ? (
        <div className="result-card">
          <h2>Quiz Completed! 🎉</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <div className="result-buttons">
            <button onClick={restartQuiz} className="btn-primary">Restart</button>
            <button onClick={() => navigate('/aptitude')} className="btn-secondary">Back to Subjects</button>
          </div>
        </div>
      ) : (
        <div className="question-card">
          <div className="quiz-header">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <h2 className="question-text">{questions[currentQuestionIndex].question}</h2>
          
          <div className="options-container">
            {questions[currentQuestionIndex].options.map((opt, i) => (
              <div 
                key={i} 
                className={`option-box ${selectedOption === opt ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(opt)}
              >
                {opt}
              </div>
            ))}
          </div>

          <button 
            className="next-btn" 
            disabled={!selectedOption} 
            onClick={handleNext}
          >
            {currentQuestionIndex + 1 === questions.length ? 'Submit' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
