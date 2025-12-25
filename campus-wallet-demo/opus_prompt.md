# Campus Fintech Platform - Development Prompt for Opus Agent

## Project Overview
Build a fully functional demo/simulation of a campus digital wallet system using React, Tailwind CSS, and in-memory data storage. The platform allows students to manage wallets, make payments, and merchants to accept payments, with an admin dashboard for oversight.

## Core Requirements
- Single-page React application with routing
- No backend required - use localStorage and in-memory data
- Responsive design with Tailwind CSS
- Simulate real-time transactions with visual feedback
- Pre-loaded demo data for immediate testing

---

## STEP 1: Project Setup & Structure

**Create the following folder structure:**
```
campus-wallet-demo/
├── public/
├── src/
│   ├── components/
│   │   ├── student/
│   │   ├── merchant/
│   │   ├── admin/
│   │   └── shared/
│   ├── context/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── tailwind.config.js
```

**Install dependencies:**
```bash
npx create-react-app campus-wallet-demo
cd campus-wallet-demo
npm install react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind CSS** in `tailwind.config.js` with a custom theme including campus brand colors.

---

## STEP 2: Mock Data Setup

**Create `/src/data/mockData.js` with:**

### Initial Data Structure:
```javascript
export const initialUsers = [
  {
    id: 'STU001',
    studentId: 'STU001',
    name: 'John Doe',
    email: 'john@campus.edu',
    phone: '08012345678',
    pin: '1234',
    role: 'student',
    walletBalance: 25000,
    dailyLimit: 50000,
    profilePicture: null
  },
  // Add 4 more students
  // Add 2 merchant accounts
  // Add 1 admin account
];

export const initialTransactions = [
  {
    id: 'TXN001',
    ref: 'REF-2024-001',
    senderId: 'STU001',
    receiverId: 'MER001',
    amount: 500,
    fee: 0,
    type: 'payment',
    status: 'completed',
    description: 'Cafeteria - Lunch',
    timestamp: '2024-12-20T12:30:00',
    deviceId: 'mobile-001'
  },
  // Add 15-20 sample transactions
];

