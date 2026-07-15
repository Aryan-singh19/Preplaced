import React, { useState, useRef } from 'react';
import '../styles/ResumeChecker.css';

const ResumeChecker = () => {
  const [activeTab, setActiveTab] = useState('ats'); // 'ats' or 'matcher'
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [result, setResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    "Uploading document securely...",
    "Extracting plain-text from resume format...",
    "Running open source ATS matching algorithm...",
    "Calculating keyword density and experience weights...",
    "Structuring recommendations..."
  ];

  const jdTemplates = {
    frontend: `We are looking for a Senior Frontend Engineer with 2+ years of professional experience. Key requirements:
- Strong experience with React, TypeScript, and modern state management (Redux, Context API).
- Mastery of responsive styles, CSS Grid, Tailwind CSS, and layout design.
- Experience with RESTful APIs, Git, and bundlers like Vite or Webpack.
- Familiarity with CI/CD pipelines, automated testing, and agile methodologies.`,
    backend: `Seeking a robust Backend Engineer to build high-performance data systems. Key requirements:
- Deep expertise in Node.js, Express, and server architecture.
- Solid experience writing SQL queries, working with databases like PostgreSQL or MySQL, and NoSQL with MongoDB.
- Experience design restful services, Docker containerization, AWS cloud architecture, and Redis caching.
- Focus on security, clean code patterns, and test-driven development.`,
    data: `Looking for a Data Analyst / Machine Learning Specialist. Requirements:
- Proficiency in Python, SQL, and database querying.
- Hands-on experience with pandas, numpy, scikit-learn, and data visualization tools.
- Understanding of Machine Learning pipelines, regression models, and deep learning neural networks.
- Ability to create interactive dashboards, interpret user statistics, and communicate insights.`
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.pptx', '.txt'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setError("Invalid file type. Please upload a PDF, DOC, DOCX, PPTX, or TXT file.");
      setFile(null);
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB. Please upload a smaller document.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select or drop a file first!");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setMatchResult(null);
    setError('');
    
    // Simulate step indicators for progress feedback
    let stepIdx = 0;
    setAnalysisStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx]);
      }
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/resume/check', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'ATS Analysis failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred during resume analysis. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handleMatcherUpload = async () => {
    if (!file) {
      setError("Please select or drop a file first!");
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError("Please provide a target Job Description (at least 20 characters) to match against.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setMatchResult(null);
    setError('');

    let stepIdx = 0;
    setAnalysisStep("Uploading document securely...");
    const stepsMatcher = [
      "Extracting resume structures...",
      "Analyzing core Job Description semantic requirements...",
      "Calculating vector keyword overlap...",
      "Extracting missing skills and technology tags...",
      "Drafting contextual resume optimizations..."
    ];

    const stepInterval = setInterval(() => {
      if (stepIdx < stepsMatcher.length) {
        setAnalysisStep(stepsMatcher[stepIdx]);
        stepIdx++;
      }
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/resume/match', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Job description matching failed.');
      }

      setMatchResult(data);
    } catch (err) {
      setError(err.message || "An error occurred during job description matching. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult(null);
    setMatchResult(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 55) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! Ready to paste into your resume.");
  };

  return (
    <div className="resume-container">
      <div className="resume-header">
        <h1>AI Resume Workspace</h1>
        <p>Optimize your placement candidacy. Audit your overall ATS readability or align your resume directly with a targeted job description.</p>
      </div>

      {/* Tabs */}
      {!isAnalyzing && !result && !matchResult && (
        <div className="resume-tabs">
          <button 
            className={`tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ats'); setError(''); }}
          >
            📋 General ATS Audit
          </button>
          <button 
            className={`tab-btn ${activeTab === 'matcher' ? 'active' : ''}`}
            onClick={() => { setActiveTab('matcher'); setError(''); }}
          >
            🎯 Job Description Matcher
          </button>
        </div>
      )}

      {error && <div className="resume-error-banner">⚠️ {error}</div>}

      {!result && !matchResult && !isAnalyzing && (
        <div className="upload-section">
          {activeTab === 'matcher' && (
            <div className="job-desc-section">
              <div className="jd-header-row">
                <h3>Target Job Description</h3>
                <div className="jd-templates">
                  <span>Pre-fill Template:</span>
                  <button onClick={() => setJobDescription(jdTemplates.frontend)}>Frontend</button>
                  <button onClick={() => setJobDescription(jdTemplates.backend)}>Backend</button>
                  <button onClick={() => setJobDescription(jdTemplates.data)}>ML / Data</button>
                </div>
              </div>
              <textarea
                className="job-desc-textarea"
                placeholder="Paste the target job description or requirements here... (Minimum 20 characters)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}

          <div 
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              id="resume-upload" 
              accept=".pdf,.doc,.docx,.pptx,.txt" 
              onChange={handleFileChange} 
            />
            <span className="upload-icon">📁</span>
            <h3>{file ? file.name : "Drag & Drop your Resume"}</h3>
            <p className="upload-subtitle">Supports PDF, DOCX, DOC, PPTX, or TXT (Max 5MB)</p>
            {file && (
              <div className="selected-file-pill">
                <span>Selected: {(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
          
          <button 
            className="analyze-btn" 
            onClick={activeTab === 'ats' ? handleUpload : handleMatcherUpload}
            disabled={!file || (activeTab === 'matcher' && jobDescription.trim().length < 20)}
          >
            {activeTab === 'ats' ? 'Check ATS Score' : 'Match & Tailor Resume'}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="analyzing-section">
          <div className="pulse-loader">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
          <h2>{activeTab === 'ats' ? 'Auditing Resume Layout' : 'Aligning Resume with Job Description'}</h2>
          <p className="analysis-step-text">{analysisStep}</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
        </div>
      )}

      {/* Mode 1: ATS Audit Result */}
      {result && result.data && (
        <div className="analysis-result-container">
          <div className="result-hero-card">
            <div className="score-ring-container">
              <svg className="score-svg" viewBox="0 0 120 120">
                <circle className="score-bg-circle" cx="60" cy="60" r="50" />
                <circle 
                  className="score-fill-circle" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  style={{
                    strokeDasharray: '314',
                    strokeDashoffset: 314 - (314 * result.data.score) / 100,
                    stroke: getScoreColor(result.data.score)
                  }}
                />
                <text x="60" y="65" className="score-text" fill={getScoreColor(result.data.score)}>
                  {result.data.score}
                </text>
              </svg>
              <div className="score-label">ATS Match Score</div>
            </div>

            <div className="result-meta-info">
              <div className="provider-badge">Validated by {result.provider}</div>
              <h2>ATS Compatibility Review</h2>
              <p className="file-detail-text">File Analyzed: <strong>{result.filename}</strong> ({(result.filesize / 1024).toFixed(1)} KB)</p>
              <p className="summary-paragraph">"{result.data.summary}"</p>
            </div>
          </div>

          <div className="bento-grid">
            {/* Strengths Card */}
            <div className="bento-card strengths-card">
              <h3><span className="card-emoji">✅</span> Core Strengths</h3>
              <ul>
                {result.data.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Card */}
            <div className="bento-card weaknesses-card">
              <h3><span className="card-emoji">⚠️</span> Areas to Improve</h3>
              <ul>
                {result.data.weaknesses.map((weak, idx) => (
                  <li key={idx}>{weak}</li>
                ))}
              </ul>
            </div>

            {/* Actionable Tips */}
            <div className="bento-card tips-card-result">
              <h3><span className="card-emoji">💡</span> Quick Tips & Suggestions</h3>
              <ul>
                {result.data.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Skills / Keywords Found */}
            <div className="bento-card skills-card-result">
              <h3><span className="card-emoji">🛠️</span> Identified Skills & Keywords</h3>
              <p className="section-desc">These are the key skills and industry terms extracted from your resume content.</p>
              <div className="skills-tags-container">
                {result.data.identifiedSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <button className="reset-btn" onClick={resetAnalyzer}>
            ← Analyze Another Resume
          </button>
        </div>
      )}

      {/* Mode 2: Job Description Matcher Result */}
      {matchResult && matchResult.data && (
        <div className="analysis-result-container">
          <div className="result-hero-card">
            <div className="score-ring-container">
              <svg className="score-svg" viewBox="0 0 120 120">
                <circle className="score-bg-circle" cx="60" cy="60" r="50" />
                <circle 
                  className="score-fill-circle" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  style={{
                    strokeDasharray: '314',
                    strokeDashoffset: 314 - (314 * matchResult.data.matchScore) / 100,
                    stroke: getScoreColor(matchResult.data.matchScore)
                  }}
                />
                <text x="60" y="65" className="score-text" fill={getScoreColor(matchResult.data.matchScore)}>
                  {matchResult.data.matchScore}%
                </text>
              </svg>
              <div className="score-label">Role Compatibility</div>
            </div>

            <div className="result-meta-info">
              <div className="provider-badge">Matched by {matchResult.provider}</div>
              <h2>Target Role Alignment Summary</h2>
              <p className="file-detail-text">Uploaded Resume: <strong>{matchResult.filename}</strong> ({(matchResult.filesize / 1024).toFixed(1)} KB)</p>
              <p className="summary-paragraph">"{matchResult.data.summary}"</p>
            </div>
          </div>

          {/* Dynamic Category Progress Bars */}
          <div className="match-breakdown-card">
            <h3>📊 Alignment Parameters</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <div className="breakdown-labels">
                  <span>Skills Matching</span>
                  <span className="breakdown-val">{matchResult.data.breakdown.skillsMatch}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill fill-blue" style={{ width: `${matchResult.data.breakdown.skillsMatch}%` }}></div>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-labels">
                  <span>Experience Alignment</span>
                  <span className="breakdown-val">{matchResult.data.breakdown.experienceMatch}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill fill-amber" style={{ width: `${matchResult.data.breakdown.experienceMatch}%` }}></div>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-labels">
                  <span>Education & Credentials</span>
                  <span className="breakdown-val">{matchResult.data.breakdown.educationMatch}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill fill-green" style={{ width: `${matchResult.data.breakdown.educationMatch}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-grid">
            {/* Matched Keywords */}
            <div className="bento-card">
              <h3 className="text-green-600"><span className="card-emoji">🎯</span> Matched Keywords ({matchResult.data.matchedKeywords.length})</h3>
              <p className="section-desc">Skills and terminologies successfully detected in both your resume and the JD.</p>
              {matchResult.data.matchedKeywords.length > 0 ? (
                <div className="skills-tags-container">
                  {matchResult.data.matchedKeywords.map((tag, idx) => (
                    <span key={idx} className="tag-matched">{tag}</span>
                  ))}
                </div>
              ) : (
                <p className="empty-tag-msg">No overlapping keywords detected. Try adding some core tags.</p>
              )}
            </div>

            {/* Missing Keywords */}
            <div className="bento-card">
              <h3 className="text-red-500"><span className="card-emoji">🔍</span> Missing Target Keywords ({matchResult.data.missingKeywords.length})</h3>
              <p className="section-desc">Critical terms from the job description not found in your resume. Insert these to raise compatibility!</p>
              {matchResult.data.missingKeywords.length > 0 ? (
                <div className="skills-tags-container">
                  {matchResult.data.missingKeywords.map((tag, idx) => (
                    <span key={idx} className="tag-missing">{tag}</span>
                  ))}
                </div>
              ) : (
                <p className="empty-tag-msg">Excellent! You have captured all the core keywords highlighted in the JD.</p>
              )}
            </div>

            {/* AI Optimization Enhancements */}
            <div className="bento-card skills-card-result">
              <h3><span className="card-emoji">🚀</span> AI-Generated Tailoring Enhancements</h3>
              <p className="section-desc">Direct instructions to weave missing target concepts into your resume sections with pre-written, high-impact phrasing.</p>
              <div className="enhancements-list">
                {matchResult.data.enhancements.map((item, idx) => (
                  <div key={idx} className="enhancement-item-row">
                    <div className="enhancement-meta">
                      <span className="enhancement-section-badge">{item.section}</span>
                    </div>
                    <div className="enhancement-body">
                      <p className="enhancement-desc"><strong>Action:</strong> {item.recommendation}</p>
                      <div className="enhancement-snippet-box">
                        <code className="enhancement-code">{item.example}</code>
                        <button 
                          className="copy-snippet-btn" 
                          onClick={() => copyToClipboard(item.example)}
                          title="Copy to clipboard"
                        >
                          📋 Copy Phrase
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="reset-btn" onClick={resetAnalyzer}>
            ← Tailor Another Role
          </button>
        </div>
      )}

      {!isAnalyzing && !result && !matchResult && (
        <div className="tips-card">
          <h4>💡 High-Impact ATS Placement Tips:</h4>
          <ul>
            <li><strong>Action-Oriented Language:</strong> Start experience bullet points with verbs like <em>Optimized, Engineered, Led, Scaled</em> rather than <em>Responsible for</em>.</li>
            <li><strong>Quantify Achievements:</strong> Use actual metrics (e.g., "reduced latency by 20%", "led 4 members", "increased sales by 15%") to ground your work in tangible value.</li>
            <li><strong>Multi-Format Parsing:</strong> Keep your layout clear and linear. Avoid complex graphics, tables, or side columns that confuse standard parser engines.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeChecker;
