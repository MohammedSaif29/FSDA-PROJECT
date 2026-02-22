import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer glass-effect">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="navbar-brand">
                        <BookOpen className="brand-icon" />
                        <span className="brand-text">EduVault</span>
                    </Link>
                    <p className="footer-description">
                        Empowering students and educators with premium access to knowledge, research, and learning materials.
                    </p>
                </div>

                <div className="footer-links">
                    <h4>Resources</h4>
                    <ul>
                        <li><Link to="/resources?type=textbook">Textbooks</Link></li>
                        <li><Link to="/resources?type=paper">Research Papers</Link></li>
                        <li><Link to="/resources?type=guide">Study Guides</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="#" className="icon-btn"><Github size={20} /></a>
                        <a href="#" className="icon-btn"><Twitter size={20} /></a>
                        <a href="#" className="icon-btn"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} EduVault. All rights reserved.</p>
            </div>
        </footer>
    );
}
