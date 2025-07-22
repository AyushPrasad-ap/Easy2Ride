# Easy2Ride 🚀

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://app.netlify.com/sites/easy2ride/deploys)  
Live Demo: https://easy2ride.netlify.app

Easy2Ride is a full-stack vehicle-rental web app built with React on the frontend and Firebase on the backend. Users can browse, book, pay (via Razorpay), and manage scooter/motorbike rentals. Confirmation and cancellation emails are sent via EmailJS, and booking receipts can be downloaded as beautifully formatted PDFs.

> **Note:** Razorpay is currently in test mode, so no real transactions occur. Feel free to try the complete booking process! 🙃

---

## 📋 Table of Contents

1. [Features](#-features)  
2. [Tech Stack](#-tech-stack)  
3. [Project Structure](#-project-structure)  
4. [Getting Started](#-getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Clone & Install](#clone--install)  
   - [Environment Variables](#environment-variables)  
   - [Run Frontend](#run-frontend)  
   - [Run Backend (Order & Verification)](#run-backend-order--verification)  
5. [Deployment](#-deployment)  
6. [Usage](#-usage)  
7. [Contributing](#-contributing)  
8. [License](#-license)  

---

## 🔥 Features

- **User Authentication**: Email/password, Google, Facebook, GitHub via Firebase Auth  
- **Vehicle Catalog**: Browse by city & university, with search & filter  
- **Real-time Bookings**: Reserve vehicles, see ongoing & past bookings  
- **Pricing & Checkout**: Dynamic pricing, distance/fee tooltips, Razorpay integration  
- **PDF Receipts**: Generate/download booking confirmations with html2canvas & jsPDF  
- **Email Notifications**: Booking & cancellation emails via EmailJS  
- **Cancellation Flow**: Automated refund calculation & policy enforcement  
- **Responsive UI**: Mobile-first design with a fixed 768px content container and custom background  

---

## 🛠 Tech Stack

| Layer            | Technology                             |
| ---------------- | --------------------------------------- |
| **Frontend**     | React, React Router v6, Tailwind CSS\* |
| **Backend**      | Node.js (server.cjs), Express          |
| **Database**     | Firebase Realtime DB & Firestore       |
| **Auth**         | Firebase Auth                          |
| **Payments**     | Razorpay Checkout + server verification|
| **Email**        | EmailJS                                |
| **PDF Generation** | html2canvas, jsPDF                   |
| **Deployment**   | Netlify (frontend), Heroku\* (backend) |
| **Version Control** | Git, GitHub                         |

>\* Tailwind and Heroku are optional—feel free to swap CSS or hosting.

---

## 📁 Project Structure

easy2ride/
├─ public/ # Static assets (images, icons, html)
├─ src/
│ ├─ components/ # Reusable UI components
│ ├─ context/ # React context (AreaSelected, Firebase)
│ ├─ pages/ # Route pages (Home, Checkout, Payment, etc.)
│ ├─ utils/ # Helper functions (bookingUtils.js)
│ ├─ App.jsx # Root component
│ └─ main.jsx # ReactDOM.render + Router
├─ scripts/ # Seed Firestore, service account
├─ server.cjs # Express server for Razorpay order + verification
├─ .env # Environment variables (not checked in)
├─ package.json
├─ README.md
└─ vite.config.js

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16  
- npm or yarn  
- A Firebase project (with Auth, Realtime DB, Firestore)  
- Razorpay account (Key ID & Secret)  
- EmailJS account (Service ID, Template IDs, Public Key)

### Clone & Install

```bash
git clone https://github.com/AyushPrasad-ap/easy2ride.git
cd easy2ride
npm install           # or yarn
```

### Environment Variables

Create a .env in repo root with:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
EMAILJS_SERVICE_ID=service_...
EMAILJS_TEMPLATE_BOOKING=template_...
EMAILJS_TEMPLATE_CANCEL=template_...
EMAILJS_PUBLIC_KEY=your_public_key

### Run Frontend

npm run dev
# visits http://localhost:5173

### Run Backend (Order & Verification)

cd scripts
node server.cjs
# or if using Heroku deployment, skip local server

POST /api/create-order

POST /api/verify-payment

Adjust URLs in src/pages/paymentPage.jsx if you deploy backend elsewhere.

---

## Deployment

-Frontend: Push to GitHub → Netlify auto‐build & deploy
-Backend: Deploy server.cjs to Heroku (or any Node host)
-Update fetch(...) endpoints in paymentPage.jsx accordingly

---

## Usage

1) Sign Up / Login
2) Select City & University
3) Browse Vehicles → View Details
4) Pick Date/Time & Quantity → Check Availability
5) Proceed to Checkout → Pay via Razorpay
6) Receive Email Confirmation, view Booking History, or Cancel with refund.

---

## 🤝 Contributing

-🍴 Fork the repo
-📥 Clone your fork
-🔧 Create a feature branch (git checkout -b feat/XYZ)
-📝 Make your changes & commit (git commit -m "feat: ...")
-🔀 Push & open a PR
-✅ We’ll review & merge!

Please abide by the existing code style and include tests where possible.

---

## 📝 License

MIT License © Ayush Prasad

---

Built with ❤️ using React, Firebase, Razorpay, EmailJS & Netlify.

Feel free to tweak any badges or URLs. This gives newcomers everything they need—from running locally to deploying and contributing.

