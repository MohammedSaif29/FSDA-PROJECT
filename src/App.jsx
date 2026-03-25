import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ResourceDetail from './pages/ResourceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageResources from './pages/Admin/ManageResources';
import ManageUsers from './pages/Admin/ManageUsers';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminDownloads from './pages/Admin/AdminDownloads';
import AdminSavedResources from './pages/Admin/AdminSavedResources';
import PrivateRoute from './components/PrivateRoute';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/Student/StudentDashboard';
import ExploreResources from './pages/Student/ExploreResources';
import MyActivity from './pages/Student/MyActivity';
import SavedResources from './pages/Student/SavedResources';
import { getRedirectPathForRole, getRole, getUser } from './hooks/useAuth';

function App() {
  const token = localStorage.getItem('token');
  const role = getRole();
  const user = getUser();

  const defaultPath = token && user
    ? getRedirectPathForRole(role)
    : '/login';

  return (
    <>
      <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute role="STUDENT" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="explore" element={<ExploreResources />} />
          <Route path="activity" element={<MyActivity />} />
          <Route path="saved" element={<SavedResources />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to={defaultPath} replace />} />

      <Route element={<PrivateRoute role="ADMIN" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="resources" element={<ManageResources />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="downloads" element={<AdminDownloads />} />
          <Route path="saved" element={<AdminSavedResources />} />
          <Route path="feedback" element={<ManageUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
    </>
  );
}

export default App;
