import { Users as UsersIcon, FileText as FileTextIcon, Download as DownloadIcon, AlertCircle as AlertCircleIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, UploadCloud, Settings as SettingsIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const uploadData = [
    { name: 'Jan', uploads: 45 },
    { name: 'Feb', uploads: 52 },
    { name: 'Mar', uploads: 48 },
    { name: 'Apr', uploads: 61 },
    { name: 'May', uploads: 56 },
    { name: 'Jun', uploads: 68 },
];

const categoryData = [
    { name: 'Computer Science', value: 35, color: '#3b82f6' },
    { name: 'Mathematics', value: 25, color: '#10b981' },
    { name: 'Science', value: 20, color: '#ef4444' },
    { name: 'Literature', value: 10, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#a855f7' },
];

const pendingApprovals = [
    {
        id: 1,
        title: 'Machine Learning Research Paper',
        author: 'Dr. Emily Zhang',
        category: 'computer-science',
        type: 'research-paper',
        status: 'Pending',
        icon: 'A' // Just a placeholder for an image/icon
    }
];

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-header">
                <div>
                    <h1 className="admin-dashboard-title">Admin Dashboard</h1>
                    <p className="admin-dashboard-subtitle">Manage resources, users, and platform analytics</p>
                </div>
                <div className="admin-dashboard-actions">
                    <Link to="/admin/resources" className="admin-btn-primary" aria-label="Upload a new resource">
                        <UploadCloud size={18} aria-hidden="true" />
                        <span>Upload Resource</span>
                    </Link>
                    <Link to="/admin/resources" className="admin-btn-secondary" aria-label="Manage all resources">
                        <SettingsIcon size={18} aria-hidden="true" />
                        <span>Manage All</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                    <div className="admin-metric-header">
                        <span className="admin-metric-title">Total Users</span>
                        <UsersIcon size={20} className="admin-metric-icon" />
                    </div>
                    <div className="admin-metric-value">1247</div>
                    <div className="admin-metric-trend positive">+12% from last month</div>
                </div>

                <div className="admin-metric-card">
                    <div className="admin-metric-header">
                        <span className="admin-metric-title">Total Resources</span>
                        <FileTextIcon size={20} className="admin-metric-icon" />
                    </div>
                    <div className="admin-metric-value">8</div>
                    <div className="admin-metric-trend positive">+8% from last month</div>
                </div>

                <div className="admin-metric-card">
                    <div className="admin-metric-header">
                        <span className="admin-metric-title">Total Downloads</span>
                        <DownloadIcon size={20} className="admin-metric-icon" />
                    </div>
                    <div className="admin-metric-value">8,937</div>
                    <div className="admin-metric-trend positive">+23% from last month</div>
                </div>

                <div className="admin-metric-card warning">
                    <div className="admin-metric-header">
                        <span className="admin-metric-title">Pending Approvals</span>
                        <AlertCircleIcon size={20} className="admin-metric-icon text-red" />
                    </div>
                    <div className="admin-metric-value text-red">1</div>
                    <div className="admin-metric-trend">Requires your attention</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="admin-charts-grid">
                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3 className="admin-chart-title">Upload Activity</h3>
                        <p className="admin-chart-subtitle">Monthly resource uploads</p>
                    </div>
                    <div className="admin-chart-content">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={uploadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="uploads" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3 className="admin-chart-title">Category Distribution</h3>
                        <p className="admin-chart-subtitle">Resources by category</p>
                    </div>
                    <div className="admin-chart-content flex-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    labelLine={true}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pending Approvals Section */}
            <div className="admin-approvals-section">
                <div className="admin-approvals-header">
                    <h3 className="admin-approvals-title">Pending Resource Approvals</h3>
                    <p className="admin-approvals-subtitle">Review and approve educator submissions</p>
                </div>

                <div className="admin-approvals-list">
                    {pendingApprovals.map((item) => (
                        <div key={item.id} className="admin-approval-item">
                            <div className="admin-approval-item-image">
                                <span className="admin-approval-item-icon">{item.icon}</span>
                            </div>

                            <div className="admin-approval-item-content">
                                <h4 className="admin-approval-item-title">{item.title}</h4>
                                <div className="admin-approval-item-meta">
                                    <span className="admin-approval-item-author">{item.author}</span>
                                    <span className="admin-approval-item-dot">•</span>
                                    <span className="admin-approval-item-category">{item.category}</span>
                                </div>
                                <div className="admin-approval-item-badges">
                                    <span className="admin-badge admin-badge-outline">{item.type}</span>
                                    <span className="admin-badge admin-badge-blue">{item.status}</span>
                                </div>
                            </div>

                            <div className="admin-approval-item-actions">
                                <button className="admin-action-btn admin-action-approve">
                                    <CheckCircleIcon size={16} />
                                    <span>Approve</span>
                                </button>
                                <button className="admin-action-btn admin-action-reject">
                                    <XCircleIcon size={16} />
                                    <span>Reject</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
