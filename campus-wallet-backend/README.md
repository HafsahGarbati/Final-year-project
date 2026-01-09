# BUK Pay Backend API

A Node.js/Express REST API for the BUK Pay campus digital wallet system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Edit `.env` file with your database credentials:
```
DB_HOST=localhost
DB_NAME=campus_wallet
DB_USER=postgres
DB_PASSWORD=your_password
```

3. **Create PostgreSQL database:**
```sql
CREATE DATABASE campus_wallet;
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the server:**
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs at `http://localhost:5000`

## 📋 Demo Credentials

| Role | ID | PIN |
|------|-----|------|
| Student | STU001-STU005 | 1234 |
| Merchant | MER001-MER004 | 1234 |
| Admin | ADM001 | 1234 |

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-pin` - Change PIN

### Wallet
- `GET /api/wallet/balance` - Get balance
- `POST /api/wallet/load` - Load funds
- `GET /api/wallet/summary` - Get wallet summary

### Transactions
- `POST /api/transactions/send` - Send money
- `GET /api/transactions/history` - Transaction history
- `GET /api/transactions/recent` - Recent transactions
- `GET /api/transactions/:id` - Get transaction details

### Merchants (Merchant only)
- `POST /api/merchants/process-payment` - Process payment
- `GET /api/merchants/sales` - Get sales data
- `GET /api/merchants/stats` - Get merchant stats

### Admin (Admin only)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/status` - Update user status
- `POST /api/admin/users/:id/add-funds` - Add funds
- `GET /api/admin/transactions` - All transactions
- `GET /api/admin/stats` - System statistics

## 🔐 Authentication

Use Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
src/
├── config/         # Database & constants
├── controllers/    # Route handlers
├── middleware/     # Auth, validation, errors
├── models/         # Sequelize models
├── routes/         # Express routes
├── utils/          # Helpers & seed script
└── server.js       # Entry point
```
