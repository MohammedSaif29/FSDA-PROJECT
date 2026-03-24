import { Users as UsersIcon, FileText as FileTextIcon, Download as DownloadIcon, AlertCircle as AlertCircleIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, UploadCloud, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiFetch } from '../../api/apiClient';

const categoryData = [
    { name: 'Computer Science', value: 35, color: '#3b82f6' },
    { name: 'Mathematics', value: 25, color: '#10b981' },
    { name: 'Science', value: 20, color: '#ef4444' },
    { name: 'Literature', value: 10, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#a855f7' },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResources: 0,
        pendingApprovals: 0,
        totalDownloads: 0,
    });
    const [pendingResources, setPendingResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const statsData = await apiFetch('/api/admin/dashboard');
            const pendingData = await apiFetch('/api/admin/pending-resources');

            setStats(statsData);
            setPendingResources(pendingData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await apiFetch(`/api/admin/resources/${id}/approve`, { method: 'POST' });
            fetchDashboardData();
        } catch (error) {
            console.error('Error approving resource:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await apiFetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
            fetchDashboardData();
        } catch (error) {
            console.error('Error rejecting resource:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage resources, users, and platform analytics</p>
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/admin/resources" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                            <UploadCloud size={18} />
                            <span>Upload Resource</span>
                        </Link>
                        <Link to="/admin/resources" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                            <SettingsIcon size={18} />
                            <span>Manage All</span>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Total Users</p>
                                <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
                                <UsersIcon className="text-blue-400 mt-2" />
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Total Resources</p>
                                <h2 className="text-3xl font-bold">{stats.totalResources}</h2>
                                <FileTextIcon className="text-green-400 mt-2" />
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Pending Approvals</p>
                                <h2 className="text-3xl font-bold">{stats.pendingApprovals}</h2>
                                <AlertCircleIcon className="text-yellow-400 mt-2" />
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Total Downloads</p>
                                <h2 className="text-3xl font-bold">{stats.totalDownloads}</h2>
                                <DownloadIcon className="text-purple-400 mt-2" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Pending Approvals</h3>
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                {pendingResources.length === 0 ? (
                                    <div className="p-6 text-center text-gray-400">No pending approvals</div>
                                ) : (
                                    <div className="divide-y divide-gray-700">
                                        {pendingResources.map((resource) => (
                                            <div key={resource.id} className="p-6 flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <FileTextIcon size={24} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{resource.title}</h4>
                                                        <p className="text-gray-400">by {resource.author} • {resource.category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleApprove(resource.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                                                        <CheckCircleIcon size={16} className="inline mr-1" />
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(resource.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
                                                        <XCircleIcon size={16} className="inline mr-1" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
