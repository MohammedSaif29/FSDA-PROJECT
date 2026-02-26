import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageResources from './pages/Admin/ManageResources';
import ManageUsers from './pages/Admin/ManageUsers';
import Login from './pages/Login';
import StudentDashboard from './pages/Student/StudentDashboard';
import EducatorDashboard from './pages/Educator/EducatorDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="resources" element={<ResourceList />} />
        <Route path="resources/:id" element={<ResourceDetail />} />

        <Route path="login" element={<Login />} />

        {/* Role-Based Dashboards (using MainLayout) */}
        <Route path="student" element={<StudentDashboard />} />
        <Route path="educator" element={<EducatorDashboard />} />
      </Route>

      {/* Admin Routes with distinct Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="resources" element={<ManageResources />} />
        <Route path="users" element={<ManageUsers />} />
        {/* Pointing to existing pages so it's not a blank empty placeholder */}
        <Route path="categories" element={<ManageResources />} />
        <Route path="downloads" element={<ResourceList />} />
        <Route path="saved" element={<ResourceList />} />
        <Route path="feedback" element={<ManageUsers />} />
      </Route>
    </Routes >
  );
}

export default App;
