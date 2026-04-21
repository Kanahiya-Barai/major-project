# AI Fraud Detection System - Setup Complete

## System Overview
A modern, full-stack fraud detection application with a Stripe-like dark theme UI, Firebase authentication, and real-time fraud analysis.

## Architecture

### Frontend (React)
- **Port**: 3000
- **Framework**: React 18.2
- **Features**:
  - Modern dark-themed UI (Stripe-style design)
  - Firebase Authentication (Sign In/Sign Up)
  - Protected Dashboard with user authentication
  - Real-time transaction monitoring
  - Interactive charts (Line, Bar, Pie) using Recharts
  - Responsive design (Mobile, Tablet, Desktop)
  - Lucide icons for modern UI elements

### Backend (Flask)
- **Port**: 5000
- **Framework**: Flask 2.3
- **Features**:
  - RESTful API endpoints
  - CORS enabled for frontend communication
  - Transaction management
  - Fraud detection integration
  - Request validation

### Machine Learning
- Model: RandomForestClassifier
- Features: Transaction amount, merchant info, category, location, temporal patterns
- Note: Model training script available (requires sample data)

### Database
- Firebase Firestore: User data and authentication
- SQLite: Transaction history and fraud alerts (optional local storage)

## Running the Application

### Backend
```powershell
# Activate virtual environment
cd d:\ai-fraud-detection-system
.venv\Scripts\Activate.ps1

# Start backend server
python -m backend.server
# Runs on http://localhost:5000
```

### Frontend
```powershell
# In a new terminal
cd d:\ai-fraud-detection-system\frontend
npm start
# Opens on http://localhost:3000
```

## API Endpoints

### Authentication (Firebase)
- Sign Up: `/signup`
- Sign In: `/signin`
- Auto-save user data to Firestore

### Transaction APIs
- `POST /api/transactions` - Submit new transaction
- `GET /api/transactions` - Retrieve all transactions
- `POST /api/check-fraud` - Check fraud risk for a transaction
- `GET /health` - Health check endpoint

## Features Implemented

### UI/UX
✅ Dark theme (Navy/Blue color scheme)
✅ Stripe-inspired dashboard design
✅ Responsive sidebar navigation
✅ Modern stat cards with icons
✅ Interactive charts and graphs
✅ Real-time transaction table
✅ Transaction filtering and search capability
✅ Mobile-first responsive design

### Authentication
✅ Firebase Authentication integration
✅ User sign-up with email/password
✅ User sign-in with session persistence
✅ Protected dashboard routes
✅ Auto-logout functionality
✅ User profile display

### Dashboard Features
✅ Transaction statistics (Count, Amount Protected, Detection Rate)
✅ Line chart: Transaction trends over time
✅ Pie chart: Fraud status distribution
✅ Transaction table with risk scores
✅ Status badges (Pending, Approved, Fraud)
✅ Risk level indicators (Low/High)
✅ User information display

### Backend
✅ Flask REST API
✅ CORS support for frontend
✅ Transaction model with in-memory storage
✅ Fraud prediction service
✅ Risk score calculation
✅ Error handling and validation

## Environment Configuration

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
PORT=3000
```

### Root (.env)
```
FLASK_ENV=development
FLASK_DEBUG=1
REACT_APP_API_URL=http://localhost:5000
API_PORT=5000
```

## Color Scheme

**Primary Colors:**
- Primary Blue: #3b82f6
- Dark Background: #0f172a
- Sidebar: #1e293b

**Secondary Colors:**
- Success Green: #10b981
- Warning Orange: #f59e0b
- Error Red: #ef4444
- Info Cyan: #06b6d4

**Text Colors:**
- Primary: #f1f5f9
- Secondary: #cbd5e1
- Tertiary: #94a3b8

## Dependencies Installed

### Frontend
- react (18.2.0)
- react-dom (18.2.0)
- react-router-dom (6.12.0)
- firebase (9.23.0)
- recharts (2.7.3)
- lucide-react (0.263.1)

### Backend
- Flask (2.3.0)
- Flask-CORS (4.0.0)
- pandas (2.0.0)
- numpy (1.24.0)
- scikit-learn (1.2.0)
- python-dotenv (1.0.0)
- requests (2.31.0)

## Next Steps

1. **Firebase Configuration**
   - Create a Firebase project
   - Add your Firebase credentials to frontend/.env
   - Enable Email/Password authentication

2. **ML Model Training**
   - Prepare transaction dataset (CSV format)
   - Place in `ml_model/data/transactions.csv`
   - Run: `python ml_model/train_model.py`

3. **Production Deployment**
   - Build frontend: `npm run build`
   - Deploy to Vercel/Netlify or similar
   - Deploy backend to AWS/Heroku or similar

4. **Database Setup**
   - Initialize Firebase Firestore
   - Create security rules for user data protection

## Accessing the Application

1. Open browser to `http://localhost:3000`
2. Sign up with email and password
3. User data saved to Firebase automatically
4. Access dashboard with transaction monitoring
5. Submit and track transactions

## Security Notes

- All user data encrypted in Firebase
- CORS configured for localhost development
- Environment variables for sensitive credentials
- Protected routes require authentication
- Session management with Firebase

---
**Last Updated**: April 7, 2026
**System Status**: ✅ Running
