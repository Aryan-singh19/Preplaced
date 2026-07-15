import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = express.Router();

// Hugging Face API configuration
const HF_MODEL = "Qwen/Qwen2.5-72B-Instruct";

// Helper to call Hugging Face for questions
async function generateQuestionsWithHF(role, level) {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("No Hugging Face token");

  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  const prompt = `You are a Lead Tech Recruiter at a Fortune 500 tech firm.
Generate exactly 3 professional interview questions for a candidate applying for a ${role} role at ${level} level.
Mix core technical concepts, problem-solving scenario, and a soft/behavioral skill question.
You MUST output your response STRICTLY as a valid JSON array of objects.
Do NOT wrap the JSON in markdown code blocks or any other characters.
Output format:
[
  {
    "id": 1,
    "question": "The question text",
    "type": "Technical",
    "hint": "What the interviewer is looking for in a good answer."
  },
  ...
]`;

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
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`HF HTTP error: ${response.status}`);
  }

  const result = await response.json();
  let text = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
  if (!text) text = JSON.stringify(result);

  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
}

// Helper to call Gemini for questions
async function generateQuestionsWithGemini(role, level) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini API key");

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: `You are a Lead Recruiter. Generate 3 interview questions for a ${role} (${level}).
Mix technical, practical, and scenario-based questions. Return as JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            type: { type: Type.STRING },
            hint: { type: Type.STRING }
          },
          required: ["id", "question", "type", "hint"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}

// Heuristics fallback for questions
function generateQuestionsHeuristic(role, level) {
  const questionsBank = {
    "Frontend Engineer": [
      { id: 1, question: "Explain the difference between Virtual DOM and Shadow DOM, and how React utilizes the Virtual DOM.", type: "Technical", hint: "Look for explanation of reconciliation, fiber, and performance optimization." },
      { id: 2, question: "How would you optimize a slow-loading React application that has heavy visual assets and complex states?", type: "Scenario", hint: "Mention code-splitting, lazy loading, image optimization, useMemo/useCallback, and state localization." },
      { id: 3, question: "Describe a time when you disagreed with a product designer on a implementation detail. How did you resolve it?", type: "Behavioral", hint: "Assess communication, trade-off analysis, and collaboration focus." }
    ],
    "Backend Engineer": [
      { id: 1, question: "Explain what database indexing is, how indexes work under the hood, and potential drawbacks of over-indexing.", type: "Technical", hint: "Looking for B-Trees, search complexity reduction, write performance overhead." },
      { id: 2, question: "Design an API rate limiter for a high-traffic endpoint. How would you handle distributed requests?", type: "Scenario", hint: "Mention Token/Leaky bucket algorithms, Redis caching, and sliding window logs." },
      { id: 3, question: "Tell me about a challenging bug you found in production. How did you debug and permanently resolve it?", type: "Behavioral", hint: "Check analytical thinking, monitoring tools, and root-cause analysis." }
    ],
    "Full Stack Developer": [
      { id: 1, question: "Describe the entire round-trip of an HTTP request from the browser to a database and back.", type: "Technical", hint: "DNS resolution, TCP/TLS handshake, proxy/load balancers, routing, DB query execution." },
      { id: 2, question: "How do you decide between storing states on the client side versus caching or storing them on the backend database?", type: "Scenario", hint: "Trade-offs of security, performance, latency, persistence requirements, and session boundaries." },
      { id: 3, question: "How do you manage deadlines when both front-end and back-end tasks require significant architecture revisions?", type: "Behavioral", hint: "Agile breakdown, MVP focus, clear API contracts, and stakeholder communication." }
    ],
    "Data Scientist / ML Engineer": [
      { id: 1, question: "What is the bias-variance trade-off? How do you diagnose and handle overfitting in a neural network?", type: "Technical", hint: "Overfitting vs underfitting, regularization, dropout, early stopping, cross-validation." },
      { id: 2, question: "Your classification model has 99% accuracy but performs poorly on the minority class. How do you fix this?", type: "Scenario", hint: "Imbalanced datasets, precision-recall curve, F1 score, oversampling/SMOTE, class weights." },
      { id: 3, question: "Explain a complex machine learning concept to a non-technical stakeholder.", type: "Behavioral", hint: "Check analogies, removal of jargon, business-value mapping." }
    ]
  };

  const defaultQuestions = [
    { id: 1, question: `What are your core strengths as a ${role}, and how do you keep up with the latest technologies in this domain?`, type: "Technical", hint: "Continuous learning pattern, specific library/tool mentions, professional growth." },
    { id: 2, question: `Describe how you approach troubleshooting a sudden bottleneck or failure in a system you built.`, type: "Scenario", hint: "Systematic elimination, logs/metrics monitoring, safe rollbacks, post-mortem strategy." },
    { id: 3, question: `Tell me about a project where you had to learn a completely new technology under tight deadlines.`, type: "Behavioral", hint: "Adaptability, resourcefulness, self-learning under pressure." }
  ];

  return questionsBank[role] || defaultQuestions;
}

// Helper to call Hugging Face for evaluation
async function evaluateAnswerWithHF(question, answer, role, persona = "coach") {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("No Hugging Face token");

  let personaInstructions = "";
  if (persona === "savage") {
    personaInstructions = "You are Alex, a Savage Tech Lead. You are extremely strict about optimal Big-O complexity, deep architectural integrity, and clean DRY code. Dislike hand-waving or generic high-level descriptions. Be brutally honest, dry, direct, highly analytical, and technical in your feedback.";
  } else if (persona === "behavioral") {
    personaInstructions = "You are Devon, a Senior HR / Behavioral Interview Specialist. You prioritize teamwork, resolving friction, absolute ownership, clear communication, and leadership values over pure code optimization. Keep your tone professional, consultative, and values-focused.";
  } else {
    personaInstructions = "You are Sarah, an Empathetic Mentor and Coach. You are extremely warm, encouraging, and highly constructive. Emphasize helping the candidate improve confidence, and guide them with structured frameworks like STAR (Situation, Task, Action, Result) in a supportive tone.";
  }

  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  const prompt = `You are an elite Tech Interviewer.
