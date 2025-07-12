# 📚 StackIt – A Minimal Q&A Forum Platform

> 🚀 Built for Odoo Hackathon 2025  
> 👨‍💻 Team: Team 2321
> Email: priyanshukumar93861@gmail.com
> 🧠 Problem Statement: Build a collaborative Q&A platform for structured knowledge sharing

---

## 📌 Overview

**StackIt** is a simple, fast, and collaborative Q&A platform inspired by Stack Overflow, designed to help communities ask questions, share answers, and grow knowledge together.

Built with the **MERN stack**, StackIt emphasizes minimalism, rich-text formatting, real-time notifications, and a clean developer experience.

---

## 🔧 Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend     | React, TailwindCSS                  |
| Editor       | Tiptap (Rich Text Editor)           |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB + Mongoose                  |
| Auth         | JWT + bcrypt                        |
| Real-Time    | Socket.IO (for notifications)       |
| File Upload  | Cloudinary + Multer                 |
| Deployment   | Vercel (Frontend) + Render (Backend)|

---

## ✅ Core Features

### 👥 User Roles
- **Guest** – View all questions and answers
- **User** – Register, log in, post questions/answers, vote
- **Admin** – Moderate content

### ❓ Ask Questions
- Title, rich text description, multi-tag input
- Markdown-like editing using rich text editor

### 💬 Answer & Vote
- Answer questions using the same editor
- Vote up/down on answers
- Mark answer as “accepted” by question owner

### 📝 Rich Text Editor
- Bold, Italic, Strikethrough
- Lists, Emojis, Hyperlinks
- Image uploads via Cloudinary
- Mentions using `@username`

### 🔔 Notification System
- Bell icon with unread count
- Real-time notifications via Socket.IO for:
  - Answers on your question
  - Comments on your answer
  - Mentions using @username

---

## 🚀 Getting Started (Local Development)

### Backend Setup
```bash
cd server
npm install
npm run dev
