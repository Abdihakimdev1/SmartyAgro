# 🚀 Smarty System

> **Modern Money Management System** — Poultry, Livestock, Crypto, Savings, Loans & Currency Exchange

![Version](https://img.shields.io/badge/version-2.0.0-0cc44e?style=for-the-badge)
![License](https://img.shields.io/badge/license-Private-0b2a4a?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Active-0cc44e?style=for-the-badge)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Supabase Setup](#-supabase-setup)
- [Usage](#-usage)
- [Themes](#-themes)
- [Languages](#-languages)
- [Default Credentials](#-default-credentials)
- [Data Management](#-data-management)
- [Responsive Design](#-responsive-design)
- [Changelog](#-changelog)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌟 Overview

**Smarty System** is a modern web-based application designed for small business money management. It combines multiple business modules into one unified dashboard:

- 🐔 **Poultry Business**
- 🐄 **Livestock Management**
- ₿ **Crypto Trading**
- 💰 **Savings**
- 🤝 **Loans Management**
- 💱 **Currency Exchange**

The system uses **Supabase** for cloud data storage and offers **2 themes** and **2 languages**.

---

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Login** | Role-based access (Admin / Manager / Staff) |
| 💾 **Cloud Storage** | Supabase backend for data persistence |
| 🌓 **Dual Themes** | Smarty Green & Pro Dark |
| 🌍 **Bilingual** | Somali & English |
| 📊 **Live Dashboard** | Real-time charts and statistics |
| 🔍 **Smart Search** | Search across all sections |
| 🖨️ **Receipt Printing** | Auto-print poultry receipts |
| 📤 **Export / Import** | JSON backup & restore |
| 📱 **Fully Responsive** | Mobile, Tablet, Desktop |

### 🎨 UI/UX Features

- ⚡ **Modern Loading Animation** — Orbit spinner + progress bar
- 🔔 **Toast Notifications** — Modern popups (info / success / error)
- 🎨 **Smooth Transitions** — 60fps animations
- 📌 **Sticky Tables** — Fixed headers that don't jump
- 🖼️ **Profile Picture** — Upload custom avatar
- 🌙 **Dark Mode** — Complete dark theme
- 📱 **Sidebar Drawer** — Mobile-friendly navigation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | [Supabase](https://supabase.com) (PostgreSQL) |
| **Icons** | Phosphor Icons 2.1.1 |
| **Fonts** | Plus Jakarta Sans |
| **Auth** | Session Storage + Password |
| **Deployment** | Static Hosting (Netlify / Vercel / GitHub Pages) |

---

## 📁 Project Structure


---

## 🎨 UI Redesign (Oct 2026)

- Desktop: fixed navy sidebar (logo, profile card, nav with active state, logout) + topbar (search, clock, notifications, theme toggle)
- Mobile: top bar with logo/search/avatar, greeting hero, colored stat cards, quick links, bottom navigation with a center "+" (new poultry sale)
- Tablet: drawer menu, 2-column cards
- Light (Smarty Green) and Pro Dark themes
- New dashboard card: **Pending Loans**

### PDF report
Settings -> **PDF Report** -> choose a period -> **Download PDF**.
Includes summary, savings balances, poultry, livestock, crypto and loans. Needs internet the first time (jsPDF loads from CDN).

### Fix
- **Livestock payment method** now loads and updates with the currency, exactly like Poultry (the form used `live-` IDs but the loader looked for `livestock-`).

## 🟢 App icon (Oct 2026)
- New modern S icon (icon.svg, icon.png, icon-192/512, icon-maskable-512, apple-touch-icon, favicon.svg/.ico) linked in `index.html` with `manifest.webmanifest`.
- The same icon is used as the logo on the loading screen, login, sidebar and mobile header.

---

## v5 - Roles, secure login and Supabase update (Oct 2026)

- **Login:** Role + Email + Phone + Password (Supabase Auth). Passwords/PINs are no longer in the code. "Remember me" keeps the session; "Forgot password" -> ask the Admin.
- **Phone check:** after the password, the phone is verified in the database and bound to that login session. Wrong phone x5 locks 30 min, x10 locks 24 h (Admin can unlock). It is an extra check, not an SMS code.
- **Roles:** Admin (everything) > Manager (what Admin grants; can manage only Staff and only give permissions the Manager has) > Staff/Custom (Cashier, Employee, ...: only the permissions Admin ticks, e.g. View Sales, Add Sales, Manage Loans).
- **Settings > Staff & Roles:** add a person (name, email, phone, password, role, permissions), edit, disable/enable, reset password, unlock.
- **Settings > Activity Log (Admin):** sign-ins, sales, loans, savings and staff changes, written by the database.
- **Honest saving:** the screen updates only after Supabase confirms; failures show an error. Import/Reset are atomic and Admin-only. Deleting asks for your own password (checked on the server).
- **Supabase:** see `supabase/README.md`. The database lock (`02_lock_policies.sql`) is the last step.
