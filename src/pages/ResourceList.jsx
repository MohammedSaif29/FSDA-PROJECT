import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, Download, Star } from 'lucide-react';

const mockResources = [
    { id: 1, title: 'Introduction to Quantum Physics', author: 'Dr. Sarah Jenkins', type: 'textbook', category: 'Physics', rating: 4.8, downloads: 1240 },
    { id: 2, title: 'Machine Learning algorithms in Healthcare', author: 'Alan Turing Institute', type: 'paper', category: 'Computer Science', rating: 4.9, downloads: 856 },
    { id: 3, title: 'Advanced Calculus Study Guide', author: 'Math Department', type: 'guide', category: 'Mathematics', rating: 4.5, downloads: 3200 },
    { id: 4, title: 'Organic Chemistry Volume 2', author: 'James Weaver', type: 'textbook', category: 'Chemistry', rating: 4.7, downloads: 934 },
    { id: 5, title: 'The Impact of AI on Modern Economics', author: 'Economic Research Bureau', type: 'paper', category: 'Economics', rating: 4.6, downloads: 542 },
    { id: 6, title: 'Data Structures and Algorithms', author: 'Tech University', type: 'guide', category: 'Computer Science', rating: 4.9, downloads: 5600 },
];

export default function ResourceList() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialType = searchParams.get('type') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedType, setSelectedType] = useState(initialType);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Filtering logic
    const filteredResources = mockResources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType ? resource.type === selectedType : true;
        const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;

        return matchesSearch && matchesType && matchesCategory;
    });

    return (
        <div className="page-resources">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar glass-panel">
                <div className="filter-section">
                    <h3>Resource Type</h3>
                    <label className="checkbox-label">
                        <input
                            type="radio"
                            name="type"
                            checked={selectedType === ''}
                            onChange={() => setSelectedType('')}
                        /> All Types
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="radio"
                            name="type"
                            checked={selectedType === 'textbook'}
                            onChange={() => setSelectedType('textbook')}
                        /> Textbooks
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="radio"
                            name="type"
                            checked={selectedType === 'paper'}
                            onChange={() => setSelectedType('paper')}
                        /> Research Papers
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="radio"
                            name="type"
                            checked={selectedType === 'guide'}
                            onChange={() => setSelectedType('guide')}
                        /> Study Guides
                    </label>
                </div>

                <div className="filter-section">
                    <h3>Category</h3>
                    {['Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Economics'].map(category => (
                        <label key={category} className="checkbox-label">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                            /> {category}
                        </label>
                    ))}
                    {selectedCategory && (
                        <button className="btn btn-secondary btn-sm mt-3 w-full" onClick={() => setSelectedCategory('')}>
                            Clear Category Filter
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="resources-content">
                <div className="resources-header">
                    <h2>Browse Resources</h2>

                    <div className="search-input-wrapper w-full max-w-md">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Refine search..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="resources-grid">
                    {filteredResources.length > 0 ? (
                        filteredResources.map(resource => (
                            <Link to={`/resources/${resource.id}`} key={resource.id} className="resource-card glass-panel">
                                <div className="resource-card-image">
                                    <BookOpen size={48} opacity={0.5} />
                                </div>
                                <div className="resource-card-body">
                                    <span className="resource-tag">{resource.type.toUpperCase()}</span>
                                    <h3 className="resource-title">{resource.title}</h3>
                                    <p className="resource-author">{resource.author} • {resource.category}</p>

                                    <div className="resource-card-footer">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-sm font-medium">{resource.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Download size={16} />
                                            <span className="text-sm">{resource.downloads}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-400 glass-panel">
                            <h3 className="text-xl mb-2">No resources found</h3>
                            <p>Try adjusting your search filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
