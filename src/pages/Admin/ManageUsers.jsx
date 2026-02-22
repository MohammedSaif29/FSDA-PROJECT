import { useState } from 'react';
import { Shield, UserX, Search } from 'lucide-react';

const mockUsers = [
    { id: 1, name: 'Alice Waverly', email: 'alice.w@university.edu', role: 'student', status: 'active' },
    { id: 2, name: 'Dr. Robert Jenkins', email: 'robert.j@university.edu', role: 'educator', status: 'active' },
    { id: 3, name: 'System Admin', email: 'admin@eduvault.com', role: 'admin', status: 'active' },
    { id: 4, name: 'Inactive User', email: 'old@university.edu', role: 'student', status: 'banned' },
];

export default function ManageUsers() {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleRole = (id) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                if (u.role === 'admin') return { ...u, role: 'student' };
                if (u.role === 'student') return { ...u, role: 'educator' };
                return { ...u, role: 'admin' };
            }
            return u;
        }));
    };

    const toggleStatus = (id) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
            }
            return u;
        }));
    };

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h2>User Access Management</h2>
                    <p className="text-secondary mt-1">Manage user roles and permissions.</p>
                </div>
            </div>

            <div className="glass-panel p-6 mb-8">
                <div className="search-input-wrapper max-w-md w-full mb-6">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
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
                                <th>Status</th>
                                <th>Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-secondary text-sm">{user.email}</div>
                                    </td>
                                    <td>
                                        <button
                                            className={`badge ${user.role === 'admin' ? 'admin' : 'user'} uppercase text-xs border-none cursor-pointer hover:opacity-80`}
                                            onClick={() => toggleRole(user.id)}
                                            title="Click to toggle role"
                                        >
                                            {user.role}
                                        </button>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-cell">
                                            {user.status === 'active' ? (
                                                <button
                                                    className="btn btn-danger btn-sm text-xs py-1 px-3"
                                                    onClick={() => toggleStatus(user.id)}
                                                >
                                                    <UserX size={14} /> Ban User
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-secondary btn-sm text-xs py-1 px-3"
                                                    onClick={() => toggleStatus(user.id)}
                                                >
                                                    <Shield size={14} /> Unban
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
