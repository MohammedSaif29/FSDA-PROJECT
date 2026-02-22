import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Download, Star, ExternalLink, MessageSquare, ThumbsUp, ChevronLeft, Bookmark } from 'lucide-react';

const mockResource = {
    id: 1,
    title: 'Introduction to Quantum Physics',
    author: 'Dr. Sarah Jenkins',
    type: 'textbook',
    category: 'Physics',
    rating: 4.8,
    downloads: 1240,
    description: 'A comprehensive guide to understanding the fundamental principles of quantum mechanics. This textbook covers wave-particle duality, the Schrödinger equation, quantum tunneling, and applications in modern physics. Perfect for undergraduate physics students and enthusiasts alike.',
    publishDate: 'Oct 2023',
    pages: 450,
    fileSize: '15 MB'
};

const mockReviews = [
    { id: 1, user: 'Alex P.', date: '2 weeks ago', text: 'Incredibly detailed and easy to understand. Best resource on the topic.', rating: 5 },
    { id: 2, user: 'Maria G.', date: '1 month ago', text: 'Great for exam prep, though chapter 4 was a bit dense.', rating: 4 }
];

export default function ResourceDetail() {
    const { id } = useParams();
    const [feedback, setFeedback] = useState('');
    const [reviews, setReviews] = useState(mockReviews);

    const handleDownload = () => {
        alert('Simulating file download...');
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        const newReview = {
            id: Date.now(),
            user: 'Current User', // In real app, from auth context
            date: 'Just now',
            text: feedback,
            rating: 5 // Default for demo
        };

        setReviews([newReview, ...reviews]);
        setFeedback('');
    };

    const resource = mockResource;

    return (
        <div className="page-detail">
            <Link to="/resources" className="nav-link mb-6 inline-flex">
                <ChevronLeft size={20} /> Back to Resources
            </Link>

            <section className="detail-header glass-panel">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 z-0 rounded-2xl"></div>

                <div className="detail-header-content">
                    <div className="detail-icon-large">
                        <BookOpen size={48} />
                    </div>

                    <div className="detail-info">
                        <span className="resource-tag">{resource.type.toUpperCase()}</span>
                        <h1 className="text-4xl font-heading font-bold mb-2 mt-2">{resource.title}</h1>
                        <p className="text-xl text-secondary mb-4">By {resource.author}</p>

                        <div className="detail-meta">
                            <span><Star size={18} fill="currentColor" className="text-yellow-400" /> {resource.rating} Rating</span>
                            <span><Download size={18} /> {resource.downloads} Downloads</span>
                            <span><BookOpen size={18} /> {resource.category}</span>
                            <span><ExternalLink size={18} /> {resource.pages} Pages • {resource.fileSize}</span>
                        </div>

                        <div className="detail-actions">
                            <button className="btn btn-primary btn-large" onClick={handleDownload}>
                                <Download size={20} /> Download PDF
                            </button>
                            <button className="btn btn-secondary btn-large">
                                <Bookmark size={20} /> Save for Later
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="detail-body">
                <div className="main-content-col">
                    <section className="content-section glass-panel">
                        <h2>About this Resource</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {resource.description}
                        </p>
                    </section>

                    <section className="content-section glass-panel mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2>Feedback & Reviews</h2>
                            <span className="text-accent-primary font-medium">{reviews.length} Reviews</span>
                        </div>

                        <form className="mb-8" onSubmit={handleFeedbackSubmit}>
                            <div className="input-group">
                                <label>Add your feedback</label>
                                <textarea
                                    className="form-control"
                                    placeholder="What did you think of this material?"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <MessageSquare size={18} /> Submit Feedback
                            </button>
                        </form>

                        <div className="feedback-list">
                            {reviews.map(review => (
                                <div key={review.id} className="feedback-item">
                                    <div className="feedback-header">
                                        <div>
                                            <div className="feedback-user">{review.user}</div>
                                            <div className="flex text-yellow-400 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="feedback-date">{review.date}</div>
                                    </div>
                                    <p className="text-gray-300">{review.text}</p>
                                    <div className="mt-4 flex gap-4">
                                        <button className="icon-btn text-sm p-0 gap-1 flex items-center">
                                            <ThumbsUp size={14} /> Helpful
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="sidebar-col">
                    <section className="content-section glass-panel">
                        <h2>Resource Details</h2>
                        <ul className="flex flex-col gap-4 text-gray-300">
                            <li className="flex justify-between border-b border-glass-border pb-2">
                                <span className="text-text-secondary">Publisher:</span>
                                <span>EduVault Press</span>
                            </li>
                            <li className="flex justify-between border-b border-glass-border pb-2">
                                <span className="text-text-secondary">Publication Date:</span>
                                <span>{resource.publishDate}</span>
                            </li>
                            <li className="flex justify-between border-b border-glass-border pb-2">
                                <span className="text-text-secondary">Language:</span>
                                <span>English</span>
                            </li>
                            <li className="flex justify-between pb-2">
                                <span className="text-text-secondary">Format:</span>
                                <span>PDF, EPUB</span>
                            </li>
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
}