${personaInstructions}

Evaluate the candidate's answer to the given interview question.
You MUST output your response STRICTLY as a valid JSON object.
Do NOT wrap the JSON in markdown code blocks or any other characters.
Output format:
{
  "score": 82,
  "feedback": "An overall evaluation reflecting your persona's voice and feedback style.",
  "strengths": ["Strength matching your persona focus 1", "Strength matching your persona focus 2"],
  "improvements": ["Improvement matching your persona focus 1", "Improvement matching your persona focus 2"],
  "modelAnswer": "An ideal, polished sample response that matches your high standards."
}

Question:
${question}

Candidate Answer:
${answer}

Role Context:
${role}`;

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
        temperature: 0.4,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`HF HTTP error: ${response.status}`);
  }

  const result = await response.json();
  let text = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
  if (!text) text = JSON.stringify(result);

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
}

// Helper to call Gemini for evaluation
async function evaluateAnswerWithGemini(question, answer, role, persona = "coach") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini API key");

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  let personaInstructions = "";
  if (persona === "savage") {
    personaInstructions = "You are Alex, a Savage Tech Lead. You are extremely strict about optimal Big-O complexity, architectural integrity, and clean DRY code. Dislike hand-waving or generic high-level descriptions. Be brutally honest, dry, direct, highly analytical, and technical in your feedback.";
  } else if (persona === "behavioral") {
    personaInstructions = "You are Devon, a Senior HR / Behavioral Interview Specialist. You prioritize teamwork, resolving friction, absolute ownership, clear communication, and leadership values over pure code optimization. Keep your tone professional, consultative, and values-focused.";
  } else {
    personaInstructions = "You are Sarah, an Empathetic Mentor and Coach. You are extremely warm, encouraging, and highly constructive. Emphasize helping the candidate improve confidence, and guide them with structured frameworks like STAR (Situation, Task, Action, Result) in a supportive tone.";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: `You are an elite Tech Interviewer. ${personaInstructions}
Evaluate this candidate's answer and return as JSON.
Question: ${question}
Answer: ${answer}
Role Context: ${role}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER },
          feedback: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          modelAnswer: { type: Type.STRING }
        },
        required: ["score", "feedback", "strengths", "improvements", "modelAnswer"]
      }
    }
  });

  return JSON.parse(response.text);
}

