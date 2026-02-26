import { BookOpen, Download, Bookmark, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
    // Mock Data
    const enrolledCourses = [
        { id: 1, title: 'Introduction to Quantum Physics', progress: 78, lastAccessed: '2 hours ago' },
        { id: 2, title: 'Advanced Data Structures and Algorithms', progress: 45, lastAccessed: 'Yesterday' },
        { id: 3, title: 'Machine Learning Fundamentals', progress: 92, lastAccessed: '3 days ago' }
    ];

    const recentDownloads = [
        { id: 1, title: 'Calculus III Study Guide', type: 'PDF', date: 'Oct 24, 2026' },
        { id: 2, title: 'React Performance Optimization', type: 'Video', date: 'Oct 22, 2026' }
    ];

    return (
        <div className="student-dashboard-page">
            {/* Header Section */}
            <div className="student-dashboard-header">
                <div>
                    <h1 className="student-dashboard-title">Welcome back, Student!</h1>
                    <p className="student-dashboard-subtitle">Here's an overview of your learning progress and recent activities.</p>
                </div>
                <div className="student-dashboard-actions">
                    <Link to="/resources" className="student-btn-primary">
                        <BookOpen size={18} aria-hidden="true" />
                        <span>Browse Resources</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="student-metrics-grid">
                <div className="student-metric-card">
                    <div className="student-metric-header">
                        <span className="student-metric-title">Enrolled Courses</span>
                        <BookOpen size={20} className="student-metric-icon text-indigo" />
                    </div>
                    <div className="student-metric-value">12</div>
                    <div className="student-metric-trend positive">+2 this month</div>
                </div>

                <div className="student-metric-card">
                    <div className="student-metric-header">
                        <span className="student-metric-title">Resources Downloaded</span>
                        <Download size={20} className="student-metric-icon text-emerald" />
                    </div>
                    <div className="student-metric-value">48</div>
                    <div className="student-metric-trend positive">+15 this week</div>
                </div>

                <div className="student-metric-card">
                    <div className="student-metric-header">
                        <span className="student-metric-title">Saved Items</span>
                        <Bookmark size={20} className="student-metric-icon text-amber" />
                    </div>
                    <div className="student-metric-value">24</div>
                    <div className="student-metric-trend">Ready to review</div>
                </div>

                <div className="student-metric-card">
                    <div className="student-metric-header">
                        <span className="student-metric-title">Study Streaks</span>
                        <Clock size={20} className="student-metric-icon text-rose" />
                    </div>
                    <div className="student-metric-value">14 Days</div>
                    <div className="student-metric-trend positive">Keep it up!</div>
                </div>
            </div>

            {/* Content Grids */}
            <div className="student-content-grid">
                {/* Active Courses */}
                <div className="student-section-card">
                    <div className="student-section-header">
                        <h3 className="student-section-title">Continue Learning</h3>
                        <Link to="/resources" className="student-link-text">View all courses</Link>
                    </div>
                    <div className="student-course-list">
                        {enrolledCourses.map(course => (
                            <div key={course.id} className="student-course-item">
                                <div className="student-course-info">
                                    <h4 className="student-course-name">{course.title}</h4>
                                    <span className="student-course-meta">Last accessed: {course.lastAccessed}</span>
                                </div>
                                <div className="student-course-progress-container">
                                    <div className="student-course-progress-bar">
                                        <div
                                            className="student-course-progress-fill"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="student-course-progress-text">{course.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="student-section-card">
                    <div className="student-section-header">
                        <h3 className="student-section-title">Recent Downloads</h3>
                        <Link to="/resources" className="student-link-text">Browse history</Link>
                    </div>
                    <div className="student-downloads-list">
                        {recentDownloads.map(item => (
                            <div key={item.id} className="student-download-item">
                                <div className="student-download-icon">
                                    <CheckCircle size={16} className="text-emerald" />
                                </div>
                                <div className="student-download-info">
                                    <h4 className="student-download-name">{item.title}</h4>
                                    <div className="student-download-meta">
                                        <span className="student-badge-outline">{item.type}</span>
                                        <span>Downloaded on {item.date}</span>
                                    </div>
                                </div>
                                <button className="student-icon-btn" aria-label={`Re-download ${item.title}`}>
                                    <Download size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
