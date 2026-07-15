import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  User,
  Sparkles,
  Menu,
  X,
  FileText,
  Award,
  AlertCircle,
  Timer,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Check,
  ChevronRight as ArrowRight
} from 'lucide-react';
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

const PERSONAS = [
  {
    id: "coach",
    name: "Sarah Jenkins",
    title: "Empathetic Technical Coach",
    avatar: "👩‍🏫",
    description: "Friendly, encouraging, and highly constructive. Guides you using the structured STAR framework to boost your delivery and confidence.",
    quote: "Let's focus on structuring your thoughts and highlighting your core capabilities with positive impact!",
    accentColor: "border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-emerald-500/10"
  },
  {
    id: "savage",
    name: "Alex Sterling",
    title: "Savage Tech Lead",
    avatar: "🧔",
    description: "Brutally honest, dry, and analytical. Demands optimal Big-O performance, deep architectural trade-offs, and rejects high-level fluff.",
    quote: "Tell me exactly how this scales under load. Keep the explanations direct and omit any generic definitions.",
    accentColor: "border-rose-500 text-rose-400 bg-rose-950/20 shadow-rose-500/10"
  },
  {
    id: "behavioral",
    name: "Devon Vance",
    title: "Senior HR Specialist",
    avatar: "🧑‍💼",
    description: "Consultative and values-focused. Measures ownership, collaborative maturity, conflict resolution, and communication protocols.",
    quote: "I want to see how you resolve friction, take responsibility, and champion engineering standards in team setups.",
    accentColor: "border-amber-500 text-amber-400 bg-amber-950/20 shadow-amber-500/10"
  }
];

