# Placemate AI 🚀

Welcome to **Placemate AI**! Built by **Arti Verma**, this is a comprehensive platform designed to empower job seekers, engineering students, and developers to master their skills, ace interviews, and get hired.

## 🌟 Key Features

The platform offers a suite of AI-powered tools tailored for placement preparation:

- **📝 Aptitude Mastery**: Practice modules tailored by subject to sharpen your quantitative, logical, and verbal skills.
- **📄 AI Resume Checker**: Get instant ATS (Applicant Tracking System) feedback and optimization tips to land more interview calls.
- **🤖 Interview Simulator**: Give role-specific mock interviews powered by AI. Get real-time feedback as if you were in a real HR/Technical round.
- **🎓 Courses**: Discover crisp, highly relevant course modules aligned with what top recruiters are looking for today.

## 🛠️ Tech Stack

**Frontend:**
- React (v19)
- Vite
- React Router DOM
- Interactive and modern CSS UI

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- OpenAI API (for AI Resume Analysis & Interview Simulations)
- Multer (for file handling, e.g., resume uploads)

## 🛡️ Scalability & Security Architecture

To support massive user growth and protect expensive AI billing modules (like OpenAI endpoints), the backend is scaffolded with an enterprise-grade security strategy:

- **Robust Security Headers**: Utilizes `helmet` to set multiple HTTP headers natively, preventing cross-site scripting (XSS), sniffing, and clickjacking attacks.
- **Dual Rate Limiting (`express-rate-limit`)**: 
  - *Global Gateway*: A standard limit restricts IP abuse across all basic API routes (e.g., 100 requests per 15 mins).
  - *Strict AI Sandbox*: Specialized strict filters are applied **exclusively** to the OpenAI generating endpoints to guarantee APIs cannot handle excessive loads, effectively preventing malicious billing spikes.
- **Payload & Overflow Protections**: Incoming JSON request payload size is hard-capped (e.g., at 1MB), closing vectors for memory-overflow vulnerabilities.
- **Scalable DB Pools**: MongoDB (Mongoose) connections are securely configured with dynamic connection pooling (`maxPoolSize: 10`) allowing the server to gracefully reuse sockets and maintain thousands of concurrent operations under heavy user load.
- **Strict Endpoint Verification**: Tightly controlled `cors` architecture ensures we are safely blocking unrecognized cross-origin API hijacking.

## 📂 Project Structure

```text
placemate-ai/
├── frontend/          # React & Vite frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components (Navbar, FeatureCard, etc.)
│   │   ├── pages/      # Features & Application screens
│   │   └── styles/     # Premium styling
│   └── package.json
└── backend/           # Node & Express backend logic
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
3. Set your environment variables in a `.env` file (e.g., MongoDB URI, OpenAI API key).
4. Start the backend server:
   ```bash
   npx nodemon index.js
   ```

## 👩‍💻 Author
Created with ❤️ by **Arti Verma**.

*"Master Skills. Ace Interviews. Get Hired."*
