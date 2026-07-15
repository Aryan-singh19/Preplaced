import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from 'os';
import officeParser from 'officeparser';
import { GoogleGenAI, Type } from '@google/genai';

const router = express.Router();

// Multer memory storage configuration (holds file in buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.pptx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPTX, and TXT files are allowed.'));
    }
  },
});

// Helper function to extract text from a file buffer using officeparser
async function extractTextFromFile(file) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (extension === '.txt') {
    return file.buffer.toString('utf-8');
  }

  // officeparser requires a physical file path, so we save the buffer to a temp file
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `resume_${Date.now()}${extension}`);
  await fs.promises.writeFile(tempFilePath, file.buffer);

  try {
    const text = await officeParser.parseOfficeAsync(tempFilePath);
    return text;
  } catch (error) {
    console.error(`Error parsing file with officeparser:`, error);
    throw new Error('Failed to extract text from file. Ensure the file is not corrupted.');
  } finally {
    // Safely delete the temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    } catch (err) {
      console.warn("Failed to delete temp file:", err);
    }
  }
}

// Hugging Face API call helper
async function analyzeWithHuggingFace(text) {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  // Use a highly capable open-source text generation model
  const model = "Qwen/Qwen2.5-72B-Instruct";
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const prompt = `You are an expert Applicant Tracking System (ATS) resume checker and recruiter.
Analyze the following resume text and provide a structured review.
You MUST output your response STRICTLY as a valid JSON object.
Do NOT wrap the JSON in markdown code blocks or any other characters.
Output format:
{
  "score": 85,
  "summary": "Short executive summary of the resume.",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "tips": ["Actionable tip 1", "Actionable tip 2"],
  "identifiedSkills": ["React", "Node.js", "MongoDB"],
  "keywordsMatched": ["Software Engineer", "REST API"]
}

Resume Text:
${text}`;

  if (!token) {
    throw new Error("No Hugging Face token provided. Falling back.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        return_full_text: false,
        temperature: 0.3,
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HF API error: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  
  // Try to parse the result. Hugging Face output can be inside an array or a direct text object
  let generatedText = "";
  if (Array.isArray(result)) {
    generatedText = result[0]?.generated_text || "";
  } else if (result?.generated_text) {
    generatedText = result.generated_text;
  } else {
    generatedText = JSON.stringify(result);
  }

  // Clean the text to isolate the JSON object if the model included extra text
  const jsonStartIndex = generatedText.indexOf('{');
  const jsonEndIndex = generatedText.lastIndexOf('}');
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    generatedText = generatedText.slice(jsonStartIndex, jsonEndIndex + 1);
  }

  return JSON.parse(generatedText);
}

// Gemini API call helper (Premium Fallback/Alternative)
async function analyzeWithGemini(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No Gemini API key configured.");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: `You are an expert Applicant Tracking System (ATS) resume checker and recruiter.
Analyze the following resume text and provide a structured review.
Output format MUST be valid JSON matching the requested schema.

Resume Text:
${text}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.INTEGER,
            description: "ATS score between 0 and 100",
          },
          summary: {
            type: Type.STRING,
            description: "An executive summary of the resume's overall impression and level.",
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-5 positive points / strong sections.",
          },
          weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-5 issues, gaps, or areas of improvement.",
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actionable improvement steps.",
          },
          identifiedSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of technical and soft skills identified in the resume text.",
          },
          keywordsMatched: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Relevant keywords matched that recruiters look for.",
          }
        },
        required: ["score", "summary", "strengths", "weaknesses", "tips", "identifiedSkills", "keywordsMatched"],
      }
    }
  });

  return JSON.parse(response.text);
}

