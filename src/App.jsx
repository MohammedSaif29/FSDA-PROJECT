import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageResources from './pages/Admin/ManageResources';
import ManageUsers from './pages/Admin/ManageUsers';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const defaultPath = token && user
    ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/home')
    : '/login';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="resources" element={<ResourceList />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="resources" element={<ManageResources />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="categories" element={<ManageResources />} />
          <Route path="downloads" element={<ResourceList />} />
          <Route path="saved" element={<ResourceList />} />
          <Route path="feedback" element={<ManageUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

export default App;
