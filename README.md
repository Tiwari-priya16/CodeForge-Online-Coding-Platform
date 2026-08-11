⚡ CodeForge — Online Coding Platform

CodeForge is a full-stack coding platform inspired by LeetCode, built to practice programming problems, submit solutions, and track progress.

It also includes an admin dashboard to manage problems, users, and platform content.

«🚀 Built to explore real-world full-stack development, authentication, APIs, databases, system design, and code evaluation infrastructure using a self-hosted execution engine.»

---

✨ Features

👨‍💻 User Features

- 🔐 Authentication (Register/Login)
- 👤 Profile management
- 📚 Browse coding problems
- 🔎 Filter by difficulty/category
- 💻 Built-in Monaco-based code editor
- ▶️ Submit solutions in multiple languages
- 📊 View results & submission history
- 🧠 Practice & improve skills
- 📢 View announcements/notices

---

🧩 Problem System

- LeetCode-style coding problems
- Clear problem statements with constraints & examples
- Difficulty levels:
  - 🟢 Easy
  - 🟡 Medium
  - 🔴 Hard
- Multi-language support (C++, Java, Python, JavaScript, etc.)
- Test-case based evaluation system
- Hidden + visible test cases
- Submission tracking & history

---

⚙️ Code Execution & Evaluation System (Core Engine)

- 🧠 Judge0-based code execution system
- 🚀 Self-hosted Judge0 instance for scalable evaluation
- 🐳 Docker-based sandboxed execution environment
- ⏱️ Time limit & memory limit enforcement
- 🔒 Secure isolated runtime for each submission
- 📥 Input/output stream handling for test cases
- 📊 Automatic verdict generation:
  - Accepted ✅
  - Wrong Answer ❌
  - Time Limit Exceeded ⏳
  - Runtime Error 💥
- 🔁 Queue-based submission processing system
- 📡 API integration between backend and Judge0 service

---

🛠️ Admin Dashboard

Admins can:

- 📋 Manage problems (CRUD)
- 📢 Post/manage notices
- 👥 Manage users
- 📊 Monitor submissions & system activity
- 🔐 Secure admin-only access
- 🧪 Add test cases for problems
- ⚙️ Configure problem constraints & metadata

---

🔐 Authentication & Roles

👤 User

- Solve problems
- Submit code
- View history
- Track performance

🛡️ Admin

- Manage platform content
- Add/update/delete problems
- Manage test cases
- Access admin dashboard

«Protected routes ensure strict role-based access control.»

---

🏗️ Architecture

Client (React Frontend)
        ↓
Backend API (Node.js + Express)
        ↓
Auth Service + Problem Service + Submission Service
        ↓
Code Execution Layer (Self-hosted Judge0)
        ↓
Database (MongoDB)

---

🧰 Tech Stack (Detailed)

🎨 Frontend

- React.js (Component-based UI)
- Tailwind CSS (Utility-first styling)
- JavaScript (ES6+)
- Axios (API communication)
- React Router (Routing)
- Monaco Editor (Code editor like VS Code)

---

⚙️ Backend

- Node.js (Runtime environment)
- Express.js (Server framework)
- RESTful API architecture
- JWT (Authentication system)
- Bcrypt (Password hashing)
- Middleware-based request handling

---

🧠 Code Execution System

- Judge0 API (Self-hosted instance)
- Docker (Containerized execution environment)
- Redis (Queue management for submissions)
- Worker-based architecture for processing submissions
- Sandboxed runtime isolation for security
- Multi-language compiler support via Judge0

---

🗄️ Database

- MongoDB (NoSQL database)
- Mongoose (ODM for schema modeling)
- Collections:
  - Users
  - Problems
  - Submissions
  - Test Cases
  - Admin Logs

---

🧪 Dev Tools & Infrastructure

- Git & GitHub (Version control)
- Postman (API testing)
- VS Code (Development environment)
- Nodemon (Backend development)
- dotenv (Environment configuration)

---

📁 Project Structure

CodeForge/
├── client/        # React Frontend
├── server/        # Node.js Backend
├── judge0/        # Self-hosted Judge0 setup
└── README.md

---

🔄 Workflow

🔐 Authentication

Login/Register → JWT Verification → Role-based Access

💻 Problem Solving

Select Problem → Write Code → Submit → Send to Judge0 → Execute in Sandbox → Return Result → Store Submission

🛠️ Admin Flow

Login → Dashboard → Manage Problems/Test Cases → Update Platform Content

---

🎯 Goals

- Real-world full-stack system design experience
- Scalable code execution architecture
- Secure authentication & authorization
- Distributed submission evaluation system
- Production-like backend engineering exposure

---

🚀 Future Enhancements

- 🏆 Global leaderboards
- 🔥 Daily streak system
- 📊 Advanced analytics dashboard
- 🏅 Badges & achievements
- 💬 Discussion forum per problem
- ⭐ Bookmark & favorite problems
- ⏱️ Live coding contests
- 🌐 Expanded language support
- 📡 WebSocket-based real-time judge updates

---

🧪 Run Locally

Clone Repository

git clone <https://github.com/Tiwari-priya16/CodeForge-Online-Coding-Platform.git>
cd CodeForge

---

Install Dependencies

Frontend:

cd client
npm install

Backend:

cd ../server
npm install

---

Run Services

Backend:

npm run dev

Frontend:

cd client
npm run dev

---

Judge0 (Self-hosted)

cd judge0
docker-compose up -d

---

🔐 Security

- JWT-based authentication
- Role-based access control
- Sandboxed code execution (Docker isolation)
- Environment variable protection
- Rate limiting on APIs
- Secure submission handling pipeline

---

📌 Status

🚧 Active Development

---

👩‍💻 Developer

Priya Tiwari
B.Tech CSE — NIT Patna

GitHub: https://github.com/Tiwari-priya16/
---

⭐ Summary

CodeForge is a full-stack coding platform designed to simulate real-world system design with problem solving, authentication, admin control, and a self-hosted Judge0-based code execution engine.

---

📜 License

Educational & portfolio project