import { useState } from 'react';
import { Upload, Edit, Trash2, Search, Plus } from 'lucide-react';

const initialResources = [
    { id: 1, title: 'Quantum Physics', type: 'textbook', category: 'Physics', uploader: 'Admin' },
    { id: 2, title: 'ML in Healthcare', type: 'paper', category: 'CS', uploader: 'Dr. Smith' },
];

export default function ManageResources() {
    const [resources, setResources] = useState(initialResources);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            setResources(resources.filter(r => r.id !== id));
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const newTitle = e.target.title.value;
        const newType = e.target.type.value;
        const newCat = e.target.category.value;

        const newResource = {
            id: Date.now(),
            title: newTitle,
            type: newType,
            category: newCat,
            uploader: 'Admin'
        };

        setResources([...resources, newResource]);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h2>Manage Educational Resources</h2>
                    <p className="text-secondary mt-1">Upload, edit, and organize library materials.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Upload Resource
                </button>
            </div>

            <div className="glass-panel p-6 mb-8">
                <div className="search-input-wrapper max-w-md w-full mb-6">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search catalog..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Uploader</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map(resource => (
                                <tr key={resource.id}>
                                    <td className="font-medium">{resource.title}</td>
                                    <td>
                                        <span className="badge user uppercase text-xs">{resource.type}</span>
                                    </td>
                                    <td>{resource.category}</td>
                                    <td className="text-secondary">{resource.uploader}</td>
                                    <td>
                                        <div className="action-cell">
                                            <button className="icon-btn text-accent-primary" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                className="icon-btn text-danger"
                                                title="Delete"
                                                onClick={() => handleDelete(resource.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {resources.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-secondary">
                                        No resources found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal Upload resource mockup*/}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel blue-gradient" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="modal-header">
                            <h3>Upload New Resource</h3>
                            <button className="icon-btn" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>

                        <form onSubmit={handleUpload}>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label>Title</label>
                                    <input type="text" name="title" className="form-control" required placeholder="Enter resource title" />
                                </div>
                                <div className="input-group">
                                    <label>Resource Type</label>
                                    <select name="type" className="form-control">
                                        <option value="textbook">Textbook</option>
                                        <option value="paper">Research Paper</option>
                                        <option value="guide">Study Guide</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <input type="text" name="category" className="form-control" required placeholder="e.g. Physics, Chemistry..." />
                                </div>
                                <div className="input-group">
                                    <label>File Upload</label>
                                    <div className="border-2 border-dashed border-glass-border rounded-lg p-8 text-center cursor-pointer hover:border-accent-primary transition-colors">
                                        <Upload className="mx-auto mb-2 text-secondary" size={32} />
                                        <p className="text-secondary">Drag and drop file here, or click to browse</p>
                                        <p className="text-xs text-muted mt-2">Supports PDF, EPUB, DOCX (Max 50MB)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Resource</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
