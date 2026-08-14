# AI Fraud Detection System

A modern, full-stack fraud detection application with a Stripe-like dark theme UI, Firebase authentication, and real-time fraud analysis using machine learning.

## System Overview

This project implements an intelligent fraud detection system that uses a RandomForestClassifier machine learning model to identify potentially fraudulent transactions in real-time. It features a complete dashboard for monitoring transactions, viewing statistics, and managing fraud alerts.

## Architecture

### Frontend (React 18.2)
- Modern dark-themed UI (Stripe-style design)
- Firebase Authentication (Sign In/Sign Up)
- Protected Dashboard with user authentication
- Real-time transaction monitoring
- Interactive charts (Line, Bar, Pie) using Recharts
- Responsive design (Mobile, Tablet, Desktop)
- Lucide icons for modern UI elements

### Backend (Flask 2.3)
- RESTful API endpoints
- CORS enabled for frontend communication
- Transaction management and request validation
- Fraud detection integration

### Machine Learning
- **Model**: RandomForestClassifier
- **Features**: Transaction amount, merchant info, category, location, temporal patterns

### Database
- **Firebase Firestore**: User data and authentication
- **SQLite**: Transaction history and fraud alerts (optional local storage)

## Project Structure

```
ai-fraud-detection-system/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # React components
│       ├── services/        # API services
│       ├── App.js
│       └── index.js
│
├── backend/                 # Flask backend API
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── models/              # Data models
│   └── server.py            # Flask app entry point
│
├── ml_model/                # Machine learning models
│   ├── data/                # Training data
│   ├── preprocessing.py     # Data preprocessing
│   ├── train_model.py       # Model training
│   ├── predict.py           # Prediction functions
│   └── risk_score.py        # Risk scoring logic
│
├── database/                # Database utilities
│   └── db.py                # Database initialization and operations
│
├── models/                  # Trained model files
│   └── fraud_model.pkl      # Serialized ML model
│
└── requirements.txt         # Python dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+

### 1. Backend Setup

1. Activate your virtual environment:
```powershell
cd ai-fraud-detection-system
.venv\Scripts\Activate.ps1
```

2. Install dependencies (if not already installed):
```bash
pip install -r requirements.txt
```

3. Configure Environment Variables:
Create `.env` in the root folder:
```
FLASK_ENV=development
FLASK_DEBUG=1
REACT_APP_API_URL=http://localhost:5000
API_PORT=5000
```

4. Start the backend server:
```bash
python -m backend.server
```
The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```

2. Configure Environment Variables:
Create `.env` in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:5000
PORT=3000
```

3. Setup Firebase:
Create a Firebase project, enable Email/Password authentication, and add your Firebase credentials to `frontend/.env`.

4. Start the development server:
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication (Firebase)
- `/signup` - Sign Up
- `/signin` - Sign In

### Transaction Management
- `POST /api/transactions` - Submit a new transaction
- `GET /api/transactions` - Retrieve all transactions
- `POST /api/check-fraud` - Check fraud risk for a transaction
- `GET /health` - Health check endpoint

## ML Model Training

To train the machine learning model:
1. Prepare your transaction dataset in CSV format.
2. Place the file at `ml_model/data/transactions.csv`.
3. Run the training script: `python ml_model/train_model.py`

## Features

- **Dark Theme UI**: Navy/Blue color scheme with a Stripe-inspired dashboard design.
- **Interactive Dashboard**: Transaction statistics, trend charts, fraud status distribution.
- **Authentication**: Firebase integration with protected dashboard routes.
- **Risk Assessment**: Real-time evaluation of transaction risk using machine learning.

## Support

For issues and questions, please open an issue in the repository.

# MAJOR-_PROJECT
