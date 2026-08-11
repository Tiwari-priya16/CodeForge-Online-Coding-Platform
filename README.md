# ⚡ CodeForge — Online Coding Platform

CodeForge is a full-stack online coding platform inspired by **LeetCode**, built for practicing programming problems, submitting solutions, and tracking coding progress.

It also provides an **admin dashboard** for managing problems, users, test cases, and platform notices.

> 🚀 A real-world full-stack project exploring authentication, REST APIs, database management, role-based access control, and code execution using a self-hosted Judge0-based evaluation system.

---

## ✨ Features

### 👨‍💻 User Features

- 🔐 User registration and login
- 👤 Profile management
- 📚 Browse coding problems
- 🔎 Filter problems by difficulty/category
- 💻 Monaco-based online code editor
- ▶️ Submit solutions in multiple programming languages
- 📊 View submission results and history
- 🧠 Practice and improve problem-solving skills
- 📢 View platform announcements and notices

### 🧩 Problem System

- LeetCode-style coding problems
- Detailed problem statements, constraints, and examples
- 🟢 Easy | 🟡 Medium | 🔴 Hard difficulty levels
- Multi-language code submissions
- Visible and hidden test cases
- Test-case based evaluation
- Submission tracking and verdict generation

### ⚙️ Code Execution & Evaluation

- 🧠 Self-hosted **Judge0-based** code execution
- 🐳 Docker-based isolated execution environment
- ⏱️ Time and memory limit enforcement
- 🔒 Sandboxed execution for submitted code
- 📥 Input/output handling for test cases
- 📊 Automatic verdicts such as:
  - Accepted
  - Wrong Answer
  - Time Limit Exceeded
  - Runtime Error
- 🔁 Queue-based submission processing

### 🛠️ Admin Dashboard

- 📋 Create, update, and delete coding problems
- 🧪 Manage problem test cases
- 📢 Create and manage platform notices
- 👥 Manage users
- 📊 Monitor submissions and platform activity
- 🔐 Protected admin-only functionality

---

## 🏗️ Project Structure

```text
CodeForge/
│
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Application pages
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API communication
│       └── ...
│
├── server/                  # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── judge0/                  # Self-hosted Judge0 configuration
│
├── .gitignore
└── README.md
```

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript/TypeScript, Tailwind CSS |
| Code Editor | Monaco Editor |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, Bcrypt |
| Code Execution | Judge0, Docker |
| API Communication | REST API, Axios |
| Development | VS Code, Git, GitHub, Postman |

---

## 🔄 How It Works

```text
User
  │
  ▼
React Frontend
  │
  ▼
Node.js + Express API
  │
  ├──────────────► MongoDB
  │
  ▼
Submission Service
  │
  ▼
Self-hosted Judge0
  │
  ▼
Sandboxed Code Execution
  │
  ▼
Test Results / Verdict
  │
  ▼
Submission History
```

---

## 🔐 Authentication & Authorization

CodeForge uses **JWT-based authentication** with role-based access control.

**Users** can:

- Solve problems
- Submit code
- View results
- Track submission history

**Admins** can:

- Manage problems
- Manage test cases
- Manage users
- Post notices
- Monitor platform activity

Protected routes ensure that admin functionality is accessible only to authorized administrators.

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/Tiwari-priya16/CodeForge-Online-Coding-Platform.git>
cd CodeForge
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit `.env` files or other sensitive credentials to GitHub.

### 5. Start the Backend

```bash
cd server
npm run dev
```

### 6. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

### 7. Start Judge0

If using the self-hosted Judge0 setup:

```bash
cd judge0
docker-compose up -d
```

---

## 📌 Project Status

🚧 **Active Development**

CodeForge is continuously being improved with new features, UI enhancements, backend functionality, and improvements to the code evaluation system.

---

## 🚀 Future Enhancements

- 🏆 Global leaderboard
- 🔥 Daily coding streaks
- 📊 Advanced user analytics
- 🏅 Badges and achievements
- 💬 Problem discussion system
- ⭐ Bookmark/favorite problems
- ⏱️ Coding contests
- 🌐 Expanded language support
- 📡 Real-time judge updates using WebSockets

---

## 👩‍💻 Developer

**Priya Tiwari**  
B.Tech CSE — NIT Patna

GitHub: **Tiwari-priya16**

---

## ⭐ About the Project

CodeForge is being developed as a portfolio project to gain practical experience in **full-stack development, backend architecture, authentication, database design, role-based authorization, and secure code execution systems**.

The project aims to evolve into a production-style online coding platform rather than remaining a simple CRUD application.

---

## 📜 License

This project is developed for educational and portfolio purposes.