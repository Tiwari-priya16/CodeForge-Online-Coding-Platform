# ⚡ CodeForge — Full-Stack DSA & Code Assessment Platform

**CodeForge** is an advanced, high-performance online coding and Data Structures & Algorithms (DSA) assessment platform. Built with a modern full-stack architecture using **React 19, Tailwind CSS, Node.js, Express, MongoDB Atlas, and Redis**, CodeForge enables developers to practice curated problems, execute code across 5 programming languages via a self-hosted Judge0 sandbox, watch video solution editorials, track consecutive day solving streaks, and receive live AI-powered code debugging and complexity analysis.

---

## ✨ Features

### 🔐 User & Authentication Features
- 🔐 **Secure Registration & Login**: User authentication powered by **Bcrypt** password hashing and **JWT HttpOnly cookies**.
- 👤 **Profile Management**: Profile customization (Avatar photo upload, bio/headline, social links, password updates).
- 📚 **Interactive Problem Browsing**: Search problems by title or category in real-time with custom dark popover dropdowns.
- 🎯 **Multi-Criterion Filters**: Filter problem sets by difficulty (Easy, Medium, Hard), tags (Arrays, Linked Lists, Graphs, DP), and status (Solved/Unsolved).
- 💻 **Multi-Language Online IDE**: Built-in code editor supporting **C, C++, Java, JavaScript, and Python 3**.
- ⏱️ **Practice Stopwatch**: Integrated timer with start, pause, and reset controls for speed-coding sessions.
- 📊 **Submission History & Analytics**: View submission results, runtime (ms), memory usage (kB), and acceptance accuracy percentages.
- 🔥 **Daily Streak Tracker**: Real calendar-day consecutive day solving streak algorithm.
- 🎲 **Pick Random Problem**: One-click random unsolved problem selector.

### 🤖 AI-Powered DSA Assistant (ChatAI)
- 🧠 **Integrated Google Gemini AI**: Context-aware DSA assistance powered by `@google/genai`.
- 💡 **Hints & Guidance**: Get step-by-step approach suggestions, code reviews, and debugging help without revealing full spoilers.
- 🚀 **Complexity Analysis**: Provides optimized solutions with **time and space complexity** ($O(N)$).
- 🧪 **Edge Case Generation**: Identifies edge cases and potential runtime errors.
- 🎯 **Contextual AI**: Reads active problem statements, constraints, example testcases, and user code for tailormade responses.

### 🧩 Problem System
- 📚 **Handcrafted Problem Set**: Detailed problem statements, constraints, and example testcases.
- 🟢 **Easy** | 🟡 **Medium** | 🔴 **Hard** difficulty levels.
- 📝 **Multi-Language Templates**: Pre-configured starter code templates (`// Write your solution here`) and reference solutions across 5 languages.
- 🧪 **Rigorous Testcases**: 3 visible example testcases with explanations + 11 hidden evaluation testcases per problem.

### 🎬 Video Solution System
- 🎥 **Dual-Source Video Editorials**: Integrated video solutions supporting both **YouTube iFrame players** (with responsive 16:9 aspect ratio) and **Cloudinary MP4s** directly inside the Editorial tab.

### ⚙️ Code Execution & Evaluation
- 🧠 **Self-Hosted Judge0 Engine**: Code execution sandbox with time and memory limit enforcement.
- ⏱️ **Fast Mongoose `.lean()` & Redis**: High-speed database queries and non-blocking token blocklist verification.
- 📊 **Automatic Verdict Generation**:
  - 🟢 **Accepted**
  - 🔴 **Wrong Answer**
  - 🟡 **Time Limit Exceeded**
  - ⚠️ **Runtime Error / Compile Error**

### 🛠️ Admin Dashboard
- 📋 **Complete Problem Management**: Zod-validated administrative portal to create, edit, and delete problems.
- 🧪 **Test Case Editor**: Configure 3 visible example cases with explanations and 11 hidden evaluation cases.
- 🎥 **Video Solution Publishing**: Attach YouTube URLs or upload local MP4 video editorials to Cloudinary.
- 🔐 **Protected Authorization**: Secured with role-based access control (`adminMiddleware`).

---