// Heuristics fallback for evaluation
function evaluateAnswerHeuristic(question, answer, role, persona = "coach") {
  const wordsCount = answer.trim().split(/\s+/).length;
  let score = 50;

  // Simple heuristic scoring based on length and tech terms
  if (wordsCount > 20) score += 10;
  if (wordsCount > 50) score += 15;
  if (wordsCount > 100) score += 10;

  const keyKeywords = [
    'react', 'node', 'express', 'index', 'performance', 'database', 'optimize', 'scal', 'design', 'test',
    'security', 'model', 'api', 'state', 'cache', 'query', 'async', 'promise', 'communication', 'collaboration'
  ];
  const matched = keyKeywords.filter(w => answer.toLowerCase().includes(w));
  score += Math.min(matched.length * 4, 20);
  score = Math.min(score, 96);

  let feedback = "";
  let strengths = [];
  let improvements = [];

  if (persona === "savage") {
    feedback = `[Savage Tech Lead Review] This needs work. The answer lacks concrete operational details and is too high level. You scored ${score}%. If you talk like this in the architecture board, we won't scale.`;
    strengths = [
      "You addressed the topic, which is a baseline start.",
      matched.length > 1 ? `At least you used some valid terms like: ${matched.slice(0, 2).join(', ')}.` : "Your response contains text."
    ];
    improvements = [
      "Specify exact database indexes or data structures instead of vague descriptions.",
      "Calculate or state real-world Big-O time and space complexity.",
      "Get straight to the point and skip the fluff introduction."
    ];
  } else if (persona === "behavioral") {
    feedback = `[HR Specialist Review] Thank you for sharing your experience. You scored ${score}%. Let's work on aligning your answer with enterprise-wide collaboration and behavioral milestones.`;
    strengths = [
      "Highlighted your individual effort and role context clearly.",
      "Showed reasonable communication clarity in expressing your thoughts."
    ];
    improvements = [
      "Explain how you resolved interpersonal friction or differing developer opinions.",
      "Leverage the STAR method (Situation, Task, Action, Result) to prove business value.",
      "Show how you mentored or supported other developers during this transition."
    ];
  } else {
    feedback = `[Empathetic Coach Review] Fantastic effort! You scored ${score}%. You've got a wonderful core foundation here. Let's make it shine by refining a few minor technical descriptions!`;
    strengths = [
      "Excellent initiative and clear presentation of the core idea.",
      "Demonstrated good domain terminology usage and professional language."
    ];
    improvements = [
      "Structure your answer with numbered points to make it incredibly easy for interviewers to follow.",
      "Try to mention trade-offs of your choices (e.g. why SQL instead of NoSQL in this case).",
      "Inject quantitative metrics (e.g. 'reduced load times by 30%') to sound more authoritative."
    ];
  }

  return {
    score,
    feedback,
    strengths,
    improvements,
    modelAnswer: `A stellar answer would be: "When approaching this scenario, I break it down into systematic layers. First, I identify the critical bottleneck using monitoring metrics (such as Chrome DevTools or server-side profiling). Then, I isolate the root cause, create a regression test, implement a fix (e.g., using memoized selectors, lazy evaluation, or indexing), and finally verify the improvement using quantifiable metrics before rolling it out incrementally."`
  };
}

// POST endpoint to get questions
router.post('/questions', async (req, res, next) => {
  try {
    const { role, level } = req.body;
    if (!role || !level) {
      return res.status(400).json({ success: false, message: "Role and level are required" });
    }

    let questions = null;
    let provider = '';

    const hasHFToken = !!(process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY);

    if (hasHFToken) {
      try {
        console.log("Generating interview questions with Hugging Face...");
        questions = await generateQuestionsWithHF(role, level);
        provider = 'Hugging Face (Qwen)';
      } catch (e) {
        console.warn("Hugging Face interview generation failed, falling back. Error:", e.message);
      }
    }

    if (!questions && process.env.GEMINI_API_KEY) {
      try {
        console.log("Generating interview questions with Gemini...");
        questions = await generateQuestionsWithGemini(role, level);
        provider = 'Gemini Flash';
      } catch (e) {
        console.warn("Gemini interview generation failed, falling back. Error:", e.message);
      }
    }

    if (!questions) {
      console.log("Generating interview questions with heuristics fallback...");
      questions = generateQuestionsHeuristic(role, level);
      provider = 'Local Heuristic Bank';
    }

    res.status(200).json({
      success: true,
      provider,
      role,
      level,
      questions
    });
  } catch (error) {
    next(error);
  }
});

