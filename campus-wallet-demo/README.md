# BUK Pay Demo

A fully functional demo of a campus digital wallet system built with React and Tailwind CSS.

## 🚀 Demo Credentials

| Role | ID | PIN | Description |
|------|-----|------|-------------|
| Student | STU001 | 1234 | John Doe (₦25,000) |
| Student | STU002 | 1234 | Sarah Johnson (₦15,500) |
| Merchant | MER001 | 1234 | Campus Cafeteria |
| Merchant | MER002 | 1234 | Campus Bookstore |
| Admin | ADM001 | 1234 | System Administrator |

## 📋 Features

### Student Features
- ✅ View wallet balance and transaction history
- ✅ Send money to other students and merchants
- ✅ Generate QR code for receiving payments
- ✅ Track daily spending limits
- ✅ Profile management with PIN change

### Merchant Features
- ✅ Dashboard with sales analytics
- ✅ QR scanner simulation to accept payments
- ✅ Sales reports with date filtering
- ✅ Transaction history

### Admin Features
- ✅ System overview dashboard
- ✅ User management (activate/suspend accounts)
- ✅ Transaction monitoring
- ✅ System settings configuration
- ✅ Data export/import

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS + shadcn/ui** - Styling
- **React Router v6** - Routing
- **Lucide React** - Icons
- **LocalStorage** - Data Persistence

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Navigate to project folder
cd campus-wallet-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── student/      # Student-specific components
│   ├── merchant/     # Merchant-specific components
│   ├── admin/        # Admin-specific components
│   └── shared/       # Shared UI components
├── context/          # React Context providers
├── data/            # Mock data and helpers
├── lib/             # shadcn utilities
├── utils/           # Utility functions
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Tailwind styles
```

## 🔐 Authentication Flow

1. Select user type (Student/Merchant/Admin)
2. Enter ID (e.g., STU001)
3. Enter 4-digit PIN (default: 1234)
4. Redirects to role-specific dashboard

## 💾 Data Persistence

- All data is stored in browser's localStorage
- Data persists across page refreshes
- Use Admin > Settings > Reset Data to restore defaults

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 UI Features

- Modern shadcn/ui design system
- Smooth animations and transitions
- Toast notifications for feedback
- Loading states and skeletons
- Mobile-friendly navigation

## ⚡ Quick Test Scenarios

1. **Send Money**: Login as STU001 → Send Money → Select STU002 → Enter amount → Confirm
2. **Merchant Payment**: Login as MER001 → Scan & Pay → Simulate scan → Enter amount → Confirm
3. **User Management**: Login as ADM001 → Users → Suspend/Activate a user
4. **View Reports**: Login as MER001 → Reports → Filter by date range

## 📄 License

This is a demo project for educational purposes.
