import { Link } from 'react-router-dom';
import { BookOpen, UserCircle, Search, Settings } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="navbar glass-effect">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <BookOpen className="brand-icon" />
                    <span className="brand-text">EduVault</span>
                </Link>

                <div className="navbar-search">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={18} />
                        <input type="text" placeholder="Search resources..." className="search-input" />
                    </div>
                </div>

                <div className="navbar-links">
                    <Link to="/resources" className="nav-link">Resources</Link>
                    <Link to="/admin" className="nav-link">
                        <Settings size={18} />
                        <span>Admin</span>
                    </Link>
                    <button className="icon-btn profile-btn">
                        <UserCircle size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