// POST endpoint to evaluate answers
router.post('/evaluate', async (req, res, next) => {
  try {
    const { question, answer, role, persona } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Question and answer are required" });
    }

    let evaluation = null;
    let provider = '';

    const hasHFToken = !!(process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY);

    if (hasHFToken) {
      try {
        console.log(`Evaluating interview answer with Hugging Face (${persona})...`);
        evaluation = await evaluateAnswerWithHF(question, answer, role || "Software Engineer", persona || "coach");
        provider = 'Hugging Face (Qwen)';
      } catch (e) {
        console.warn("Hugging Face interview evaluation failed, falling back. Error:", e.message);
      }
    }

    if (!evaluation && process.env.GEMINI_API_KEY) {
      try {
        console.log(`Evaluating interview answer with Gemini (${persona})...`);
        evaluation = await evaluateAnswerWithGemini(question, answer, role || "Software Engineer", persona || "coach");
        provider = 'Gemini Flash';
      } catch (e) {
        console.warn("Gemini interview evaluation failed, falling back. Error:", e.message);
      }
    }

    if (!evaluation) {
      console.log(`Evaluating interview answer with heuristics fallback (${persona})...`);
      evaluation = evaluateAnswerHeuristic(question, answer, role || "Software Engineer", persona || "coach");
      provider = 'Local Heuristic Coach';
    }

    res.status(200).json({
      success: true,
      provider,
      evaluation
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// APTITUDE QUIZ AI EXPLAINER
// ==========================================

async function explainWithHuggingFace(question, options, correctAnswer, userSelection) {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("No Hugging Face token");

  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  const prompt = `You are an elite quantitative aptitude, reasoning, and engineering tutor.
Explain the answer to this placement question in a highly comprehensive and engaging step-by-step manner.
Provide an ultra-fast shortcut trick or memory tip to solve it in under 10 seconds.
You MUST output your response STRICTLY as a valid JSON object.
Do NOT wrap the JSON in markdown code blocks or any other characters.
Output format:
{
  "correctAnswer": "${correctAnswer}",
  "explanation": "Provide step-by-step calculation or verbal analysis on why this answer is correct and others are wrong.",
  "shortcut": "Provide an incredible shortcut trick, formula, or shortcut strategy."
}

Question:
${question}

Options:
${options.join(', ')}

Correct Answer:
${correctAnswer}

User's Chosen Answer:
${userSelection || "None"}`;

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
    throw new Error(`HF HTTP error: ${response.status}`);
  }

  const result = await response.json();
  let text = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
  if (!text) text = JSON.stringify(result);

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
}

async function explainWithGemini(question, options, correctAnswer, userSelection) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini API key");

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: `You are an elite aptitude tutor. Explain this question's answer in detail with a shortcut formula. Return as JSON.
Question: ${question}
Options: ${options.join(', ')}
Correct Answer: ${correctAnswer}
User selection: ${userSelection}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          shortcut: { type: Type.STRING }
        },
        required: ["correctAnswer", "explanation", "shortcut"]
      }
    }
  });

  return JSON.parse(response.text);
}

function explainHeuristic(question, options, correctAnswer, userSelection) {
  return {
    correctAnswer: correctAnswer,
    explanation: `The correct option is indeed "${correctAnswer}". Under standard placement guidelines, this can be verified by testing each of the options or applying basic algebraic principles. For quant, we form the algebraic equation and solve for the variable. For verbal, we analyze the grammatical structure and sentence coherence.`,
    shortcut: "Eliminate choices that are mathematically impossible or grammatically incongruent first to double your speed!"
  };
}

router.post('/quiz-explain', async (req, res, next) => {
  try {
    const { question, options, correctAnswer, userSelection } = req.body;
    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ success: false, message: "Missing required properties" });
    }

    let explanationResult = null;
    let provider = '';

    const hasHFToken = !!(process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY);

    if (hasHFToken) {
      try {
        console.log("Generating quiz explanation with Hugging Face...");
        explanationResult = await explainWithHuggingFace(question, options, correctAnswer, userSelection);
        provider = 'Hugging Face (Qwen)';
      } catch (e) {
        console.warn("Hugging Face explanation failed, falling back. Error:", e.message);
      }
    }

    if (!explanationResult && process.env.GEMINI_API_KEY) {
      try {
        console.log("Generating quiz explanation with Gemini...");
        explanationResult = await explainWithGemini(question, options, correctAnswer, userSelection);
        provider = 'Gemini Flash';
      } catch (e) {
        console.warn("Gemini explanation failed, falling back. Error:", e.message);
      }
    }

    if (!explanationResult) {
      console.log("Generating quiz explanation with heuristics fallback...");
      explanationResult = explainHeuristic(question, options, correctAnswer, userSelection);
      provider = 'Local Heuristic Explainer';
    }

    res.status(200).json({
      success: true,
      provider,
      explanation: explanationResult
    });
  } catch (error) {
    next(error);
  }
});

export default router;
