import React, { useState } from 'react';
import '../styles/ResumeChecker.css';

const ResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file first!");
    setIsAnalyzing(true);
    // Simulate AI Analysis delay
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="resume-container">
      <div className="resume-header">
        <h1>AI Resume Analyzer</h1>
        <p>Upload your resume to get an instant ATS compatibility score and feedback.</p>
      </div>

      <div className="upload-section">
        <div className="drop-zone">
          <input 
            type="file" 
            id="resume-upload" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileChange} 
          />
          <label htmlFor="resume-upload">
            <span className="upload-icon">📁</span>
            {file ? file.name : "Drag & Drop or Click to Upload Resume"}
          </label>
        </div>
        
        <button 
          className="analyze-btn" 
          onClick={handleUpload}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Check Score"}
        </button>
      </div>

      {!isAnalyzing && !file && (
        <div className="tips-card">
          <h4>💡 Quick Tips:</h4>
          <ul>
            <li>Use a clean, single-column layout.</li>
            <li>Include keywords from the job description.</li>
            <li>Save your file as a PDF for best results.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeChecker;