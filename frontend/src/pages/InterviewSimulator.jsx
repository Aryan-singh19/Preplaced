import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InterviewSimulator.css';

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "Data Scientist / ML Engineer"
];

const LEVELS = [
  "Junior",
  "Mid-Level",
  "Senior"
];

const InterviewSimulator = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // User input states
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [completedRounds, setCompletedRounds] = useState([]); // track previous evaluations
  const [aiProvider, setAiProvider] = useState("");

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, level: selectedLevel })
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
        setAiProvider(data.provider || 'AI Engine');
        setIsStarted(true);
        setCurrentIdx(0);
        setCompletedRounds([]);
        setEvaluation(null);
        setUserAnswer("");
      } else {
        alert(data.message || "Failed to fetch interview questions.");
      }
    } catch (e) {
      console.error(e);
      alert("Error starting mock interview session.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentIdx].question,
          answer: userAnswer,
          role: selectedRole
        })
      });
      const data = await response.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        setCompletedRounds(prev => [...prev, {
          question: questions[currentIdx].question,
          answer: userAnswer,
          evaluation: data.evaluation
        }]);
      } else {
        alert(data.message || "Failed to analyze answer.");
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting the evaluator engine.");
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setEvaluation(null);
    setUserAnswer("");
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finished all questions
      setCurrentIdx(questions.length); // trigger report screen
    }
  };

  const resetInterview = () => {
    setIsStarted(false);
    setQuestions([]);
    setCurrentIdx(0);
    setCompletedRounds([]);
    setEvaluation(null);
    setUserAnswer("");
  };

  // Render the initial setup screen
  if (!isStarted) {
    return (
      <div className="interview-outer-container font-sans text-gray-100" id="interview-setup-screen">
        <div className="interview-glow-sphere top-left"></div>
        <div className="interview-glow-sphere bottom-right"></div>

        <div className="interview-wrapper max-w-4xl mx-auto py-12 px-6">
          <div className="setup-hero-card text-center">
            <span className="premium-pill mb-4 inline-block">Enterprise-Grade AI Simulator</span>
            <h1 className="display-title font-medium tracking-tight">
              AI Interview <span className="gradient-highlight">Simulator</span>
            </h1>
            <p className="subtitle-desc text-gray-400 mt-3 max-w-xl mx-auto">
              Elevate your preparedness. Face randomized technical, behavioral, and practical scenario questions scored by open-source models.
            </p>
          </div>

          <div className="setup-grid-panel mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl">
            <div className="setup-control-group flex flex-col justify-between">
              <div>
                <h3 className="section-label-text uppercase text-xs font-mono tracking-wider text-zinc-500 mb-6">Configure Session</h3>
                
                <div className="input-group mb-6">
                  <label className="input-label block text-sm font-medium text-zinc-400 mb-2">Target Career Role</label>
                  <div className="select-wrapper relative">
                    <select 
                      id="role-selector"
                      className="custom-select w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="input-group mb-6">
                  <label className="input-label block text-sm font-medium text-zinc-400 mb-2">Target Seniority Level</label>
                  <div className="flex gap-3">
                    {LEVELS.map(lvl => (
                      <button
                        key={lvl}
                        id={`lvl-btn-${lvl}`}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          selectedLevel === lvl 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                        onClick={() => setSelectedLevel(lvl)}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                id="start-mock-btn"
                className="start-action-btn w-full mt-6 py-4 rounded-xl font-medium text-white transition-all duration-300 relative overflow-hidden"
                disabled={loading}
                onClick={startInterview}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner-dot"></span> Crafting Interview Questions...
                  </span>
                ) : (
                  <span>Initiate AI Interview Board →</span>
                )}
              </button>
            </div>

            <div className="setup-info-panel border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
              <h4 className="text-zinc-300 font-medium mb-3">What to Expect:</h4>
              <ul className="info-bullets space-y-4">
                <li className="flex gap-3 text-sm text-zinc-400">
                  <span className="bullet-icon-check">✓</span>
                  <span><strong>3 Dynamic Challenges:</strong> Adaptive blend of deep technical, problem-solving scenario, and critical behavioral queries.</span>
                </li>
                <li className="flex gap-3 text-sm text-zinc-400">
                  <span className="bullet-icon-check">✓</span>
                  <span><strong>High-Precision Score:</strong> Evaluated in real-time on grammar, vocabulary, conceptual accuracy, and completeness.</span>
                </li>
                <li className="flex gap-3 text-sm text-zinc-400">
                  <span className="bullet-icon-check">✓</span>
                  <span><strong>Interactive Coaching:</strong> Receive concrete strengths, missed concepts, and full copy-paste ready Model Answers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the reports/summary page when all questions are completed
  if (currentIdx >= questions.length) {
    const averageScore = Math.round(
      completedRounds.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / (completedRounds.length || 1)
    );

    return (
      <div className="interview-outer-container font-sans text-gray-100" id="interview-report-screen">
        <div className="interview-wrapper max-w-4xl mx-auto py-12 px-6">
          <div className="setup-hero-card text-center mb-8">
            <span className="premium-pill mb-4 inline-block success">Mock Session Complete</span>
            <h1 className="display-title font-medium tracking-tight text-3xl">
              Performance <span className="gradient-highlight-success">Report Card</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Role: <strong className="text-gray-200">{selectedRole}</strong> ({selectedLevel}) • Model Provider: <strong className="text-gray-200">{aiProvider}</strong>
            </p>
          </div>

          <div className="report-summary-board bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl">
            <div className="radial-score-display flex-shrink-0 flex flex-col items-center justify-center bg-zinc-950/80 border border-zinc-800 w-40 h-40 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <span className="score-num font-mono text-5xl font-bold text-green-400">{averageScore}%</span>
              <span className="score-label uppercase text-[10px] tracking-widest text-zinc-500 mt-1">Average Score</span>
            </div>
            
            <div className="report-brief">
              <h3 className="text-xl font-medium text-zinc-100 mb-2">Board Assessment Summary</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {averageScore >= 80 
                  ? "Outstanding execution! Your responses show mature technological vocabulary, excellent context setting, and robust structure. You are highly ready for live interviews."
                  : averageScore >= 60
                  ? "Solid foundation! You hit most core technical markers. To unlock premium packages, focus on providing structured STAR bullet points and quantifying project achievements with real-world metrics."
                  : "Good start! You are answering on-topic but need to expand on technical specifics and avoid overly general descriptions. Review the model answers carefully to bridge the vocabulary gap."}
              </p>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={resetInterview} 
                  id="restart-session-btn"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Start New Session
                </button>
                <button 
                  onClick={() => navigate('/landing')} 
                  id="exit-dashboard-btn"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Exit to Dashboard
                </button>
              </div>
            </div>
          </div>

          <h3 className="uppercase text-xs font-mono tracking-widest text-zinc-500 mb-4">Question Breakdown</h3>
          <div className="space-y-6">
            {completedRounds.map((round, idx) => (
              <div key={idx} className="round-report-card bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <span className="text-xs font-mono text-zinc-500 uppercase">Question {idx + 1} ({questions[idx]?.type})</span>
                    <h4 className="text-zinc-200 font-medium mt-1">{round.question}</h4>
                  </div>
                  <div className="score-badge font-mono text-sm bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full flex-shrink-0">
                    Score: {round.evaluation?.score}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-zinc-800/60">
                  <div>
                    <h5 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Your Answer</h5>
                    <p className="text-sm text-zinc-400 italic bg-zinc-950/40 p-3 rounded border border-zinc-900 leading-relaxed">
                      "{round.answer}"
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">AI Recommendation</h5>
                    <p className="text-sm text-zinc-300 mb-3">{round.evaluation?.feedback}</p>
                    
                    <div className="mb-2">
                      <strong className="text-[11px] uppercase text-green-400 tracking-wider">Strengths:</strong>
                      <ul className="list-disc pl-4 text-xs text-zinc-400 mt-1 space-y-1">
                        {round.evaluation?.strengths?.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-[11px] uppercase text-amber-400 tracking-wider">Improvements:</strong>
                      <ul className="list-disc pl-4 text-xs text-zinc-400 mt-1 space-y-1">
                        {round.evaluation?.improvements?.map((imp, iIdx) => <li key={iIdx}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800/60">
                  <h5 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Model Study Answer</h5>
                  <div className="text-xs text-zinc-300 font-mono bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-lg leading-relaxed relative">
                    {round.evaluation?.modelAnswer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render active interview simulator screen
  const currentQuestion = questions[currentIdx];

  return (
    <div className="interview-outer-container font-sans text-gray-100" id="active-interview-screen">
      <div className="interview-glow-sphere top-left"></div>
      <div className="interview-glow-sphere bottom-right"></div>

      <div className="interview-wrapper max-w-4xl mx-auto py-12 px-6">
        {/* Top Progress bar */}
        <div className="progress-nav flex items-center justify-between mb-8 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>ROLE: <strong>{selectedRole}</strong></span>
            <span>•</span>
            <span>LEVEL: <strong>{selectedLevel}</strong></span>
          </div>
          <div>
            QUESTION <strong>{currentIdx + 1}</strong> OF <strong>{questions.length}</strong>
          </div>
        </div>

        <div className="progress-bar-container bg-zinc-800 w-full h-1.5 rounded-full overflow-hidden mb-8">
          <div 
            className="progress-fill h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Active Question Card */}
        <div className="question-workspace bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full uppercase">
              {currentQuestion?.type || "Technical"} Challenge
            </span>
            <span className="text-xs font-mono text-zinc-500">Powered by {aiProvider}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-medium text-zinc-100 mb-4 leading-snug">
            {currentQuestion?.question}
          </h2>

          <div className="hint-alert bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl flex gap-3 mb-8">
            <span className="hint-bulb text-lg">💡</span>
            <div className="hint-text text-xs text-zinc-400 leading-relaxed">
              <strong>Interviewer's Focus:</strong> {currentQuestion?.hint}
            </div>
          </div>

          {/* User Input Stage */}
          <div className="answer-composer relative">
            <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Compose Your Response</label>
            <textarea
              id="user-answer-textarea"
              className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all leading-relaxed placeholder-zinc-700"
              placeholder="Explain your approach, tech stack selections, STAR elements, or lessons learned here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={evaluating || !!evaluation}
            ></textarea>
            
            <div className="composer-footer flex items-center justify-between text-xs font-mono text-zinc-600 mt-2">
              <span>Characters: {userAnswer.length} • Word count: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</span>
              <span>Recommended: 50+ words</span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="action-hub flex gap-3 mt-6">
            {!evaluation ? (
              <button
                id="submit-answer-btn"
                onClick={submitAnswer}
                disabled={evaluating || !userAnswer.trim()}
                className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  userAnswer.trim() 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]' 
                    : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-zinc-800'
                }`}
              >
                {evaluating ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner-dot"></span> AI Reviewing Response...
                  </span>
                ) : (
                  <span>Submit Answer for AI Review →</span>
                )}
              </button>
            ) : (
              <button
                id="next-question-btn"
                onClick={nextQuestion}
                className="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
              >
                <span>{currentIdx + 1 === questions.length ? "Finish & View Performance Report" : "Proceed to Next Question →"}</span>
              </button>
            )}
            
            {!evaluation && (
              <button
                id="skip-question-btn"
                onClick={nextQuestion}
                disabled={evaluating}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-6 rounded-xl text-sm transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>

        {/* Real-time feedback section */}
        {evaluation && (
          <div className="feedback-section mt-8 bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl animate-slide-up">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase">Assessment Results</span>
                <h3 className="text-lg font-medium text-zinc-100 mt-1">Interviewer Feedback</h3>
              </div>
              <div className="radial-badge-small flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 w-16 h-16 rounded-full">
                <span className="text-xl font-bold font-mono text-green-400">{evaluation.score}</span>
                <span className="text-[7px] uppercase tracking-widest text-zinc-500">Score</span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-6 leading-relaxed bg-zinc-950/40 p-4 rounded border border-zinc-900">
              "{evaluation.feedback}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-900">
                <strong className="text-xs uppercase text-green-400 tracking-wider">Core Strengths Detected:</strong>
                <ul className="list-disc pl-4 text-xs text-zinc-400 mt-2 space-y-2">
                  {evaluation.strengths?.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                </ul>
              </div>

              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-900">
                <strong className="text-xs uppercase text-amber-400 tracking-wider">Recommended Enhancements:</strong>
                <ul className="list-disc pl-4 text-xs text-zinc-400 mt-2 space-y-2">
                  {evaluation.improvements?.map((imp, iIdx) => <li key={iIdx}>{imp}</li>)}
                </ul>
              </div>
            </div>

            <div className="model-answer-section border-t border-zinc-800/60 pt-6">
              <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Model Study Answer</h4>
              <div className="text-xs text-zinc-300 font-mono bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-lg leading-relaxed">
                {evaluation.modelAnswer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;