## 🧰 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend Framework** | React 19, React Router v7, Redux Toolkit |
| **Styling & Icons** | Tailwind CSS, DaisyUI, Lucide Icons |
| **Code Editor** | Custom Multi-Language IDE with Monaco / Syntax Highlighting |
| **Backend Runtime** | Node.js, Express.js |
| **Authentication & Security** | JWT, Cookie-Parser, Bcrypt, Role-Based Access Control (RBAC) |
| **Database & Caching** | MongoDB Atlas (Mongoose `.lean()` queries), Cloud Redis (Non-blocking token blocklist) |
| **Code Execution Engine** | Self-Hosted Judge0 Sandbox API |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Media Delivery** | Cloudinary API & YouTube Embed iFrame Player |

---

## 🏗️ Project Structure

```text
CodeForge/
│
├── frontend/                   # React 19 Single Page Application
│   ├── src/
│   │   ├── components/         # Navbar, Editorial, AdminPanel, AdminUpdate, AdminDelete, AdminVideo, AdminUpload, ChatAi, SubmissionHistory
│   │   ├── pages/              # Homepage, ProblemPage, Profile, Login, Signup, Admin
│   │   ├── utils/              # axiosClient (In-memory GET cache & interceptors)
│   │   ├── store/              # Redux Store configuration
│   │   ├── authSlice.js        # Authentication & User session Redux Slice
│   │   └── App.jsx             # React Router routing & Protected Admin guards
│   └── package.json
│
├── backend/                    # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/             # MongoDB (`db.js`) & Redis (`redis.js`) connection setup
│   │   ├── controllers/        # userAuthent, userProblem, userSubmission, solveDoubt, videoSection
│   │   ├── middleware/         # userMiddleware, adminMiddleware
│   │   ├── models/             # Mongoose Schemas (user, problem, submission, solutionVideo)
│   │   ├── routes/             # userAuth, problemCreator, submit, aiChatting, videoCreator
│   │   └── utils/              # problemUtility (Judge0 batch submissions & language mappings)
│   └── package.json
│
└── README.md
```

---

## 🔄 Code Execution & Evaluation Pipeline

```text
User Submits Code (C, C++, Java, JS, Python 3)
                      │
                      ▼
            React 19 Frontend
                      │
                      ▼
         Node.js + Express REST API
                      │
      ┌───────────────┴───────────────┐
      ▼                               ▼
MongoDB Atlas                  Judge0 Sandbox
(Store Submission Record)      (Execute Against 11 Hidden Cases)
      │                               │
      └───────────────┬───────────────┘
                      ▼
          Normalize Verdict Output
     (Accepted / Wrong Answer / TLE / Error)
                      │
                      ▼
      Update Solved List & User Analytics
```

---

## ⚡ Performance & Optimization Highlights

1. **0ms In-Memory Client Caching**: `axiosClient` caches static public GET requests for 15s while automatically bypassing user-specific endpoints (`/user/check`, `/problem/problemSolvedByUser`, `/userStats`) to prevent account cross-pollution.
2. **Mongoose `.lean()` Query Speed**: Backend endpoints use Mongoose `.lean()` to bypass heavy document hydration, reducing DB response time from 2.5s down to **5–15 milliseconds**.
3. **Non-Blocking Background Redis**: Redis token blocklist lookups run with a 0.8s max fallback timeout to an in-memory `Set`, ensuring the Node event loop never freezes on network delays.
4. **Persistent MongoDB Connection Pooling**: `minPoolSize: 5` maintains warm TCP sockets to MongoDB Atlas for instant query execution.

---

## 💻 Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tiwari-priya16/CodeForge-Online-Coding-Platform.git
cd CodeForge-Online-Coding-Platform
```

### 2. Configure Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
DB_CONNECT_STRING=your_mongodb_atlas_connection_string
JWT_KEY=your_jwt_secret_key
REDIS_PASS=your_redis_password
JUDGE0_URL=http://your_judge0_ip:2358
GEMINI_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Install & Start Backend

```bash
cd backend
npm install
npm start
```

*The backend server will run on `http://localhost:3000`.*

### 4. Install & Start Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

*The frontend application will run on `http://localhost:5173`.*

---

## 👩‍💻 Developer

**Priya Tiwari**  
B.Tech CSE — NIT Patna  
GitHub: **[Tiwari-priya16](https://github.com/Tiwari-priya16)**

---

## ⭐ Project Purpose

Developed as a full-stack portfolio project to demonstrate expertise in **scalable REST API design, role-based access control (RBAC), multi-language code execution pipelines, AI API integration, database indexing, and modern React 19 UI design**.