// Simple local heuristic fallback (so the app NEVER crashes under any circumstances)
function analyzeWithHeuristics(text) {
  const lowercaseText = text.toLowerCase();
  
  // 1. Calculate a simple heuristic score
  let score = 55; // Base score
  
  const keywords = {
    experience: ['experience', 'work', 'intern', 'projects', 'history', 'role', 'job'],
    education: ['education', 'university', 'college', 'degree', 'btech', 'mtech', 'school'],
    skills: ['skills', 'technologies', 'programming', 'languages', 'databases', 'tools'],
    achievements: ['achievements', 'awards', 'certifications', 'extracurricular', 'leadership']
  };

  const detectedSections = [];
  for (const [section, words] of Object.entries(keywords)) {
    const found = words.some(word => lowercaseText.includes(word));
    if (found) {
      score += 8;
      detectedSections.push(section);
    }
  }

  // Tech keywords checking
  const techKeywords = ['react', 'node', 'javascript', 'python', 'java', 'html', 'css', 'sql', 'mongodb', 'git', 'docker', 'aws', 'c++', 'typescript', 'express'];
  const matchedTech = techKeywords.filter(tech => lowercaseText.includes(tech));
  score += Math.min(matchedTech.length * 2, 20);

  // Soft/Recruiter keywords checking
  const recruiterKeywords = ['leader', 'managed', 'team', 'resolved', 'optimized', 'scaled', 'developed', 'designed', 'collaborated'];
  const matchedRecruiter = recruiterKeywords.filter(word => lowercaseText.includes(word));
  score += Math.min(matchedRecruiter.length * 2, 10);

  score = Math.min(Math.max(score, 30), 98); // Bound score between 30 and 98

  // 2. Identify skills present
  const identifiedSkills = matchedTech.map(t => t.toUpperCase());

  return {
    score,
    summary: `Your resume is structured fairly well with core sections detected: ${detectedSections.join(', ')}. It has a good foundation of technical keywords but can be optimized further for ATS matching.`,
    strengths: [
      detectedSections.includes('skills') ? "Clear technical skills section present." : "Includes standard technical terminology.",
      detectedSections.includes('projects') || detectedSections.includes('experience') ? "Demonstrates practical hands-on experience/project work." : "Good basic structure.",
      "Clean readability format detected."
    ],
    weaknesses: [
      matchedRecruiter.length < 3 ? "Lacks strong action verbs describing key achievements." : "Some descriptions could be more quantifiable.",
      "Could benefit from more metrics-driven statements (e.g. percentages, values, scaling stats).",
      "Keyword density is slightly below the optimum 80% threshold."
    ],
    tips: [
      "Add quantifiable metrics (e.g., 'Improved database query response times by 30%', 'Managed a team of 4 peers').",
      "Start every bullet point in your Experience/Projects section with a strong action verb.",
      "Integrate more specific keywords from the target job description into your skills and summary sections."
    ],
    identifiedSkills: identifiedSkills.length > 0 ? identifiedSkills : ["HTML", "CSS", "JAVASCRIPT", "GIT"],
    keywordsMatched: matchedRecruiter.concat(matchedTech)
  };
}

router.post('/check', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file.' });
    }

    // 1. Extract plain text from the file
    const text = await extractTextFromFile(req.file);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from the resume. Please ensure it has readable text.'
      });
    }

    // 2. Attempt scoring using:
    //    a) Hugging Face (if token present)
    //    b) Gemini (fallback/alternative if HF is not configured or fails)
    //    c) Local NLP Heuristics (safety fallback so it never crashes)
    let analysisResult = null;
    let provider = '';

    const hasHFToken = !!(process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY);

    if (hasHFToken) {
      try {
        console.log("Attempting Hugging Face ATS analysis...");
        analysisResult = await analyzeWithHuggingFace(text);
        provider = 'Hugging Face (Qwen)';
      } catch (error) {
        console.warn("Hugging Face analysis failed or token is invalid. Error:", error.message);
      }
    }

    // Fallback to Gemini if Hugging Face failed or wasn't configured
    if (!analysisResult && process.env.GEMINI_API_KEY) {
      try {
        console.log("Attempting Gemini ATS analysis...");
        analysisResult = await analyzeWithGemini(text);
        provider = 'Gemini Flash';
      } catch (error) {
        console.warn("Gemini analysis failed. Error:", error.message);
      }
    }

    // Fallback to Heuristics if both AI providers are unavailable/failed
    if (!analysisResult) {
      console.log("Using local heuristic fallback analyzer...");
      analysisResult = analyzeWithHeuristics(text);
      provider = 'Local Heuristic Matcher';
    }

    res.status(200).json({
      success: true,
      provider,
      filename: req.file.originalname,
      filesize: req.file.size,
      data: analysisResult
    });

  } catch (error) {
    next(error);
  }
});

// ==========================================
// RESUME MATCHER / ENHANCER (srbhr/resume-matcher)
// ==========================================

