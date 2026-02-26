import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role === 'admin') {
            navigate('/admin');
        } else if (role === 'educator') {
            navigate('/educator');
        } else if (role === 'student') {
            navigate('/student');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo-container">
                        <BookOpen className="login-logo-icon" size={32} />
                    </div>
                    <h1>EduResource Hub</h1>
                    <p>Sign in to access educational resources</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled hidden>Select your role</option>
                            <option value="student">Student</option>
                            <option value="educator">Educator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <a href="#" className="forgot-password">Forgot Password?</a>
                    <a href="#" className="create-account">Create Account</a>
                </div>

                <div className="demo-credentials">
                    <h4>Demo Credentials:</h4>
                    <p>Admin: admin@edu.com / admin123</p>
                    <p>Educator: educator@edu.com / educator123</p>
                    <p>Student: student@edu.com / student123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
