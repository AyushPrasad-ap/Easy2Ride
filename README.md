# Easy2Ride 🚀

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://app.netlify.com/sites/easy2ride/deploys)  
Live Demo: https://easy2ride.netlify.app

Easy2Ride is a full-stack vehicle-rental web app built with React on the frontend and Firebase on the backend. Users can browse, book, pay (via Razorpay), and manage scooter/motorbike rentals. Confirmation and cancellation emails are sent via EmailJS, and booking receipts can be downloaded as beautifully formatted PDFs.

*Currently the Razorpay api is working in test mode, so it does not involve real transactions. Feel free to try the complete booking process🙃!

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



