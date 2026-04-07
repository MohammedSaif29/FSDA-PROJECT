import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/Student/StudentDashboard';
import ExploreResources from './pages/Student/ExploreResources';
import MyActivity from './pages/Student/MyActivity';
import SavedResources from './pages/Student/SavedResources';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ResourceDetail from './pages/ResourceDetail';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminDownloads from './pages/Admin/AdminDownloads';
import AdminSavedResources from './pages/Admin/AdminSavedResources';
import ManageResources from './pages/Admin/ManageResources';
import ManageUsers from './pages/Admin/ManageUsers';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/layout/Layout';
import {
  isAuthenticated,
  getRole,
} from './hooks/useAuth';

function ProtectedRoute({ children, role }) {
  const isAuth = isAuthenticated();
  const currentRole = getRole();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Student layout routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="USER">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="explore" element={<ExploreResources />} />
          <Route path="activity" element={<MyActivity />} />
          <Route path="saved" element={<SavedResources />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
        </Route>

        {/* Admin layout routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="downloads" element={<AdminDownloads />} />
          <Route path="saved" element={<AdminSavedResources />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="resources" element={<ManageResources />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <>
      <AppContent />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#e5e7eb',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          },
        }}
      />
    </>
  );
}

export default App;
