import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors mb-4">
                            <BookOpen size={24} />
                            <span className="text-xl font-bold">EduVault</span>
                        </Link>
                        <p className="text-gray-400">
                            Empowering students and educators with premium access to knowledge, research, and learning materials.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link to="/resources?type=TEXTBOOK" className="text-gray-400 hover:text-white transition-colors">Textbooks</Link></li>
                            <li><Link to="/resources?type=PAPER" className="text-gray-400 hover:text-white transition-colors">Research Papers</Link></li>
                            <li><Link to="/resources?type=GUIDE" className="text-gray-400 hover:text-white transition-colors">Study Guides</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 EduVault. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
