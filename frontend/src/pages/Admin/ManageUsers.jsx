import { useEffect, useMemo, useState } from 'react';
import { Crown, Mail, Search, Shield, UserPlus, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import { getUser } from '../../hooks/useAuth';
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUserRole } from '../../api/adminService';

export default function ManageUsers() {
  const currentUser = getUser();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) =>
      [user.username, user.email, user.role, user.fullName, user.authProvider]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [users, searchQuery]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Username, email, and password are required');
      return;
    }

    setCreatingAdmin(true);
    try {
      const createdUser = await createAdminUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setUsers((current) => [createdUser, ...current]);
      setForm({ username: '', email: '', password: '' });
      toast.success('Admin account created');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create admin account');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleToggleRole = async (user) => {
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    if (user.id === currentUser?.id && user.role === 'ADMIN') {
      toast.error('You cannot remove your own admin access here');
      return;
    }

    try {
      const updatedUser = await updateAdminUserRole(user.id, nextRole);
      setUsers((current) => current.map((item) => (item.id === updatedUser.id ? updatedUser : item)));
      toast.success(`User role updated to ${updatedUser.role}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      toast.error('You cannot delete your own account here');
      return;
    }

    if (!window.confirm(`Delete ${user.email}?`)) return;

    try {
      await deleteAdminUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success('User deleted');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2>User Access Management</h2>
          <p className="text-secondary mt-1">Only existing admins can create or promote other admins.</p>
        </div>
      </div>

      <div className="glass-panel p-6 mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-300">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Invite / Create Admin</h3>
            <p className="text-sm text-slate-400">This flow is admin-only and bypasses public registration.</p>
          </div>
        </div>

        <form onSubmit={handleCreateAdmin} className="grid gap-4 lg:grid-cols-3">
          <InputField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            icon={Shield}
            placeholder="admin.username"
          />
          <InputField
            label="Admin Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            icon={Mail}
            placeholder="admin@company.com"
          />
          <InputField
            label="Temporary Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            icon={Crown}
            placeholder="Create a secure password"
          />
          <div className="lg:col-span-3">
            <Button type="submit" loading={creatingAdmin}>
              <Crown className="h-4 w-4" />
              Create Admin Account
            </Button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 mb-8">
        <div className="search-input-wrapper max-w-md w-full mb-6">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search users by username, email, role..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Auth Provider</th>
                <th>Created</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 5 }) : filteredUsers).map((user, index) => (
                <tr key={loading ? `user-row-${index}` : user.id}>
                  {loading ? (
                    <td colSpan="5" className="py-5">
                      <div className="h-12 animate-pulse rounded-2xl bg-white/[0.05]" />
                    </td>
                  ) : (
                    <>
                      <td>
                        <div className="font-medium text-white">{user.fullName || user.username}</div>
                        <div className="text-secondary text-sm">{user.email}</div>
                      </td>
                      <td>
                        <button
                          className={`badge ${user.role === 'ADMIN' ? 'admin' : 'user'} uppercase text-xs border-none cursor-pointer hover:opacity-80`}
                          onClick={() => handleToggleRole(user)}
                          title="Toggle admin access"
                        >
                          {user.role}
                        </button>
                      </td>
                      <td className="text-slate-300">{user.authProvider}</td>
                      <td className="text-slate-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'Unknown'}
                      </td>
                      <td>
                        <div className="action-cell">
                          <button
                            className="btn btn-secondary btn-sm text-xs py-1 px-3"
                            onClick={() => handleToggleRole(user)}
                          >
                            <Shield size={14} /> {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm text-xs py-1 px-3"
                            onClick={() => handleDelete(user)}
                          >
                            <UserX size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No users found for this search.</div>
          ) : null}
        </div>
      </div>
    </>
  );
}
