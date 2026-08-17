# Setup Guide

This repo is not fully self-contained on a fresh clone: the trained ML model
files and the `.env` file are intentionally not committed (see `.gitignore`),
so a new device needs a few setup steps before the app runs. This guide
covers all of them.

## 1. Prerequisites

- **Python 3.11+**
- **Node.js 20+** and npm
- Git (to clone the repo)

## 2. Clone and configure environment variables

```bash
git clone <repo-url>
cd major-project
cp .env.example .env
```

Open `.env` and fill in what you need. Every setting has a working default,
**except OTP email delivery**, which needs a decision:

- **Simplest (no setup):** leave `SMTP_HOST` empty. The OTP will be shown
  directly in the app's response instead of emailed — fine for local
  testing/demoing.
- **Real email via Gmail:**
  1. Turn on 2-Step Verification on a Gmail account (Google Account → Security).
  2. Go to Security → App Passwords → create one for "Mail".
  3. Put the Gmail address in `SMTP_USERNAME` / `SMTP_FROM_EMAIL`, and the
     16-character app password (no spaces) in `SMTP_PASSWORD`. Your normal
     Gmail password will **not** work here — it must be an app password.

## 3. Backend + ML engine (Python)

Both services share one virtual environment:

```bash
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate

pip install -r backend/requirements.txt -r ml-engine/requirements.txt
```

## 4. Train the ML models (required — not committed to git)

The fraud-scoring models (~30 MB of `.pkl` files) are excluded from git on
purpose. Generate them once from the included training dataset:

```bash
cd ml-engine
python -m training.train_supervised
python -m training.train_anomaly
python -m training.train_semisupervised
cd ..
```

This writes `random_forest.pkl`, `logistic_regression.pkl`,
`self_training.pkl`, `label_propagation.pkl`, `isolation_forest.pkl`,
`kmeans_clustering.pkl`, and `scaler.pkl` into `ml-engine/models/`. Takes
under a minute. You only need to do this once per machine (or whenever you
change the training data).

## 5. Frontend (Node)

```bash
cd frontend
npm install
cd ..
```

## 6. Run all three services

Order matters: start the ML engine before the backend, since the backend
calls it to score every transaction.

**Terminal 1 — ML engine**
```bash
cd ml-engine
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

**Terminal 2 — Backend API**
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**.

## 7. Logging in

The backend seeds a few demo accounts automatically on first startup:

| Email | Password | Role |
|---|---|---|
| `manishsahani.edu@gmail.com` | `12345@qq` | admin |
| `user@example.com` | `Password123` | user |

Note: only emails listed in `ADMIN_EMAILS` (plus the one above, which is
hardcoded) keep the admin role after logging in — any other account gets
reset to a regular user on login even if seeded as admin. Use the account
above (or add your own email to `ADMIN_EMAILS` in `.env`) to access the
admin dashboard.

Or just register a new account from the Sign Up page — it becomes a normal
user by default.

---

# What This App Does

A demo fraud-detection platform: it simulates a payments app, but every
transaction is scored for fraud risk in real time by a machine-learning
pipeline before it's approved.

**Accounts & login**
Sign up or log in with email/password (or Google). Two account types —
regular users and admins — land on different dashboards.

**Making a payment**
A "Make Payment" form submits a simulated transaction. It's instantly
scored for risk and either approved, challenged with a one-time email
code (OTP) before completing, or blocked outright.

**The fraud-detection engine**
Instead of one algorithm, every transaction is scored by six models at
once — Random Forest, Logistic Regression, Self-Training, and Label
Propagation for classification, plus Isolation Forest and K-Means for
spotting statistical outliers. Their scores are combined into one
risk level (low/medium/high) that decides what happens next.

**User dashboard**
Transaction history, account stats, and analytics charts (spending
trends, risk distribution over time).

**Admin dashboard**
Platform-wide oversight: all transactions, all users, and a queue of
flagged/suspicious transactions ("Alerts") that can be investigated,
assigned, and annotated.

**Fraud Ring Detector**
An admin-only page that looks *across* transactions rather than at one
at a time. It builds a network graph connecting senders to the receiver
accounts they paid, and automatically flags any receiver account being
paid by more than one different user — a classic sign of a money-mule
or collusion scheme that a single-transaction risk score can't catch
on its own.

**Real-time updates**
Alerts and new transactions push live to the admin dashboard via
WebSocket instead of requiring a page refresh.
