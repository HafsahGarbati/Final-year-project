import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { WalletProvider } from './context/WalletContext';

// Shared components
import Login from './components/shared/Login';
import Navbar from './components/shared/Navbar';
import { PageLoader } from './components/shared/LoadingSpinner';

// Student components
import StudentDashboard from './components/student/StudentDashboard';
import SendMoney from './components/student/SendMoney';
import TransactionHistory from './components/student/TransactionHistory';
import QRCodeDisplay from './components/student/QRCodeDisplay';
import Profile from './components/student/Profile';

// Merchant components
import MerchantDashboard from './components/merchant/MerchantDashboard';
import ScanPay from './components/merchant/ScanPay';
import SalesReport from './components/merchant/SalesReport';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import TransactionMonitor from './components/admin/TransactionMonitor';
import SystemSettings from './components/admin/SystemSettings';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    if (currentUser?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (currentUser?.role === 'merchant') {
      return <Navigate to="/merchant/dashboard" replace />;
    } else if (currentUser?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout wrapper with Navbar - Centralized container
const DashboardLayout = ({ children, maxWidth = 'max-w-4xl' }) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pb-8">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

// Wide layout for admin pages
const WideDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pb-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

// App Routes
const AppRoutes = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <Routes>
      {/* Public route - Login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                currentUser?.role === 'student' ? '/student/dashboard' :
                  currentUser?.role === 'merchant' ? '/merchant/dashboard' :
                    currentUser?.role === 'admin' ? '/admin/dashboard' : '/'
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/send"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout maxWidth="max-w-lg">
              <SendMoney />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <TransactionHistory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/qr"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout maxWidth="max-w-lg">
              <QRCodeDisplay />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout maxWidth="max-w-lg">
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/load"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Merchant Routes */}
      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DashboardLayout>
              <MerchantDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/scan"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DashboardLayout maxWidth="max-w-lg">
              <ScanPay />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/reports"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <DashboardLayout>
              <SalesReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WideDashboardLayout>
              <AdminDashboard />
            </WideDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WideDashboardLayout>
              <UserManagement />
            </WideDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WideDashboardLayout>
              <TransactionMonitor />
            </WideDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout maxWidth="max-w-2xl">
              <SystemSettings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <WalletProvider>
            <AppRoutes />
          </WalletProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
