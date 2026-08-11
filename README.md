⚡** CodeForge — Online Coding Platform **

CodeForge is a full-stack online coding platform inspired by platforms like LeetCode, designed to provide users with an interactive environment to practice programming problems, submit solutions, and track their coding activity.

The platform also includes an administrative dashboard for managing coding problems, platform content, notices, and other activities.

«🚀 Built as a full-stack development project to explore real-world web application architecture, authentication, role-based access, backend APIs, database management, and online code evaluation.»

---

✨ Features

👨‍💻 User Features

- 🔐 User registration and authentication
- 👤 User profile and account management
- 📚 Browse and practice coding problems
- 🔎 Explore problems based on difficulty/category
- 💻 Online code editor for writing solutions
- ▶️ Submit solutions for evaluation
- 📊 View submission results and status
- 🧠 Practice programming and improve problem-solving skills
- 📢 View important platform announcements/notices

---

🧩 Coding Problem System

- Problem-based coding practice similar to LeetCode
- Problem statements with detailed descriptions
- Difficulty classification
  - 🟢 Easy
  - 🟡 Medium
  - 🔴 Hard
- Support for programming-language based submissions
- Test-case based solution evaluation
- Submission status tracking
- Code submission history

---

🛠️ Admin Dashboard

The platform provides administrative functionality for managing the coding platform.

Admins can:

- 📋 Manage coding problems
- ➕ Add new coding problems
- ✏️ Update existing problems
- 🗑️ Remove problems
- 📢 Create and manage platform notices
- 📊 Manage platform content
- 👥 Manage users and platform activities
- 🔐 Access admin-only functionality through role-based authorization

---

🔐 Authentication & Authorization

CodeForge follows a role-based access approach.

User

Regular users can:

- Access coding problems
- Write and submit solutions
- View their submissions
- Access user-specific features

Admin

Administrators have additional privileges such as:

- Managing coding problems
- Managing notices
- Managing platform content
- Accessing the administrative dashboard

Unauthorized users cannot access protected administrative functionality.

---

🏗️ Project Architecture

The project follows a full-stack client-server architecture.

                    ┌─────────────────────┐
                    │       Client        │
                    │   Frontend / UI     │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │  Server / REST API  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication    Problem System    User System
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    └─────────────────────┘

---

🧰 Tech Stack

Frontend

- React.js
- JavaScript / TypeScript
- HTML5
- CSS3
- Tailwind CSS

Backend

- Node.js
- Express.js
- REST APIs
- APIs (RESTful APIs)

Database

- MongoDB

Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

---

📁 Project Structure

CodeForge/
│
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   └── ...
│
├── server/                 # Backend application
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── README.md
└── ...

«The exact folder structure may evolve as the project grows.»

---

🔄 How It Works

1. Authentication

A user registers/logs into the platform.

User
 ↓
Login / Register
 ↓
Authentication
 ↓
Authorized Platform Access

2. Solving a Problem

Select Problem
      ↓
Read Problem Statement
      ↓
Write Code
      ↓
Submit Solution
      ↓
Code Evaluation
      ↓
Submission Result

3. Administrative Workflow

Admin Login
     ↓
Admin Dashboard
     ↓
Manage Problems / Notices
     ↓
Create / Update / Delete Content
     ↓
Changes Reflected on Platform

---

🎯 Project Goals

The main objective of CodeForge is to build a practical online coding platform while gaining experience with:

- Full-stack web development
- REST API development
- Authentication and authorization
- Role-based access control
- Database design and management
- Frontend-backend integration
- CRUD operations
- Secure API design
- Git and GitHub workflows
- Real-world project architecture

---

🚀 Future Enhancements

The platform can be further extended with:

- 🏆 Leaderboards and rankings
- 🔥 Daily coding streaks
- 📈 Detailed user progress analytics
- 🏅 Badges and achievements
- 💬 Problem discussions
- ⭐ Problem bookmarking
- 🏷️ Advanced problem tagging and filtering
- ⏱️ Coding contests
- 🧑‍🤝‍🧑 Contest rankings
- 🌐 Support for additional programming languages
- ⚙️ Improved online code execution infrastructure
- 📊 Advanced admin analytics

---

📸 Screenshots

Screenshots of the platform will be added here as the UI and major modules are finalized.

Coming Soon 🚧

---

🧪 Running the Project Locally

Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

Clone the Repository

git clone <https://github.com/Tiwari-priya16/CodeForge-Online-Coding-Platform.git>
cd CodeForge

Install Dependencies

For the frontend:

cd client
npm install

For the backend:

cd ../server
npm install

Environment Variables

Create a ".env" file in the backend directory.

Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

«Never commit your ".env" file or other sensitive credentials to GitHub.»

Start the Backend

npm run dev

Start the Frontend

Open another terminal:

cd client
npm run dev

The application can then be accessed through the local development URL shown by the frontend development server.

---

🔒 Security

The project follows basic security practices such as:

- Protected API routes
- Role-based authorization
- Authentication for restricted resources
- Environment variables for sensitive configuration
- ".gitignore" for preventing sensitive files from being committed

---

📌 Project Status

🚧 Active Development

CodeForge is continuously being developed and improved. New features, UI improvements, backend functionality, and security enhancements are being added as the project progresses.

---

🤝 Contribution

This project is currently being developed as a personal learning and portfolio project.

Suggestions and improvements are welcome.

---

👩‍💻 Developer

Priya Tiwari

B.Tech — Computer Science & Engineering
NIT Patna

Connect

- GitHub: (https://github.com/Tiwari-priya16)

---

⭐ Why CodeForge?

CodeForge is more than a simple coding website. The project is being developed to understand how a real-world platform works across multiple layers:

Frontend
   ↓
API Layer
   ↓
Authentication & Authorization
   ↓
Business Logic
   ↓
Database
   ↓
Code Evaluation

The goal is to gradually transform the project into a production-style online coding platform while continuously improving its architecture, functionality, security, and user experience.

---

📜 License

This project is developed for educational and portfolio purposes.