const InterviewSimulator = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
  const [selectedPersona, setSelectedPersona] = useState("coach");
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // User Response states
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [completedRounds, setCompletedRounds] = useState([]); // track previous evaluations
  const [aiProvider, setAiProvider] = useState("");

    // Interactive Utilities
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDictating, setIsDictating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [timerActive, setTimerActive] = useState(true);

  // Accordion toggle states for final report card (stores index of expanded questions)
  const [expandedReports, setExpandedReports] = useState({ 0: true });

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // Stop synthesis question speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Stop browser dictation / speech recognition
  const stopDictating = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }
    setIsDictating(false);
  };

  // Speaks the current question out loud using standard Web Speech API
  const speakQuestion = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick a high-quality female or male professional English voice if available
    const voices = window.speechSynthesis.getVoices();
    const optimalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('David')));
    if (optimalVoice) {
      utterance.voice = optimalVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechUtteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Start dictation (Voice to text) using Web Speech API
  const startDictating = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not natively supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsDictating(true);
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsDictating(false);
      };

      rec.onend = () => {
        setIsDictating(false);
      };

      rec.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setUserAnswer(prev => prev + (prev.endsWith(' ') || prev === "" ? "" : " ") + finalTranscript);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setIsDictating(false);
    }
  };

  const toggleDictation = () => {
    if (isDictating) {
      stopDictating();
    } else {
      startDictating();
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Auto-collapse sidebar on smaller screens initially
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // run once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer Controller
  useEffect(() => {
    if (isStarted && currentIdx < questions.length && timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time is up warning
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, currentIdx, timerActive, timeLeft, questions.length]);

  // Cleanup speech/voice systems on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopDictating();
    };
  }, []);

  // API Call: Initiate /questions
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
        setTimeLeft(300);
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

  // API Call: Submit answer & evaluate using chosen Persona style
  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    stopSpeaking();
    stopDictating();
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentIdx].question,
          answer: userAnswer,
          role: selectedRole,
          persona: selectedPersona
        })
      });
      const data = await response.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        setCompletedRounds(prev => [...prev, {
          question: questions[currentIdx].question,
          answer: userAnswer,
          evaluation: data.evaluation,
          type: questions[currentIdx]?.type || "Technical"
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
      // Finished all questions, enter report card
      setCurrentIdx(questions.length);
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

  // Download high fidelity report transcript as a formatted Markdown file
  const downloadReportMD = () => {
    const averageScore = Math.round(
      completedRounds.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / (completedRounds.length || 1)
    );

    const activePersonaName = PERSONAS.find(p => p.id === selectedPersona)?.name || "Sarah Jenkins";

    let mdContent = `# PLACEMATE AI • MOCK INTERVIEW SIMULATOR REPORT CARD\n`;
    mdContent += `=========================================================\n\n`;
    mdContent += `## SESSION SUMMARY\n`;
    mdContent += `- **Career Role**: ${selectedRole}\n`;
    mdContent += `- **Seniority Level**: ${selectedLevel}\n`;
    mdContent += `- **Assessed Average Score**: ${averageScore}%\n`;
    mdContent += `- **Assigned Board Persona**: ${activePersonaName} (${selectedPersona.toUpperCase()})\n`;
    mdContent += `- **AI Core Provider**: ${aiProvider}\n`;
    mdContent += `- **Timestamp**: ${new Date().toLocaleString()}\n\n`;
    mdContent += `---------------------------------------------------------\n\n`;

    mdContent += `## CORE BOARD ASSESSMENT\n`;
    if (averageScore >= 80) {
      mdContent += `Outstanding delivery! The candidate possesses excellent conceptual clarity, STAR framework compliance, and appropriate technical vocabulary. Highly recommended for production-ready hiring.\n\n`;
    } else if (averageScore >= 60) {
      mdContent += `Solid capabilities! Candidate successfully targets core technical parameters. Recommendations for scaling up include structuring responses cleanly and emphasizing metrics.\n\n`;
    } else {
      mdContent += `Requires revision. The candidate demonstrates topical familiarity but has notable gaps in specific implementations. Focus on reviewing high-precision model answers.\n\n`;
    }

    mdContent += `---------------------------------------------------------\n\n`;
    mdContent += `## CHALLENGE-BY-CHALLENGE BREAKDOWN\n\n`;

    completedRounds.forEach((round, idx) => {
      mdContent += `### CHALLENGE ${idx + 1}: [${round.type}] ${round.question}\n`;
      mdContent += `- **Assessed Score**: ${round.evaluation?.score || 0}%\n\n`;
      mdContent += `#### YOUR ANSWER:\n`;
      mdContent += `> "${round.answer}"\n\n`;
      mdContent += `#### INTERVIEWER CRITIQUE:\n`;
      mdContent += `"${round.evaluation?.feedback || "No feedback provided."}"\n\n`;

      mdContent += `#### KEY STRENGTHS:\n`;
      if (round.evaluation?.strengths?.length) {
        round.evaluation.strengths.forEach(s => {
          mdContent += `- ${s}\n`;
        });
      } else {
        mdContent += `- Baseline response alignment.\n`;
      }
      mdContent += `\n`;

      mdContent += `#### REQUISITE IMPROVEMENTS:\n`;
      if (round.evaluation?.improvements?.length) {
        round.evaluation.improvements.forEach(i => {
          mdContent += `- ${i}\n`;
        });
      } else {
        mdContent += `- No critical syntax or semantic revisions required.\n`;
      }
      mdContent += `\n`;

      mdContent += `#### RECOMMENDED STUDY GUIDE / MODEL ANSWER:\n`;
      mdContent += `\`\`\`text\n${round.evaluation?.modelAnswer || "N/A"}\n\`\`\`\n\n`;
      mdContent += `---------------------------------------------------------\n\n`;
    });

    mdContent += `\nReport generated by Placemate AI. Elevate your placement journey today!`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Placemate_Interview_Report_${selectedRole.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAccordion = (idx) => {
    setExpandedReports(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // 1. RENDER INTERVIEW CONFIGURATION SETUP SCREEN
  if (!isStarted) {
    return (
      <div className="interview-outer-container font-sans text-gray-100" id="interview-setup-screen">
        <div className="interview-glow-sphere top-left"></div>
        <div className="interview-glow-sphere bottom-right"></div>

        <div className="interview-wrapper max-w-5xl mx-auto py-12 px-6">
          <div className="setup-hero-card text-center mb-10">
            <span className="premium-pill mb-4 inline-block flex items-center justify-center gap-1.5 mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Customizable Premium AI Board Simulator
            </span>
            <h1 className="display-title font-medium tracking-tight">
              AI Mock Interview <span className="gradient-highlight">Board</span>
            </h1>
            <p className="subtitle-desc text-gray-400 mt-3 max-w-2xl mx-auto">
              Empower your placement training. Test your wits against diverse interviewer profiles, complete with instant detailed feedback, voice dictation, and comprehensive model study cards.
            </p>
          </div>

          {/* Grid Layout containing Configuration on Left, Persona Picker on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Config Panel */}
            <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  <h3 className="section-label-text uppercase text-xs font-mono tracking-wider text-zinc-400">Configure Parameters</h3>
                </div>

                <div className="input-group mb-6">
                  <label className="input-label block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Target Career Path</label>
                  <select 
                    id="role-selector"
                    className="custom-select w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-sm"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="input-group mb-8">
                  <label className="input-label block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Target Seniority Grade</label>
                  <div className="flex gap-3">
                    {LEVELS.map(lvl => (
                      <button
                        key={lvl}
                        id={`lvl-btn-${lvl}`}
                        className={`flex-1 py-3 rounded-xl border text-xs font-semibold transition-all ${
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

                <div className="border-t border-zinc-800/80 pt-6 mt-6">
                  <h4 className="text-zinc-300 text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Board Structure Overview
                  </h4>
                  <ul className="space-y-3.5 text-xs text-zinc-400">
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>3 Structured Scenarios:</strong> Covers Technical, Domain/System Architecture, and STAR Behavioral questions.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Interactive Sandbox:</strong> Voice-to-text dictate option + voice read aloud synthesis available.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Study Export:</strong> Download full report containing strengths, gaps, and copyable ideal sample responses.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                id="start-mock-btn"
                className="start-action-btn w-full mt-8 py-4 rounded-xl font-semibold text-sm text-white transition-all duration-300 relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]"
                disabled={loading}
                onClick={startInterview}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner-dot"></span> Crafting Simulated Board...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    Assemble AI Board & Initiate <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

            {/* Right Column: Persona Picker Panel */}
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <h3 className="section-label-text uppercase text-xs font-mono tracking-wider text-zinc-400">Choose Your Interviewer Persona</h3>
                </div>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">Selects Tone & Criteria</span>
              </div>

              <div className="space-y-4">
                {PERSONAS.map(p => {
                  const isChosen = selectedPersona === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPersona(p.id)}
                      className={`persona-card p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                        isChosen 
                          ? `${p.accentColor} border-2`
                          : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-950/90'
                      }`}
                    >
                      <div className="persona-avatar text-4xl flex items-center justify-center bg-zinc-900/80 w-16 h-16 rounded-xl border border-zinc-800 flex-shrink-0">
                        {p.avatar}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-semibold ${isChosen ? 'text-white' : 'text-zinc-200'}`}>
                            {p.name}
                          </h4>
                          {isChosen && (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                              Active Lead
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-zinc-500 block mb-1.5">{p.title}</span>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-3">{p.description}</p>
                        
                        <div className="persona-quote text-[11px] italic text-zinc-400 border-l border-indigo-500/20 pl-3 leading-normal">
                          "{p.quote}"
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER COMPLETED INTERVIEW PERFORMANCE REPORT CARD
  if (currentIdx >= questions.length) {
    const averageScore = Math.round(
      completedRounds.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / (completedRounds.length || 1)
    );

    const activePersona = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

    return (
      <div className="interview-outer-container font-sans text-gray-100" id="interview-report-screen">
        <div className="interview-glow-sphere top-left"></div>
        <div className="interview-glow-sphere bottom-right"></div>

        <div className="interview-wrapper max-w-4xl mx-auto py-12 px-6 animate-fade-in">
          
          <div className="setup-hero-card text-center mb-8">
            <span className="premium-pill mb-4 inline-block success flex items-center justify-center gap-1 mx-auto max-w-fit">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Board Assessment Concluded
            </span>
            <h1 className="display-title font-medium tracking-tight text-3xl">
              Performance <span className="gradient-highlight-success">Report Card</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Role Focus: <strong className="text-gray-200">{selectedRole}</strong> ({selectedLevel}) • Assessor: <strong className="text-gray-200">{activePersona.name}</strong>
            </p>
          </div>

          {/* Interactive Report Summary Board */}
          <div className="report-summary-board bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-600 bg-zinc-950/40 border-b border-l border-zinc-800">
              Evaluator: {aiProvider}
            </div>

            <div className="radial-score-display flex-shrink-0 flex flex-col items-center justify-center bg-zinc-950/80 border border-zinc-800 w-44 h-44 rounded-full shadow-[0_0_35px_rgba(34,197,94,0.12)]">
              <span className="score-num font-mono text-5xl font-bold text-green-400">{averageScore}%</span>
              <span className="score-label uppercase text-[10px] tracking-widest text-zinc-500 mt-1">Weighted Grade</span>
            </div>
            
            <div className="report-brief flex-1">
              <span className="text-xs font-mono text-zinc-500 uppercase">Board Executive Statement</span>
              <h3 className="text-xl font-medium text-zinc-100 mt-0.5 mb-2.5">
                Summary Verdict
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {averageScore >= 80 
                  ? `Brilliant completion. Under the criteria of ${activePersona.name}, your performance showed high structural integrity, robust specific engineering terminologies, and correct conceptual framework mapping. Highly hireable!`
                  : averageScore >= 60
                  ? `Successful foundation demonstrated. You hit major parameters but can improve precision. Under ${activePersona.name}'s guidelines, you should include more quantitative metrics and apply the STAR framework.`
                  : `Revision recommended. Technical or structural gaps were noted by ${activePersona.name}. We strongly recommend examining the model study guides below and practicing another round.`
                }
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={resetInterview} 
                  id="restart-session-btn"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-[0_4px_15px_rgba(99,102,241,0.25)]"
                >
                  Start New Session
                </button>
                <button 
                  onClick={downloadReportMD}
                  id="download-transcript-btn"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-5 py-3 rounded-xl transition-all border border-zinc-700 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" /> Download Report (.md)
                </button>
                <button 
                  onClick={() => navigate('/landing')} 
                  id="exit-dashboard-btn"
                  className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-semibold px-5 py-3 rounded-xl transition-colors border border-zinc-800"
                >
                  Exit Dashboard
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="uppercase text-xs font-mono tracking-widest text-zinc-400 font-bold">Interactive Question Breakdown</h3>
            <span className="text-xs text-zinc-500">Click headers to expand/collapse</span>
          </div>

          {/* Interactive Accordion Panel List */}
          <div className="space-y-4">
            {completedRounds.map((round, idx) => {
              const isExpanded = !!expandedReports[idx];
              return (
                <div 
                  key={idx} 
                  className={`accordion-item bg-zinc-900/40 border rounded-xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'border-zinc-700 shadow-lg' : 'border-zinc-800/80 hover:border-zinc-700/60'
                  }`}
                >
                  {/* Accordion Header */}
                  <div 
                    onClick={() => toggleAccordion(idx)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-zinc-950/30 hover:bg-zinc-950/60 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          Question {idx + 1} • {round.type}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          round.evaluation?.score >= 80 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                            : round.evaluation?.score >= 60
                            ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                        }`}>
                          Score: {round.evaluation?.score}%
                        </span>
                      </div>
                      <h4 className="text-zinc-200 font-medium text-sm md:text-base pr-4">
                        {round.question}
                      </h4>
                    </div>

                    <div className="text-zinc-500 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800/80">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Accordion Expandable Content */}
                  {isExpanded && (
                    <div className="p-6 border-t border-zinc-800 bg-zinc-950/20 animate-slide-up">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Sub-Column: Your Response */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Your Submitted Answer</h5>
                            <span className="text-[10px] font-mono text-zinc-600">{round.answer.split(/\s+/).length} words</span>
                          </div>
                          <p className="text-sm text-zinc-300 italic bg-zinc-950/70 p-4 rounded-xl border border-zinc-900 leading-relaxed font-sans min-h-[120px] whitespace-pre-wrap">
                            "{round.answer}"
                          </p>
                        </div>

                        {/* Right Sub-Column: Critique */}
                        <div>
                          <h5 className="text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wide">Assessor Critique</h5>
                          <p className="text-sm text-zinc-300 mb-4 bg-zinc-950/30 p-4 rounded-xl border border-zinc-900/60 leading-relaxed">
                            {round.evaluation?.feedback}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div className="bg-emerald-950/10 border border-emerald-500/10 p-3.5 rounded-xl">
                              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                                Strengths Detected:
                              </span>
                              <ul className="list-disc pl-3 text-[11px] text-zinc-400 space-y-1">
                                {round.evaluation?.strengths?.map((str, sIdx) => <li key={sIdx}>{str}</li>) || <li>Answer aligned with challenge context.</li>}
                              </ul>
                            </div>

                            <div className="bg-amber-950/10 border border-amber-500/10 p-3.5 rounded-xl">
                              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                                Key Enhancements:
                              </span>
                              <ul className="list-disc pl-3 text-[11px] text-zinc-400 space-y-1">
                                {round.evaluation?.improvements?.map((imp, iIdx) => <li key={iIdx}>{imp}</li>) || <li>No critical deficiencies noted.</li>}
                              </ul>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Bottom row: Study answer */}
                      <div className="mt-6 pt-5 border-t border-zinc-800/80">
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Model Study Guide Answer</h5>
                        </div>
                        <div className="text-xs text-zinc-300 font-mono bg-indigo-950/10 border border-indigo-900/30 p-4.5 rounded-xl leading-relaxed whitespace-pre-wrap">
                          {round.evaluation?.modelAnswer}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  // 3. RENDER ACTIVE INTERVIEW SIMULATOR WORKSPACE (WITH COLLAPSIBLE SIDEBAR PANEL)
  const currentQuestion = questions[currentIdx];
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;
  const activePersonaObj = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="interview-outer-container font-sans text-gray-100 flex h-screen overflow-hidden bg-zinc-950" id="active-interview-screen">
      
      {/* 
        A: LEFT COLLAPSIBLE SIDE NAVBAR PANEL
        Fully responsive: slides on mobile, stays pinned or collapsed on desktop.
      */}
      <aside 
        className={`sidebar-nav-panel flex flex-col justify-between bg-zinc-900/90 border-r border-zinc-800/80 backdrop-blur-2xl transition-all duration-300 h-full overflow-y-auto flex-shrink-0 z-40 ${
          isSidebarOpen ? 'w-80 px-6 py-6' : 'w-0 lg:w-16 lg:px-2 py-6 overflow-hidden'
        }`}
      >
        <div>
          {/* Header row in side navigation */}
          {isSidebarOpen ? (
            <div className="flex items-center justify-between mb-8 border-b border-zinc-800/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Active Board</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800/50"
                title="Collapse sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 mb-8">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-indigo-400 hover:text-white p-2 rounded-lg bg-indigo-950/40 border border-indigo-900/40"
                title="Expand sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Assessor Persona profile in side navigation */}
          {isSidebarOpen ? (
            <div className="assessor-sidebar-profile bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl bg-zinc-900 w-11 h-11 border border-zinc-800 rounded-lg flex items-center justify-center">
                  {activePersonaObj.avatar}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white leading-tight">{activePersonaObj.name}</h4>
                  <span className="text-[9px] font-mono text-indigo-400 uppercase">{activePersonaObj.title}</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 italic leading-snug pl-1">
                "{activePersonaObj.quote}"
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-6" title={`${activePersonaObj.name} (${activePersonaObj.title})`}>
              <span className="text-2xl bg-zinc-950/80 w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center cursor-help">
                {activePersonaObj.avatar}
              </span>
            </div>
          )}

          {/* Time and study countdown in side navigation */}
          {isSidebarOpen ? (
            <div className="timer-display-box bg-zinc-950/40 border border-zinc-800/50 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-zinc-500" /> Timer limit</span>
                <span className={timeLeft < 60 ? 'text-rose-400 animate-pulse font-bold' : 'text-zinc-300 font-bold'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold font-mono border transition-all flex items-center justify-center gap-1 ${
                    timerActive 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                      : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40'
                  }`}
                >
                  {timerActive ? <><Pause className="w-2.5 h-2.5" /> Pause</> : <><Play className="w-2.5 h-2.5" /> Play</>}
                </button>
                <button
                  onClick={() => setTimeLeft(300)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-500 hover:text-zinc-300 px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex items-center justify-center"
                  title="Reset clock to 5:00"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 mb-6 bg-zinc-950/40 border border-zinc-800/40 p-2 rounded-xl">
              <span className={`text-[10px] font-mono font-bold ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-zinc-400'}`}>
                {formatTime(timeLeft).split(':')[0]}m
              </span>
            </div>
          )}

          {/* List of 3 questions in side navigation */}
          {isSidebarOpen ? (
            <div className="study-rounds-list-panel mt-4">
              <h5 className="text-[10px] font-bold font-mono uppercase text-zinc-500 tracking-wider mb-3">Round Challenges</h5>
              <div className="space-y-2.5">
                {questions.map((q, idx) => {
                  const isActive = currentIdx === idx;
                  const isCompleted = currentIdx > idx;
                  
                  return (
                    <div 
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-xs transition-all ${
                        isActive
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                          : isCompleted
                          ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500'
                          : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-600'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isActive ? (
                          <span className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center text-[10px] text-indigo-400 font-bold font-mono bg-indigo-950/40 animate-pulse">
                            ▶
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 leading-none mb-1">
                          Challenge {idx + 1} ({q.type})
                        </div>
                        <div className="truncate font-sans font-medium text-zinc-300">
                          {q.question}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {questions.map((q, idx) => {
                const isActive = currentIdx === idx;
                const isCompleted = currentIdx > idx;
                return (
                  <div 
                    key={idx} 
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs ${
                      isActive 
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300' 
                        : isCompleted
                        ? 'bg-zinc-950 border-zinc-850 text-emerald-400'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                    }`}
                    title={`Question ${idx + 1}: ${q.question}`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions of Side Navigation */}
        {isSidebarOpen ? (
          <div className="border-t border-zinc-800/60 pt-4">
            <div className="text-[10px] text-zinc-500 font-mono flex flex-col gap-0.5">
              <span>BOARD ACTIVE: {selectedLevel}</span>
              <span>ROLE: {selectedRole}</span>
              <span>ENGINE: {aiProvider}</span>
            </div>
            <button
              onClick={resetInterview}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-mono uppercase tracking-widest mt-4 block underline"
            >
              Abort Interview Session
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center" title="Abort Session">
            <button 
              onClick={resetInterview}
              className="text-rose-500 hover:text-rose-400 p-1.5 rounded bg-rose-950/20 border border-rose-900/30"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* 
        B: MAIN CONTENT WORKSPACE AREA
      */}
      <main className="flex-1 flex flex-col overflow-y-auto relative h-full">
        {/* Toggle sidebar button for desktop, visible if collapsed */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 backdrop-blur z-30 flex items-center justify-center"
            title="Expand tracker"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="interview-glow-sphere top-left"></div>
        <div className="interview-glow-sphere bottom-right"></div>

        <div className="interview-wrapper max-w-4xl mx-auto py-12 px-6 lg:px-12 w-full">
          
          {/* Top Progress Track Header */}
          <div className="progress-nav flex items-center justify-between mb-6 text-xs font-mono text-zinc-400 mt-2">
            <div className="flex items-center gap-3">
              <span>ROLE: <strong>{selectedRole}</strong></span>
              <span>•</span>
              <span>LEVEL: <strong>{selectedLevel}</strong></span>
            </div>
            <div>
              CHALLENGE <strong>{currentIdx + 1}</strong> OF <strong>{questions.length}</strong>
            </div>
          </div>

          <div className="progress-bar-container bg-zinc-900 w-full h-2 rounded-full overflow-hidden mb-8 border border-zinc-800/40">
            <div 
              className="progress-fill h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Primary Challenge Panel */}
          <div className="question-workspace bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl relative">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full uppercase">
                  {currentQuestion?.type || "Technical"} Challenge
                </span>
                <span className="text-xs font-mono text-zinc-500">Evaluated by {activePersonaObj.name}</span>
              </div>
              
              {/* Speaker Aloud Utility */}
              <button
                onClick={() => speakQuestion(currentQuestion?.question)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                  isSpeaking 
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 hover:bg-rose-900/30'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
                title="Speak question aloud"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> Stop Speaking
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> Read Question
                  </>
                )}
              </button>
            </div>

            {/* Displaying Speaking Audio Pulsing Visual waves if speaker is active */}
            {isSpeaking && (
              <div className="flex items-center gap-1.5 mb-3 px-1 animate-pulse">
                <span className="h-1.5 w-1 bg-indigo-500 rounded animate-bar1"></span>
                <span className="h-3 w-1 bg-indigo-500 rounded animate-bar2"></span>
                <span className="h-2.5 w-1 bg-indigo-500 rounded animate-bar3"></span>
                <span className="h-1 w-1 bg-indigo-500 rounded animate-bar4"></span>
                <span className="text-[10px] text-indigo-400 font-mono tracking-wider ml-1">Interviewer Speaking...</span>
              </div>
            )}

            <h2 className="text-xl md:text-2xl font-medium text-zinc-100 mb-5 leading-snug">
              {currentQuestion?.question}
            </h2>

            <div className="hint-alert bg-zinc-950/80 border border-zinc-800/80 p-4.5 rounded-xl flex gap-3.5 mb-8">
              <span className="hint-bulb text-xl select-none">💡</span>
              <div className="hint-text text-xs text-zinc-400 leading-relaxed">
                <strong className="text-zinc-300 block mb-0.5">Focus Criterion:</strong>
                {currentQuestion?.hint}
              </div>
            </div>

            {/* User Answer Stage */}
            <div className="answer-composer relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Compose Your Response</label>
                
                {/* Voice-to-Text Dictate Utility */}
                <button
                  onClick={toggleDictation}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-all ${
                    isDictating 
                      ? 'bg-rose-950/40 border-rose-500 text-rose-400 hover:bg-rose-900/30'
                      : 'bg-zinc-950 border-zinc-850 text-indigo-400 hover:text-indigo-300 hover:bg-zinc-900'
                  }`}
                  title="Toggle speech voice to text"
                  disabled={evaluating || !!evaluation}
                >
                  {isDictating ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-indigo-400" /> Dictate Answer (STT)
                    </>
                  )}
                </button>
              </div>

              {isDictating && (
                <div className="dictate-wave flex items-center gap-1 bg-rose-500/5 border border-rose-500/10 rounded-xl px-4 py-2.5 mb-2.5 text-[11px] text-rose-400 animate-fade-in font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span>
                  Microphone is active. Speak clearly into your device. Your speech will populate below in real time.
                </div>
              )}

              <textarea
                id="user-answer-textarea"
                className={`w-full h-48 bg-zinc-950 border rounded-xl p-4 text-sm text-zinc-200 focus:outline-none transition-all leading-relaxed placeholder-zinc-700 ${
                  isDictating ? 'border-rose-500/60 focus:border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-zinc-800 focus:border-indigo-500'
                }`}
                placeholder="Formulate your analytical approach. State your technology selection, outline trade-offs, and detail specific metrics following STAR methodologies..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={evaluating || !!evaluation}
              ></textarea>
              
              <div className="composer-footer flex items-center justify-between text-xs font-mono text-zinc-500 mt-2">
                <span>Characters: {userAnswer.length} • Word count: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</span>
                <span>Recommended: 50+ words</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-hub flex gap-3 mt-6">
              {!evaluation ? (
                <button
                  id="submit-answer-btn"
                  onClick={submitAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                  className={`flex-1 py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    userAnswer.trim() 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]' 
                      : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-zinc-800/80'
                  }`}
                >
                  {evaluating ? (
                    <span className="flex items-center gap-2">
                      <span className="spinner-dot"></span> Critiquation Engine Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Submit Response for Assessment <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              ) : (
                <button
                  id="next-question-btn"
                  onClick={nextQuestion}
                  className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
                >
                  <span>{currentIdx + 1 === questions.length ? "Finish & Generate Complete Report" : "Proceed to Next Challenge →"}</span>
                </button>
              )}
              
              {!evaluation && (
                <button
                  id="skip-question-btn"
                  onClick={nextQuestion}
                  disabled={evaluating}
                  className="bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold px-6 rounded-xl text-sm transition-colors border border-zinc-800/60"
                >
                  Skip
                </button>
              )}
            </div>
          </div>

          {/* Real-Time Assessment Slide-Up Feedback Panel */}
          {evaluation && (
            <div className="feedback-section mt-8 bg-zinc-900/60 border border-zinc-850 p-8 rounded-2xl backdrop-blur-xl animate-slide-up relative">
              <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-500">
                Persona: {activePersonaObj.name}
              </div>

              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">Round Feedback</span>
                  <h3 className="text-lg font-semibold text-zinc-100 mt-1">
                    Board Evaluator Critique
                  </h3>
                </div>
                
                <div className="radial-badge-small flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 w-16 h-16 rounded-full shadow-inner">
                  <span className="text-xl font-bold font-mono text-green-400">{evaluation.score}</span>
                  <span className="text-[7px] uppercase tracking-widest text-zinc-500 font-mono">Score</span>
                </div>
              </div>

              <div className="feedback-body text-sm text-zinc-300 mb-6 leading-relaxed bg-zinc-950/50 p-5 rounded-xl border border-zinc-900 whitespace-pre-wrap">
                "{evaluation.feedback}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-emerald-950/10 p-5 rounded-xl border border-emerald-500/10">
                  <strong className="text-xs uppercase text-emerald-400 tracking-wider font-bold block mb-2.5">
                    Detected Strengths:
                  </strong>
                  <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-2">
                    {evaluation.strengths?.map((str, sIdx) => <li key={sIdx}>{str}</li>) || <li>Topical alignment looks good.</li>}
                  </ul>
                </div>

                <div className="bg-amber-950/10 p-5 rounded-xl border border-amber-500/10">
                  <strong className="text-xs uppercase text-amber-400 tracking-wider font-bold block mb-2.5">
                    Critical Refinements:
                  </strong>
                  <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-2">
                    {evaluation.improvements?.map((imp, iIdx) => <li key={iIdx}>{imp}</li>) || <li>No critical syntax or structural revisions requested.</li>}
                  </ul>
                </div>
              </div>

              <div className="model-answer-section border-t border-zinc-800/80 pt-6">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Model Study Guide Answer</h4>
                </div>
                <div className="text-xs text-zinc-300 font-mono bg-indigo-950/10 border border-indigo-900/30 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {evaluation.modelAnswer}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default InterviewSimulator;