export const initialMerchants = [
  {
    id: 'MER001',
    name: 'Campus Cafeteria',
    businessType: 'Food & Beverage',
    location: 'Main Building',
    walletBalance: 150000,
    commissionRate: 1.5,
    status: 'active'
  },
  // Add 3 more merchants
];
```

**Create helper functions in the same file:**
```javascript
export const findUserByStudentId = (studentId) => {...}
export const authenticateUser = (studentId, pin) => {...}
export const getTransactionHistory = (userId, limit) => {...}
export const createTransaction = (transaction) => {...}
export const updateBalance = (userId, amount, operation) => {...}
export const generateTransactionRef = () => {...}
export const generateQRCode = (userId, amount) => {...}
```

---

## STEP 3: Context Setup (State Management)

### Create `/src/context/AuthContext.jsx`:
- Manage current logged-in user
- Handle login/logout with student ID + PIN validation
- Store session in localStorage
- Auto-login from localStorage on app load
- Provide: `currentUser`, `login()`, `logout()`, `isAuthenticated`

### Create `/src/context/WalletContext.jsx`:
- Manage wallet balance and transactions
- Load data from localStorage (fallback to mockData)
- Provide functions:
  - `getBalance(userId)`
  - `sendMoney(senderId, receiverId, amount, description)`
  - `loadFunds(userId, amount)`
  - `getTransactions(userId)`
  - `refreshBalance()`
- Persist changes to localStorage immediately
- Emit success/error notifications

### Create `/src/context/NotificationContext.jsx`:
- Toast notification system
- Show success/error/info messages
- Auto-dismiss after 3 seconds
- Provide: `showNotification(type, message)`

---

## STEP 4: Shared Components

### Create `/src/components/shared/Login.jsx`:
**Features:**
- Tab switching between Student, Merchant, Admin
- Student ID input field
- PIN input (masked)
- Login button with loading state
- Error message display
- Demo credentials helper (show available test accounts)
- Validate credentials against mockData
- Redirect to appropriate dashboard on success

### Create `/src/components/shared/Navbar.jsx`:
- Display campus wallet logo
- Show current user name and balance (if logged in)
- Navigation links based on user role
- Logout button
- Mobile responsive hamburger menu

### Create `/src/components/shared/TransactionCard.jsx`:
- Display single transaction with icon
- Show sender/receiver names
- Amount with color (green for credit, red for debit)
- Status badge (completed/pending/failed)
- Timestamp formatting
- Click to view details

### Create `/src/components/shared/BalanceDisplay.jsx`:
- Large prominent balance amount
- Currency symbol (₦)
- Last updated timestamp
- Refresh button
- Visual loading skeleton

---

## STEP 5: Student Components

### Create `/src/components/student/StudentDashboard.jsx`:
**Layout:**
- Welcome message with student name
- Balance card (large, prominent)
- Quick action buttons:
  - Send Money
  - Request Money
  - Show QR Code
  - View History
- Recent transactions (last 5)
- Spending analytics (simple chart or stats)
- Daily limit indicator (progress bar)

### Create `/src/components/student/SendMoney.jsx`:
**Features:**
- Recipient selection (dropdown of other students/merchants)
- Manual student ID entry option
- Amount input with balance validation
- Description/note field
- Fee calculation display (if applicable)
- Confirm button
- Transaction preview modal
- Success animation after transaction
- View receipt option

**Validation:**
- Check sufficient balance
- Verify daily limit not exceeded
- Minimum amount: ₦10
- Maximum single transaction: ₦50,000

### Create `/src/components/student/TransactionHistory.jsx`:
- List all transactions (filterable)
- Filter options:
  - Date range picker
  - Transaction type (all/sent/received)
  - Merchant filter
- Search by description
- Sort by date/amount
- Export to CSV button (future)
- Pagination (10 per page)

### Create `/src/components/student/QRCodeDisplay.jsx`:
- Generate unique QR code for receiving payment
- Display student ID prominently
- Amount input (optional - for specific payment request)
- Time-limited code (countdown timer)
- Regenerate button
- Share QR code option
- Instructions text

### Create `/src/components/student/Profile.jsx`:
- Display student information
- Profile picture upload (simulated)
- Change PIN modal
- Daily limit settings
- Notification preferences
- Registered devices list
- Account created date

---

## STEP 6: Merchant Components

### Create `/src/components/merchant/MerchantDashboard.jsx`:
**Layout:**
- Today's sales summary card
- Transaction count (today)
- Average transaction value
- Total revenue (today/week/month tabs)
- Quick access to scan payment
- Recent transactions list
- Top selling hours chart (simple bar chart)

### Create `/src/components/merchant/ScanPay.jsx`:
**Simulation of QR Scanner:**
- Camera frame UI (fake camera view)
- "Scan QR Code" button
- Manual student ID entry fallback
- Amount input
- Description/items field
- Display student name after "scan"
- Confirm payment button
- Payment success animation
- Print receipt option (simulated)

**Process:**
1. Enter or "scan" student ID
2. Fetch student details and balance
3. Enter amount
4. Show confirmation with student name
5. Process payment (deduct from student, credit merchant)
6. Show success and transaction reference

### Create `/src/components/merchant/SalesReport.jsx`:
- Date range selector
- Total sales figure
- Transaction count
- Fee paid to system
- Net revenue
- Top customers (by transaction count)
- Transaction list with details
- Export report button

---

## STEP 7: Admin Components

### Create `/src/components/admin/AdminDashboard.jsx`:
**System Overview:**
- Total users count
- Total merchants count
- Today's transaction volume (count & value)
- System balance (total funds in system)
- Active users (last 24h)
- Revenue from fees
- Quick stats cards
- Real-time transaction feed (last 10)
- System health indicators (all green for demo)

### Create `/src/components/admin/UserManagement.jsx`:
**Features:**
- List all users (students + merchants)
- Search by student ID, name, or email
- Filter by status (active/suspended)
- View user details modal
- Actions:
  - View wallet balance
  - View transaction history
  - Suspend/activate account
  - Reset PIN (simulated)
  - Add funds (admin credit)
- Create new user form

### Create `/src/components/admin/TransactionMonitor.jsx`:
- Real-time transaction feed (all transactions)
- Filter by:
  - Transaction type
  - Status
  - Amount range
  - User/merchant
- Search by transaction reference
- Transaction details modal
- Flagged transactions indicator
- Reverse transaction option (for demo)

### Create `/src/components/admin/SystemSettings.jsx`:
- Configure transaction limits
- Set fee rates
- Daily limit defaults
- Merchant commission rates
- System maintenance mode toggle
- Backup data button (export to JSON)
- Import data button (restore from JSON)

---

## STEP 8: Routing & Navigation

### Create `/src/App.jsx`:
**Setup React Router with routes:**
```javascript
- / → Login (if not authenticated)
- /student/dashboard → StudentDashboard
- /student/send → SendMoney
- /student/history → TransactionHistory
- /student/qr → QRCodeDisplay
- /student/profile → Profile
- /merchant/dashboard → MerchantDashboard
- /merchant/scan → ScanPay
- /merchant/reports → SalesReport
- /admin/dashboard → AdminDashboard
- /admin/users → UserManagement
- /admin/transactions → TransactionMonitor
- /admin/settings → SystemSettings
```

**Protected route wrapper:**
- Check authentication status
- Redirect to login if not authenticated
- Verify user role matches route requirement

---

## STEP 9: Utilities & Helpers

### Create `/src/utils/helpers.js`:
```javascript
export const formatCurrency = (amount) => {...} // ₦25,000.00
export const formatDate = (timestamp) => {...} // Dec 20, 2024 12:30 PM
export const generateId = () => {...} // Unique IDs
export const validateStudentId = (id) => {...}
export const validateAmount = (amount, balance) => {...}
export const calculateFee = (amount, type) => {...}
export const getRelativeTime = (timestamp) => {...} // "2 hours ago"
export const maskPin = (pin) => {...} // ****
export const getInitials = (name) => {...} // JD
```

### Create `/src/utils/localStorage.js`:
```javascript
export const saveToStorage = (key, data) => {...}
export const loadFromStorage = (key, defaultValue) => {...}
export const clearStorage = () => {...}
export const exportData = () => {...} // Download JSON
export const importData = (jsonData) => {...} // Upload JSON
```

---

## STEP 10: Styling & UX

### Design System:
**Colors (Tailwind config):**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Warning: Yellow (#F59E0B)
- Background: Gray (#F9FAFB)
- Card: White (#FFFFFF)

**Component Styling Guidelines:**
- Cards: shadow-md, rounded-lg, p-6
- Buttons: rounded-lg, px-4, py-2, font-medium
- Inputs: border, rounded-md, px-3, py-2
- Animations: transition-all duration-200
- Mobile responsive: always use responsive classes

**Transitions & Feedback:**
- Loading spinners for async operations
- Success checkmarks with animations
- Error shake animations
- Smooth page transitions
- Skeleton loaders while data loads

---

## STEP 11: Special Features

### Transaction Simulation:
```javascript
// Add realistic delays
const processTransaction = async (txn) => {
  setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
  // Update balances
  // Create transaction record
  setLoading(false);
  showSuccessAnimation();
}
```

### Real-time Updates:
- Use React state to update UI immediately after transactions
- Refresh balance displays across all components
- Update transaction lists dynamically

### Demo Mode Features:
- "Fast forward time" button for admin (generate transactions)
- "Load sample data" button to reset to initial state
- Demo credentials overlay on login screen
- Tutorial tooltips (optional)

---

## STEP 12: Testing & Polish

### Pre-loaded Demo Scenarios:
1. **Student Login:** STU001, PIN: 1234 (Balance: ₦25,000)
2. **Merchant Login:** MER001, PIN: 1234
3. **Admin Login:** ADM001, PIN: 1234

### Test These Flows:
1. Student sends money to another student
2. Student pays merchant via QR code simulation
3. Merchant processes payment
4. Admin views all transactions
5. Admin suspends user account
6. Student attempts transaction with insufficient funds
7. Daily limit exceeded scenario

### Error Handling:
- Show user-friendly error messages
- Handle edge cases (empty balance, invalid inputs)
- Network error simulation (optional)

### Final Polish:
- Add loading states everywhere
- Smooth animations (use Framer Motion if desired)
- Consistent spacing and alignment
- Mobile responsive check (all screens)
- Accessibility: proper labels, keyboard navigation
- Add favicon and page title

---

## STEP 13: Documentation

### Create README.md with:
- Project description
- Demo credentials
- How to run locally
- Features implemented
- Tech stack used
- Screenshots (optional)

### Create inline code comments:
- Explain complex logic
- Document API-like functions
- Add TODO comments for future features

---

## DELIVERABLES

Build a complete, working demo that:
✅ Runs entirely in browser (no backend)
✅ Persists data in localStorage
✅ Has 3 distinct user roles with different dashboards
✅ Processes transactions with validation
✅ Shows real-time balance updates
✅ Has professional UI with Tailwind CSS
✅ Is mobile responsive
✅ Includes pre-loaded demo data
✅ Has smooth animations and transitions
✅ Can be demoed immediately without setup

**Output:** Complete React project with all files, ready to run with `npm start`

---

## Additional Guidelines

- Use functional components with hooks (no class components)
- Keep components under 300 lines (split if larger)
- Use meaningful variable names
- Add PropTypes for type checking (optional but recommended)
- Follow React best practices
- Make it production-quality even though it's a demo
- Prioritize user experience and visual polish

**Focus on making it impressive and fully functional for presentation purposes.**