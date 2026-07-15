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

  // AI Explanation States
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [aiProvider, setAiProvider] = useState("");

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
    // Only allow changing selection if not already requested explanation for this question
    if (!explanation) {
      setSelectedOption(option);
    }
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    
    setSelectedOption(null);
    setExplanation(null);
    setAiProvider("");
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const fetchAIExplanation = async () => {
    setLoadingExplanation(true);
    try {
      const response = await fetch('/api/interview/quiz-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          options: questions[currentQuestionIndex].options,
          correctAnswer: questions[currentQuestionIndex].answer,
          userSelection: selectedOption
        })
      });
      const data = await response.json();
      if (data.success) {
        setExplanation(data.explanation);
        setAiProvider(data.provider);
      } else {
        alert("Failed to fetch AI explanation.");
      }
    } catch (error) {
      console.error("Explanation fetch error:", error);
      alert("Error contacting explanation engine.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setExplanation(null);
    setAiProvider("");
  };

  const currentQuestion = questions[currentQuestionIndex];

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
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-container">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQuestion.answer;
              let optionClass = "option-box";
              
              if (isSelected) {
                optionClass += " selected";
              }
              // If explanation is visible, color-code the options so the user learns
              if (explanation) {
                if (isCorrect) {
                  optionClass += " option-correct";
                } else if (isSelected) {
                  optionClass += " option-wrong";
                }
              }

              return (
                <div 
                  key={i} 
                  className={optionClass}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt}
                </div>
              );
            })}
          </div>

          <div className="quiz-actions flex gap-4 mt-6">
            <button 
              className="next-btn flex-1" 
              disabled={!selectedOption} 
              onClick={handleNext}
            >
              {currentQuestionIndex + 1 === questions.length ? 'Submit Quiz' : 'Next Question'}
            </button>

            <button
              className={`ai-explain-trigger-btn flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-semibold text-sm transition-all ${
                loadingExplanation 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : explanation
                  ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-900/60 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_15px_rgba(99,102,241,0.25)]'
              }`}
              onClick={fetchAIExplanation}
              disabled={loadingExplanation || !!explanation}
            >
              {loadingExplanation ? (
                <>
                  <span className="quiz-spinner"></span>
                  <span>AI Thinking...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Explain with AI</span>
                </>
              )}
            </button>
          </div>

          {/* AI Explanation slide-down card */}
          {explanation && (
            <div className="quiz-explanation-card mt-6 p-6 bg-zinc-950 border border-zinc-800/80 rounded-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                  AI Deep Explanation
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">
                  Powered by {aiProvider}
                </span>
              </div>

              <div className="explanation-section mb-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
                  Derivation & Analysis
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {explanation.explanation}
                </p>
              </div>

              {explanation.shortcut && (
                <div className="shortcut-section bg-amber-500/5 border border-amber-500/10 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide block mb-1">
                    💡 Shortcut Formula / Trick
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {explanation.shortcut}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
