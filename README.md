# Placemate AI 🚀

Welcome to **Placemate AI**! Built by **Arti Verma**, this is a comprehensive, enterprise-grade platform designed to empower job seekers, engineering students, and developers to master their skills, ace interviews, and get hired.

## 🌟 Key Features

The platform offers a suite of highly-optimized, AI-powered tools tailored for placement preparation:

- **📝 Aptitude Mastery**: Practice modules tailored by subject to sharpen quantitative, logical, and verbal skills.
- **📄 AI Resume Workspace**: A dual-mode professional workspace with:
  - **General ATS Audit**: Audit your overall resume formatting, structure, and readability, gaining actionable tips to maximize recruiter callbacks.
  - **Job Description Matcher**: Match your resume against any target job description. Instantly identify missing critical keywords, calculate role compatibility indices, and get copy-paste ready, AI-tailored work experience bullet points.
- **🤖 Interview Simulator**: Give role-specific mock interviews powered by AI. Get real-time feedback as if you were in a real HR/Technical round.
- **🎓 Courses**: Discover crisp, highly relevant course modules aligned with what top recruiters are looking for today.

## 🛠️ Tech Stack & Zero-Cost AI Engine

Placemate AI features a hybrid AI parsing pipeline designed to deliver premium outcomes with zero API overhead cost:

**AI Architecture:**
- **Hugging Face Inference Network**: Deeply integrated with state-of-the-art open-source LLMs (such as `Qwen/Qwen2.5-72B-Instruct`) to execute advanced semantic matching and structural suggestions for free.
- **Google Gemini Integration**: Fallback framework leveraging `gemini-3.5-flash` for high-speed, parallel structural token mapping.
- **Local Heuristics Engine**: Embedded tokenized NLP fallback that ensures instant parsing even during global API network offline events.

**Frontend:**
- React (v19)
- Vite
- React Router DOM
- Interactive, responsive CSS-engineered UI with high-contrast elements

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- `@google/genai` (SDK for Gemini Flash integration)
- `officeparser` (Highly compatible text extraction library for Word documents, PDFs, PPTXs, and plain-text files)
- Multer (for robust resume multi-format binary upload handling)

## 🛡️ Scalability & Security Architecture

To support massive user growth and protect AI endpoints from abusive loads, the backend is scaffolded with an enterprise-grade safety strategy:

- **Robust Security Headers**: Utilizes `helmet` to set multiple HTTP headers natively, preventing cross-site scripting (XSS), sniffing, and clickjacking attacks.
- **Dual Rate Limiting (`express-rate-limit`)**: 
  - *Global Gateway*: A standard limit restricts IP abuse across all basic API routes (e.g., 100 requests per 15 mins).
  - *Strict AI Sandbox*: Specialized strict filters are applied **exclusively** to the AI matching and ATS scoring endpoints to guarantee APIs cannot handle excessive loads.
- **Payload & Overflow Protections**: Incoming JSON request payload size is hard-capped (e.g., at 1MB), closing vectors for memory-overflow vulnerabilities.
- **Scalable DB Pools**: MongoDB (Mongoose) connections are securely configured with dynamic connection pooling (`maxPoolSize: 10`) allowing the server to gracefully reuse sockets and maintain thousands of concurrent operations under heavy user load.
- **Strict Endpoint Verification**: Tightly controlled CORS architecture ensures we are safely blocking unrecognized cross-origin API hijacking.

## 📂 Project Structure

```text
placemate-ai/
├── frontend/          # React & Vite frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components (Navbar, FeatureCard, etc.)
│   │   ├── pages/      # Features & Application screens (ResumeChecker, SignPage, etc.)
│   │   └── styles/     # Custom premium CSS templates
│   └── package.json
└── backend/           # Node & Express backend logic
    ├── controllers/   # Route handlers
    ├── models/        # MongoDB schemas (User, etc.)
    ├── routes/        # Router files (resumeRoutes, authRoutes, etc.)
    └── package.json   # Backend dependencies and setup
```

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in a `.env` file:
   ```env
   MONGO_URI=your_mongodb_uri
   HF_TOKEN=your_huggingface_token
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_signing_secret
   ```
4. Start the backend server:
   ```bash
   npx nodemon index.js
   ```

## 👩‍💻 Author
Created with ❤️ by **Arti Verma**.

*"Master Skills. Ace Interviews. Get Hired."*
