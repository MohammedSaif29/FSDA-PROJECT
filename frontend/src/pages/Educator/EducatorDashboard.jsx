import { Users, FileText, Star, TrendingUp, PlusCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EducatorDashboard.css';

const EducatorDashboard = () => {
    // Mock Data
    const recentUploads = [
        { id: 1, title: 'Advanced Calculus Lecture Notes', type: 'PDF', views: 245, rating: 4.8 },
        { id: 2, title: 'Machine Learning Basics', type: 'Video', views: 890, rating: 4.9 },
        { id: 3, title: 'Physics Form sheet', type: 'Doc', views: 120, rating: 4.5 }
    ];

    const recentFeedback = [
        { id: 1, student: 'Alex M.', resource: 'Advanced Calculus Lecture Notes', comment: 'Very helpful formulas, thanks!', date: '2 hours ago' },
        { id: 2, student: 'Sarah K.', resource: 'Machine Learning Basics', comment: 'Great explanation of neural nets.', date: 'Yesterday' }
    ];

    return (
        <div className="educator-dashboard-page">
            {/* Header Section */}
            <div className="educator-dashboard-header">
                <div>
                    <h1 className="educator-dashboard-title">Educator Portal</h1>
                    <p className="educator-dashboard-subtitle">Manage your educational content and student engagement.</p>
                </div>
                <div className="educator-dashboard-actions">
                    <button className="educator-btn-secondary">
                        <FileText size={18} />
                        <span>My Resources</span>
                    </button>
                    <button className="educator-btn-primary">
                        <PlusCircle size={18} />
                        <span>Upload New</span>
                    </button>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="educator-metrics-grid">
                <div className="educator-metric-card">
                    <div className="educator-metric-header">
                        <span className="educator-metric-title">Total Students Reached</span>
                        <Users size={20} className="educator-metric-icon text-indigo" />
                    </div>
                    <div className="educator-metric-value">1,450</div>
                    <div className="educator-metric-trend positive">+124 this month</div>
                </div>

                <div className="educator-metric-card">
                    <div className="educator-metric-header">
                        <span className="educator-metric-title">Active Resources</span>
                        <FileText size={20} className="educator-metric-icon text-emerald" />
                    </div>
                    <div className="educator-metric-value">34</div>
                    <div className="educator-metric-trend positive">2 pending approval</div>
                </div>

                <div className="educator-metric-card">
                    <div className="educator-metric-header">
                        <span className="educator-metric-title">Average Rating</span>
                        <Star size={20} className="educator-metric-icon text-amber" />
                    </div>
                    <div className="educator-metric-value">4.7 / 5</div>
                    <div className="educator-metric-trend">Across all courses</div>
                </div>

                <div className="educator-metric-card">
                    <div className="educator-metric-header">
                        <span className="educator-metric-title">Total Views</span>
                        <TrendingUp size={20} className="educator-metric-icon text-rose" />
                    </div>
                    <div className="educator-metric-value">12.5k</div>
                    <div className="educator-metric-trend positive">+8% from last week</div>
                </div>
            </div>

            {/* Content Grids */}
            <div className="educator-content-grid">
                {/* My Uploads */}
                <div className="educator-section-card">
                    <div className="educator-section-header">
                        <h3 className="educator-section-title">Recent Uploads</h3>
                        <Link to="/resources" className="educator-link-text">View all</Link>
                    </div>
                    <div className="educator-uploads-list">
                        {recentUploads.map(upload => (
                            <div key={upload.id} className="educator-upload-item">
                                <div className="educator-upload-info">
                                    <h4 className="educator-upload-name">{upload.title}</h4>
                                    <div className="educator-upload-meta">
                                        <span className="educator-badge-outline">{upload.type}</span>
                                        <span className="educator-meta-divider">•</span>
                                        <span>{upload.views} Views</span>
                                    </div>
                                </div>
                                <div className="educator-upload-rating">
                                    <Star size={16} className="text-amber" fill="currentColor" />
                                    <span>{upload.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Feedback */}
                <div className="educator-section-card">
                    <div className="educator-section-header">
                        <h3 className="educator-section-title">Student Feedback</h3>
                        <Link to="#" className="educator-link-text">Read all comments</Link>
                    </div>
                    <div className="educator-feedback-list">
                        {recentFeedback.map(feedback => (
                            <div key={feedback.id} className="educator-feedback-item">
                                <div className="educator-feedback-icon">
                                    <MessageSquare size={16} className="text-indigo" />
                                </div>
                                <div className="educator-feedback-content">
                                    <div className="educator-feedback-header">
                                        <span className="educator-feedback-student">{feedback.student}</span>
                                        <span className="educator-feedback-date">{feedback.date}</span>
                                    </div>
                                    <p className="educator-feedback-text">"{feedback.comment}"</p>
                                    <span className="educator-feedback-resource">On: {feedback.resource}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducatorDashboard;
