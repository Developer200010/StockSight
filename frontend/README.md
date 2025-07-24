# 📈 Stock Portfolio Tracker

Welcome to **Stock Portfolio Tracker** — a comprehensive, intuitive web application designed for investors and traders to monitor their portfolio performance, trades, splits, and currency rates across global markets and currencies.

---

## 🚀 Project Overview

**Stock Portfolio Tracker** enables users to:

- 📥 Upload and manage bulk trades via CSV import.
- 📊 Track real-time portfolio holdings derived from trade history.
- 📄 View detailed trade history with calculated metrics.
- 🔁 Monitor stock splits and corporate actions.
- 💱 Get live and historical currency exchange rates.
- 💰 Instantly see total portfolio value in multiple currencies (USD, INR, SGD).
- 📈 Visualize key metrics like total trades, holdings count, and more.

Built with a modern **React** frontend and **Node.js + Express** backend, powered by **MongoDB** and **Yahoo Finance API**, this full-stack dashboard delivers robust functionality with a smooth user experience.

---

## ⚙️ Features

### 🔧 Backend

- ✅ **CSV Upload API** for bulk trades with validation and overwrite capability.
- 📈 Dynamic aggregation to calculate holdings from trade data.
- 🔄 Real-time stock price fetching with optional caching.
- 📉 Historical prices and FX rates stored in MongoDB for consistency.
- 🔗 RESTful API endpoints:
  - `POST /api/trades/upload` – Upload CSV file with trades.
  - `GET /api/holdings` – Retrieve current holdings.
  - `GET /api/trades` – Fetch trade history.
  - `GET /api/splits` – Get corporate actions like stock splits.
  - `GET /api/currency-rates` – Get live FX rates.
  - `GET /api/portfolio/value` – Calculate total portfolio value.
  - `GET /api/portfolio/overview` – Get portfolio summary stats.

### 💻 Frontend

- 🌐 **Responsive UI** with Tailwind CSS and React.
- 📂 CSV file uploader with validation and error handling.
- 📊 Dashboard with cards, tables, and high-level insights.
- 🔁 Modular React components for holdings, trades, splits, and rates.
- 🔀 Smooth routing with React Router.
- ⏳ Loading states and graceful error displays.

---

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Vite

### Backend
- Node.js + Express
- MongoDB + Mongoose
- `yahoo-finance2` (for price & FX data)
- `multer` and `csv-parser` (for file handling)

---

## 🚀 Getting Started

### 🔍 Prerequisites

- Node.js v16+
- MongoDB (local or cloud)
- npm or yarn

---

### 🧪 Backend Setup

```bash
git clone https://github.com/your-repo-name.git
cd backend
npm install
```
### .env
```bash
1. MONGODB_URI=your_mongo_connection_string
2. PORT=5000
3. npm run dev
```
### set-up frontend
```bash
1. cd StockSight
2. npm install
3. npm run dev

```
