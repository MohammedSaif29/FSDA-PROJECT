-- EduVault Database Schema

CREATE DATABASE IF NOT EXISTS eduvault;
USE eduvault;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER', 'STUDENT') NOT NULL,
    auth_provider ENUM('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL',
    google_id VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('TEXTBOOK', 'PAPER', 'GUIDE') NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating DOUBLE DEFAULT 0.0,
    downloads_count INT DEFAULT 0,
    file_url VARCHAR(500),
    image_url VARCHAR(500),
    uploaded_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Downloads table
CREATE TABLE downloads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id),
    UNIQUE KEY unique_download (user_id, resource_id)
);

-- Feedback table
CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id),
    UNIQUE KEY unique_feedback (user_id, resource_id)
);

-- Insert sample admin user
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@eduvault.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');
-- Password is 'password' (bcrypt hashed)

-- Insert sample resources
INSERT INTO resources (title, description, type, category, author, approved, uploaded_by) VALUES
('Introduction to Algorithms', 'Comprehensive guide to algorithms and data structures', 'TEXTBOOK', 'Computer Science', 'Thomas H. Cormen', true, 1),
('Machine Learning Basics', 'Fundamentals of machine learning', 'GUIDE', 'Computer Science', 'Andrew Ng', true, 1),
('Quantum Physics Research', 'Latest research in quantum computing', 'PAPER', 'Physics', 'Dr. Sarah Johnson', true, 1);
