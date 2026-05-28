# 🌌 Nova Chat Application

<div align="center">

### Secure • Scalable • Real-Time Chat Backend

Built with **Node.js**, **TypeScript**, **Socket.io**, and **MongoDB**

</div>

---

## 📌 Overview

**Nova Chat** is a production-ready real-time chat backend engineered with scalability, security, and maintainability in mind.
The application provides a modern modular architecture with enterprise-level authentication, real-time communication, AWS cloud storage integration, and advanced backend security practices.

Designed for modern applications that require fast duplex messaging, secure authentication workflows, and cloud-native infrastructure.

---

# ✨ Core Features

## ⚡ Real-Time Communication

* Real-time duplex messaging using **Socket.io**
* Instant event broadcasting
* Live chat synchronization
* Scalable socket gateway architecture

## 🔐 Authentication & Authorization

* Secure Signup & Login system
* Access Token & Refresh Token workflow
* OTP Verification & Email Confirmation
* Password Recovery & Reset System
* Logout & Session Invalidation
* Protected Routes & Middleware Guards

## 🛡️ Security Layer

* Password hashing with secure cryptographic algorithms
* `Helmet` for HTTP security headers
* `CORS` configuration and origin protection
* `Express Rate Limit` against brute-force attacks
* Token-based authentication flow
* Secure environment variable handling

## ☁️ Cloud Infrastructure

* AWS S3 integration
* Media & large file uploads
* Multi-file asset management
* Cloud file deletion handling

## 📬 Email Services

* Automated emails using **NodeMailer**
* OTP delivery
* Email confirmation workflow
* Password recovery notifications

---

# 🧰 Tech Stack

| Category       | Technologies             |
| -------------- | ------------------------ |
| Runtime        | Node.js                  |
| Language       | TypeScript               |
| Framework      | Express.js               |
| Database       | MongoDB + Mongoose       |
| Real-Time      | Socket.io                |
| Authentication | JWT + Refresh Tokens     |
| Cloud Storage  | AWS S3                   |
| Mailing        | NodeMailer               |
| Security       | Helmet, CORS, Rate Limit |

---

# 📑 API Documentation

📬 Complete API documentation with request examples and responses:

### 🔗 Postman Documentation

**https://documenter.getpostman.com/view/43128963/2sBXwmSDxe**

---

# 📁 Project Structure

```bash
📦 src
┣ 📂 modules
┃ ┣ 📂 auth
┃ ┃ ┣ 📜 auth.controller.ts
┃ ┃ ┣ 📜 auth.dto.ts
┃ ┃ ┣ 📜 auth.service.ts
┃ ┃ ┗ 📜 auth.validation.ts
┃ ┃
┃ ┣ 📂 chat
┃ ┃ ┣ 📜 chat.controller.ts
┃ ┃ ┣ 📜 chat.dto.ts
┃ ┃ ┣ 📜 chat.events.ts
┃ ┃ ┣ 📜 chat.gateway.ts
┃ ┃ ┣ 📜 chat.service.ts
┃ ┃ ┗ 📜 chat.validation.ts
┃ ┃
┃ ┣ 📂 gateway
┃ ┃ ┣ 📜 gateway.dto.ts
┃ ┃ ┗ 📜 gateway.ts
┃ ┃
┃ ┗ 📂 user
┃   ┣ 📜 user.controller.ts
┃   ┣ 📜 user.dto.ts
┃   ┣ 📜 user.service.ts
┃   ┗ 📜 user.validation.ts
┃
┣ 📂 middlewares
┣ 📂 database
┣ 📂 utils
┣ 📂 services
┣ 📂 config
┗ 📜 server.ts
```

---

# 🛣️ API Endpoints

# 🔐 Authentication — `/api/auth`

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/signup`          | Register a new account         |
| POST   | `/confirm-email`   | Confirm user email             |
| POST   | `/login`           | Authenticate user              |
| POST   | `/resend-otp`      | Send a new OTP                 |
| POST   | `/refresh-token`   | Generate new access token      |
| PATCH  | `/update-password` | Update current password        |
| POST   | `/forget-password` | Send reset password email      |
| POST   | `/reset-password`  | Reset password using OTP/token |
| POST   | `/logout`          | Logout and invalidate tokens   |

---

# 💬 Chat — `/api/chat`

| Method/Event | Endpoint       | Description                |
| ------------ | -------------- | -------------------------- |
| GET          | `/getChat`     | Retrieve conversations     |
| Socket.io    | `Send Message` | Real-time message delivery |

---

# 👤 User — `/api/user`

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| GET    | `/:userId`                  | Get user profile           |
| PATCH  | `/:userId/freezed-account`  | Freeze account             |
| PATCH  | `/:userId/restored-account` | Restore account            |
| POST   | `/profile-image`            | Upload profile image       |
| POST   | `/cover-images`             | Upload cover images        |
| POST   | `/large-files`              | Upload large files         |
| DELETE | `/delete-aws-file`          | Delete single AWS file     |
| DELETE | `/delete-aws-files`         | Delete multiple AWS files  |
| POST   | `/delete-account-request`   | Request account deletion   |
| DELETE | `/delete-account`           | Permanently delete account |

---

# 🚀 Getting Started

---

## 1️⃣ Configure Environment Variables

Create a `.env` file:

```env
APPLICATION_NAME=
PORT=
MODE=

SALT_ROUND=

EMAIL_USER=
EMAIL_PASSWORD=

ACCESS_USER_TOKEN_SECRET=
REFRESH_USER_TOKEN_SECRET=


ACCESS_ADMIN_TOKEN_SECRET=
REFRESH_ADMIN_TOKEN_SECRET=

ACCESS_KEY_EXPIRES_IN=
REFRESH_KEY_EXPIRES_IN=

AWS_REGION=
BUCKET_NAME=
AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=

```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 🔥 Highlights

* Enterprise-grade backend structure
* Secure authentication workflow
* Cloud-ready infrastructure
* Real-time socket communication
* Clean modular architecture
* Scalable and maintainable codebase

---

<div align="center">

### 💡 Built with passion for scalable and secure backend systems.

</div>
