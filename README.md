# AI Fraud Detection System

An intelligent fraud detection system that uses machine learning to identify potentially fraudulent transactions in real-time.

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
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Features

- **Real-time Fraud Detection**: Analyzes transactions in real-time using machine learning
- **Risk Scoring**: Calculates comprehensive risk scores based on multiple factors
- **Transaction Management**: Store and retrieve transaction history
- **Dashboard**: View transaction data and fraud alerts
- **API Integration**: RESTful API for seamless integration

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Initialize the database:
```bash
python database/db.py
```

3. Train the ML model:
```bash
python ml_model/train_model.py
```

4. Start the backend server:
```bash
python backend/server.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Transaction Management
- `POST /api/transactions` - Submit a new transaction
- `GET /api/transactions` - Retrieve all transactions
- `POST /api/check-fraud` - Check fraud risk for a transaction

### Health Check
- `GET /health` - Health check endpoint

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. Submit transactions using the Transaction Form
3. View transaction history and fraud alerts in the Dashboard
4. Monitor risk scores and fraud predictions

## ML Model

The system uses a Random Forest Classifier for fraud detection. The model is trained on historical transaction data and provides:
- Fraud probability
- Risk score
- Confidence level

### Model Features
- Transaction amount
- Merchant information
- Transaction category
- Geographic location
- Temporal patterns

## Security Considerations

- Use HTTPS in production
- Implement authentication and authorization
- Validate and sanitize all inputs
- Use environment variables for sensitive data
- Regularly update dependencies
- Implement rate limiting

## Future Enhancements

- Real-time model retraining
- Advanced anomaly detection
- Integration with external fraud databases
- Multi-factor authentication
- Advanced reporting and analytics
- Webhook notifications

## License

MIT License

## Support

For issues and questions, please open an issue in the repository.