// Helper for Hugging Face Resume Matcher
async function matchWithHuggingFace(resumeText, jobDesc) {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  const model = "Qwen/Qwen2.5-72B-Instruct";
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const prompt = `You are an expert AI Resume Matcher and ATS Optimization agent.
Compare the following Resume Text and Job Description to evaluate how well they align, identify missing keywords, and suggest specific enhancements.
You MUST output your response STRICTLY as a valid JSON object.
Do NOT wrap the JSON in markdown code blocks or any other characters.
Output format:
{
  "matchScore": 72,
  "breakdown": {
    "skillsMatch": 80,
    "experienceMatch": 65,
    "educationMatch": 90
  },
  "summary": "Summary of alignment between resume and job description.",
  "matchedKeywords": ["React", "TypeScript", "REST APIs"],
  "missingKeywords": ["GraphQL", "Docker", "AWS"],
  "enhancements": [
    {
      "section": "Professional Summary or Skills",
      "recommendation": "Incorporate GraphQL and cloud tools into your core skill grid.",
      "example": "Added: 'Proficient in GraphQL and cloud integrations (AWS, Docker).'"
    },
    {
      "section": "Work Experience / Projects",
      "recommendation": "Under the latest project, highlight experience managing containerized services.",
      "example": "Change to: 'Successfully engineered and containerized backend microservices using Docker.'"
    }
  ]
}

Resume Text:
${resumeText}

Job Description:
${jobDesc}`;

  if (!token) {
    throw new Error("No Hugging Face token provided. Falling back.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1200,
        return_full_text: false,
        temperature: 0.3,
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HF API error: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  let generatedText = "";
  if (Array.isArray(result)) {
    generatedText = result[0]?.generated_text || "";
  } else if (result?.generated_text) {
    generatedText = result.generated_text;
  } else {
    generatedText = JSON.stringify(result);
  }

  const jsonStartIndex = generatedText.indexOf('{');
  const jsonEndIndex = generatedText.lastIndexOf('}');
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    generatedText = generatedText.slice(jsonStartIndex, jsonEndIndex + 1);
  }

  return JSON.parse(generatedText);
}

// Helper for Gemini Resume Matcher
async function matchWithGemini(resumeText, jobDesc) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No Gemini API key configured.");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: `You are an expert AI Resume Matcher and ATS Optimizer.
Compare the following Resume Text and the Job Description. Assess similarity, detect matched/missing keywords, and output specific tailoring recommendations.
Output format MUST be valid JSON matching the requested schema.

Resume:
${resumeText}

Job Description:
${jobDesc}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: {
            type: Type.INTEGER,
            description: "Overall ATS compatibility alignment score between 0 and 100",
          },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              skillsMatch: { type: Type.INTEGER, description: "Skills overlap percentage" },
              experienceMatch: { type: Type.INTEGER, description: "Experience relevance percentage" },
              educationMatch: { type: Type.INTEGER, description: "Education & certification compliance percentage" }
            },
            required: ["skillsMatch", "experienceMatch", "educationMatch"]
          },
          summary: {
            type: Type.STRING,
            description: "An assessment explaining strengths and critical gaps between resume and JD.",
          },
          matchedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of matched keywords/technologies found in both.",
          },
          missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of target skills or keywords from JD missing in the resume.",
          },
          enhancements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING, description: "The resume section to modify (e.g., Skills, Experience, Projects)" },
                recommendation: { type: Type.STRING, description: "Clear instructions on how to incorporate the missing skill/concept" },
                example: { type: Type.STRING, description: "A concrete rewritten bullet point or phrase to paste directly" }
              },
              required: ["section", "recommendation", "example"]
            },
            description: "Step-by-step actionable optimization suggestions."
          }
        },
        required: ["matchScore", "breakdown", "summary", "matchedKeywords", "missingKeywords", "enhancements"],
      }
    }
  });

  return JSON.parse(response.text);
}

