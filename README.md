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

## 🚀 Getting Started & Forking Guide

Follow these comprehensive, step-by-step instructions to fork, install, configure, and run your own instance of **Placemate AI** locally or in the cloud.

### 📋 Prerequisites
Before you start, make sure you have the following installed on your local development machine:
- **[Node.js](https://nodejs.org/)** (v18.x or v20.x+ recommended)
- **[Git](https://git-scm.com/)** for version control
- A **MongoDB** database (either a local instance or a free cloud cluster on **[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)**)

---

### 🍴 Step 1: Fork the Repository
1. Navigate to the top of this GitHub repository page.
2. Click the **Fork** button in the upper-right corner.
3. Select your personal GitHub account or organization as the destination.
4. Click **Create Fork** to generate a copy of the codebase under your own GitHub namespace.

---

### 💻 Step 2: Clone Your Forked Repo
Open your terminal and run the following command (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git clone https://github.com/YOUR_USERNAME/placemate-ai.git
cd placemate-ai
```

---

### 📦 Step 3: Install All Dependencies
Placemate AI operates as a highly optimized, unified full-stack application. All backend and React frontend dependencies are managed through the root `package.json`. You only need to run the installation command **once at the project root**:

```bash
npm install
```

---

### 🔑 Step 4: Configure Environment Variables
1. At the root directory of your cloned project, copy the environment template file:
   ```bash
   cp .env.example .env
   ```
2. Open the newly created `.env` file in your preferred code editor and fill in your custom keys:

```env
PORT=3000
NODE_ENV=development

# 1. MongoDB Connection URI
# For local development: mongodb://127.0.0.1:27017/placemate_db
# For production/cloud: mongodb+srv://<user>:<password>@cluster.mongodb.net/placemate_db
MONGO_URI=mongodb://127.0.0.1:27017/placemate_db

# 2. JWT Signing Secret (Used to secure user sessions)
# Generate a strong, unique secret key
JWT_SECRET=your_jwt_signing_secret_here

# 3. Google Gemini API Key (Highly Recommended)
# Obtain your free API key at: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# 4. Hugging Face Access Token (Optional fallback)
# Obtain a token at: https://huggingface.co/settings/tokens
HF_TOKEN=your_huggingface_token_here
```

---

### 🚀 Step 5: Start Your Application

#### Development Mode (With Hot Reloading)
To run the full-stack server under developer mode (which serves the Node backend and mounts the Vite frontend compiler simultaneously on port `3000`):

```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to explore your custom instance.

#### Production Build & Execution
To build the React application assets and run the Node server in standard production mode:

1. Compile the production assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

## 👩‍💻 Author
Created with ❤️ by **Arti Verma**.

*"Master Skills. Ace Interviews. Get Hired."*

