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
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Unlock Limitless Knowledge
                    </h1>
                    <p className="text-xl text-gray-300 mb-12">
                        Access thousands of academic resources, from top-tier research papers to comprehensive study guides.
                    </p>

                    <form className="max-w-2xl mx-auto mb-12" onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                name="search"
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search for textbooks, papers, or subjects..."
                            />
                            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-center space-x-12 mb-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">10K+</div>
                            <div className="text-gray-400">Resources</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">50+</div>
                            <div className="text-gray-400">Subjects</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">5K+</div>
                            <div className="text-gray-400">Educators</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Layer */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold">Browse by Category</h2>
                        <Link to="/resources" className="text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Link to="/resources?type=textbook" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Textbooks</h3>
                            <p className="text-gray-400">Comprehensive academic texts across all disciplines.</p>
                        </Link>

                        <Link to="/resources?type=paper" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                                <FileText size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Research Papers</h3>
                            <p className="text-gray-400">Latest publications and academic research articles.</p>
                        </Link>

                        <Link to="/resources?type=guide" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="bg-pink-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                                <Bookmark size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Study Guides</h3>
                            <p className="text-gray-400">Curated notes and summaries to boost your learning.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
