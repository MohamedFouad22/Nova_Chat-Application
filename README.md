# 🌌 Nova Chat Application

Nova Chat Application is a robust, secure, and scalable real-time chat backend built with **Node.js**, **TypeScript**, and **Socket.io**. The application features a modular architecture, comprehensive security implementations, cloud-native file storage, and an automated email notification system.

---

## 🚀 Features & Technologies

* **Runtime & Language:** Node.js with TypeScript for strong typing and enterprise-grade maintainability.
* **Real-time Communication:** Socket.io for duplex, low-latency messaging and real-time event handling.
* **Database:** MongoDB via Mongoose for efficient object modeling and data persistence.
* **Security First:**
    * **Authentication:** Dual-token mechanism (Access & Refresh Tokens) along with OTP verification.
    * **Data Protection:** Password hashing using strong cryptographic functions.
    * **App Sec:** Armored with `Helmet` (HTTP headers protection), `CORS` management, and `Express Rate Limit` to mitigate DDoS and brute-force attacks.
* **Cloud Infrastructure:** Integrates AWS S3 for hosting high-capacity media assets and large files.
* **Notifications:** Automated mailing system powered by NodeMailer for transactional emails (OTPs, account verification).

---

## 📑 API Documentation

📬 You can find the complete and detailed API documentation with request examples here:
👉 **[Postman API Documentation](https://documenter.getpostman.com/view/43128963/2sBXwmSDxe)**

---

## 📁 Project Architecture & Modules

The project follows a highly organized, modular directory structure. Each feature is encapsulated within its own module directory to ensure loose coupling and high cohesion.

```text
📦 Modules
 ┣ 📂 Auth
 ┃ ┣ 📜 auth.controller.ts
 ┃ ┣ 📜 auth.dto.ts
 ┃ ┣ 📜 auth.services.ts
 ┃ ┗ 📜 auth.validation.ts
 ┣ 📂 Chat
 ┃ ┣ 📜 chat.controller.ts
 ┃ ┣ 📜 chat.dto.ts
 ┃ ┣ 📜 chat.events.ts
 ┃ ┣ 📜 chat.gateway.ts
 ┃ ┣ 📜 chat.services.ts
 ┃ ┗ 📜 chat.validation.ts
 ┣ 📂 getway
 ┃ ┣ 📜 gateway.dto.ts
 ┃ ┗ 📜 getway.ts
 ┗ 📂 User
   ┣ 📜 user.controller.ts
   ┣ 📜 user.dto.ts
   ┣ 📜 user.services.ts
   ┗ 📜 user.validation.ts

```

---

## 🛣️ API Endpoints Reference

### 🔐 Authentication Module (`/api/auth`)

| HTTP Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/signup` | Register a new user account |
| `POST` | `/confirm-email` | Verify email address using the received token/code |
| `POST` | `/login` | Authenticate user and return tokens |
| `POST` | `/resend-otp` | Generate and dispatch a new One-Time Password |
| `POST` | `/refresh-token` | Renew expired Access Tokens using a valid Refresh Token |
| `PATCH` | `/update-password` | Change password for authenticated users |
| `POST` | `/forget-password` | Trigger a password recovery email |
| `POST` | `/reset-password` | Set a new password using the recovery token |
| `POST` | `/logout` | Invalidate active tokens and terminate session |

### 💬 Chat Module (`/api/chat`)

| HTTP Method | Endpoint / Event | Description |
| --- | --- | --- |
| `GET` | `/getChat` | Retrieve chat history and active conversations |
| `Socket.io` | `Send Message` | Real-time event for duplex message delivery |

### 👤 User Management Module (`/api/user`)

| HTTP Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/:userId` | Fetch a specific user's profile data |
| `PATCH` | `/:userId/freezed-account` | Temporarily freeze/deactivate a user account |
| `PATCH` | `/:userId/restored-account` | Restore a previously frozen user account |
| `POST` | `/profile-image` | Upload or update user profile picture to AWS S3 |
| `POST` | `/cover-images` | Upload or update profile banner assets to AWS S3 |
| `POST` | `/large-files` | Handle multi-part or heavy file uploads via cloud storage |
| `DELETE` | `/delete-aws-file` | Remove a single specified object from AWS S3 |
| `DELETE` | `/delete-aws-files` | Batch delete multiple assets from AWS S3 |
| `POST` | `/delete-account-request` | Initiate account deletion sequence (OTP/Email trigger) |
| `DELETE` | `/delete-account` | Permanently purge account records from the system |


💡 *Developed with passion as a secure, production-ready backend layout.*