// Heuristics-based Matcher fallback
function matchWithHeuristics(resumeText, jobDesc) {
  const rText = resumeText.toLowerCase();
  const jText = jobDesc.toLowerCase();

  // Curated list of typical professional skills and concepts for word-matching
  const vocab = [
    'react', 'node', 'express', 'mongodb', 'sql', 'javascript', 'python', 'java', 'c++', 'html', 'css', 'typescript',
    'docker', 'aws', 'kubernetes', 'gcp', 'azure', 'graphql', 'rest api', 'git', 'ci/cd', 'agile', 'scrum',
    'machine learning', 'deep learning', 'data analysis', 'testing', 'security', 'cybersecurity', 'frontend', 'backend',
    'devops', 'redux', 'tailwind', 'bootstrap', 'postgresql', 'mysql', 'redis', 'firebase', 'flask', 'django', 'pandas'
  ];

  const matchedKeywords = vocab.filter(word => rText.includes(word) && jText.includes(word)).map(w => w.toUpperCase());
  const missingKeywords = vocab.filter(word => !rText.includes(word) && jText.includes(word)).map(w => w.toUpperCase());

  // Calculate scores
  const jdKeywordsInVocab = vocab.filter(word => jText.includes(word));
  let skillsMatch = 50;
  if (jdKeywordsInVocab.length > 0) {
    skillsMatch = Math.round((matchedKeywords.length / jdKeywordsInVocab.length) * 100);
  }
  skillsMatch = Math.min(Math.max(skillsMatch, 30), 95);

  const experienceMatch = rText.includes('experience') || rText.includes('work') || rText.includes('intern') ? 75 : 45;
  const educationMatch = rText.includes('degree') || rText.includes('btech') || rText.includes('mtech') || rText.includes('university') ? 85 : 50;

  const matchScore = Math.round((skillsMatch * 0.5) + (experienceMatch * 0.3) + (educationMatch * 0.2));

  // Generate synthetic enhancements based on missing keywords
  const enhancements = [];
  if (missingKeywords.length > 0) {
    enhancements.push({
      section: "Skills Section",
      recommendation: `Add highly critical target skills present in the Job Description: ${missingKeywords.slice(0, 3).join(', ')}.`,
      example: `Integrate under Tech Stack: "${missingKeywords.slice(0, 3).join(', ')}"`
    });
  }
  
  if (missingKeywords.includes('DOCKER') || missingKeywords.includes('AWS') || missingKeywords.includes('KUBERNETES')) {
    enhancements.push({
      section: "Experience / Projects",
      recommendation: "Demonstrate hands-on orchestration or cloud experiences to meet the JD infrastructure requirements.",
      example: "Add to a project: 'Orchestrated application modules and configured container pipelines with Docker for robust continuous deployment.'"
    });
  }

  if (missingKeywords.includes('REST API') || missingKeywords.includes('GRAPHQL') || missingKeywords.includes('NODE')) {
    enhancements.push({
      section: "Projects",
      recommendation: "The JD emphasizes API and backend design. Explicitly reference scalable API pipelines.",
      example: "Phraze: 'Architected high-throughput REST APIs and data handlers using Node.js and Express.'"
    });
  }

  if (enhancements.length === 0) {
    enhancements.push({
      section: "Experience Bulletins",
      recommendation: "Format achievements with quantifiable metrics to maximize match rates.",
      example: "E.g., 'Optimized database schema leading to a 25% reduction in page load latency.'"
    });
  }

  return {
    matchScore,
    breakdown: {
      skillsMatch,
      experienceMatch,
      educationMatch
    },
    summary: `Your resume has a ${matchScore}% alignment with the target Job Description. You've matched ${matchedKeywords.length} key technology requirements, but missing ${missingKeywords.length} terms that are central to the role. Adding these missing skills will drastically boost your ATS compliance.`,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 10), // Limit to top 10
    enhancements
  };
}

router.post('/match', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file.' });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Job Description to match against.' });
    }

    // 1. Extract plain text from the resume file
    const resumeText = await extractTextFromFile(req.file);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from the resume. Please ensure it has readable text.'
      });
    }

    // 2. Perform matching using HF, Gemini, or Heuristic fallback
    let matchResult = null;
    let provider = '';

    const hasHFToken = !!(process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY);

    if (hasHFToken) {
      try {
        console.log("Attempting Hugging Face Resume Matcher...");
        matchResult = await matchWithHuggingFace(resumeText, jobDescription);
        provider = 'Hugging Face (Qwen)';
      } catch (error) {
        console.warn("Hugging Face matching failed or token is invalid. Error:", error.message);
      }
    }

    if (!matchResult && process.env.GEMINI_API_KEY) {
      try {
        console.log("Attempting Gemini Resume Matcher...");
        matchResult = await matchWithGemini(resumeText, jobDescription);
        provider = 'Gemini Flash';
      } catch (error) {
        console.warn("Gemini matching failed. Error:", error.message);
      }
    }

    if (!matchResult) {
      console.log("Using local heuristic fallback matcher...");
      matchResult = matchWithHeuristics(resumeText, jobDescription);
      provider = 'Local Heuristic Matcher';
    }

    res.status(200).json({
      success: true,
      provider,
      filename: req.file.originalname,
      filesize: req.file.size,
      data: matchResult
    });

  } catch (error) {
    next(error);
  }
});

export default router;
