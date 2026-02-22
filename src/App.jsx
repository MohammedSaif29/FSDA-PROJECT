import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageResources from './pages/Admin/ManageResources';
import ManageUsers from './pages/Admin/ManageUsers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="resources" element={<ResourceList />} />
        <Route path="resources/:id" element={<ResourceDetail />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />}>
          <Route index element={<ManageResources />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
