import { Search, BookOpen, FileText, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.search.value;
        if (query) {
            navigate(`/resources?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="page-home">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Unlock Limitless Knowledge</h1>
                    <p className="hero-subtitle">
                        Access thousands of academic resources, from top-tier research papers to comprehensive study guides.
                    </p>

                    <form className="hero-search-form" onSubmit={handleSearch}>
                        <Search className="hero-search-icon" size={24} />
                        <input
                            name="search"
                            type="text"
                            className="hero-search-input"
                            placeholder="Search for textbooks, papers, or subjects..."
                        />
                        <button type="submit" className="btn btn-primary btn-large">Search</button>
                    </form>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">10K+</span>
                            <span className="stat-label">Resources</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">50+</span>
                            <span className="stat-label">Subjects</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">5K+</span>
                            <span className="stat-label">Educators</span>
                        </div>
                    </div>
                </div>
                <div className="hero-graphics">
                    {/* Abstract shapes for premium visual */}
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
            </section>

            {/* Categories Layer */}
            <section className="categories-section">
                <div className="section-header">
                    <h2>Browse by Category</h2>
                    <Link to="/resources" className="link-more">View All</Link>
                </div>

                <div className="category-grid">
                    <Link to="/resources?type=textbook" className="category-card glass-panel">
                        <div className="category-icon-wrapper blue-gradient">
                            <BookOpen size={32} />
                        </div>
                        <h3>Textbooks</h3>
                        <p>Comprehensive academic texts across all disciplines.</p>
                    </Link>

                    <Link to="/resources?type=paper" className="category-card glass-panel">
                        <div className="category-icon-wrapper purple-gradient">
                            <FileText size={32} />
                        </div>
                        <h3>Research Papers</h3>
                        <p>Latest publications and academic research articles.</p>
                    </Link>

                    <Link to="/resources?type=guide" className="category-card glass-panel">
                        <div className="category-icon-wrapper pink-gradient">
                            <Bookmark size={32} />
                        </div>
                        <h3>Study Guides</h3>
                        <p>Curated notes and summaries to boost your learning.</p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
