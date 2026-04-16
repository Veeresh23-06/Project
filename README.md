# Smart Expense Tracker

A portfolio-ready full-stack expense tracking app with a clean React UI, Express/MongoDB backend, and data visualization.

## Features

- Add, edit, delete expenses
- Filter by category, date range, and search notes
- Summary cards with total spending and monthly totals
- Category-wise pie and bar charts
- Responsive, clean modern design with Tailwind CSS
- REST API backend with validation and error handling

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + Mongoose
- Database: MongoDB

## Setup

### 1. Backend

```powershell
cd backend
npm install
copy .env.example .env
# Update MONGO_URI in .env if needed
npm run dev
```

The backend will run by default at `http://localhost:5000`.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/expenses/summary`
- `GET /api/expenses/export`

## Notes

- Use `MONGO_URI` in `backend/.env` to connect to your MongoDB instance.
- You can deploy the app to any cloud provider once both services are running.
