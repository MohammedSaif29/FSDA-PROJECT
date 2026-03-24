# EduVault - Educational Resource Library

A full-stack web application for students and educators to access textbooks, research papers, and study guides.

## Features

- **Authentication**: JWT-based login system with roles (Admin/User)
- **Resource Management**: Upload, browse, search, and download educational resources
- **Admin Dashboard**: Analytics, user management, resource approval
- **Modern UI**: Dark theme with Tailwind CSS
- **File Upload**: Support for PDF files and images

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Spring Boot (Java)
- **Database**: MySQL
- **Authentication**: JWT

## Prerequisites

- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE eduvault;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=0203
```

3. Run the schema:
```bash
mysql -u root -p eduvault < schema.sql
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Resources
- `GET /api/resources` - Get approved resources
- `GET /api/resources/search?query=` - Search resources
- `GET /api/resources/filter?type=&category=` - Filter resources
- `POST /api/resources` - Upload resource (authenticated)
- `POST /api/resources/{id}/download` - Download resource
- `POST /api/resources/{id}/feedback` - Add feedback

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/pending-resources` - Pending approvals
- `POST /api/admin/resources/{id}/approve` - Approve resource
- `DELETE /api/admin/resources/{id}` - Delete resource

## Default Admin Account

- Username: `admin`
- Password: `password`

## Project Structure

```
├── backend/
│   ├── src/main/java/com/eduvault/eduvault/
│   │   ├── controller/     # REST controllers
│   │   ├── model/         # JPA entities
│   │   ├── repository/    # Data repositories
│   │   ├── service/       # Business logic
│   │   ├── config/        # Security & configuration
│   │   └── dto/           # Data transfer objects
│   └── src/main/resources/
│       └── application.properties
├── src/                   # React frontend
│   ├── components/
│   ├── pages/
│   └── layouts/
└── schema.sql            # Database schema
```

## Features Overview

### User Features
- Browse and search resources
- Filter by type and category
- Download resources
- Leave reviews and ratings
- Bookmark resources

### Admin Features
- Dashboard with analytics
- Approve/reject resource uploads
- Manage users
- View download statistics
- Upload resources directly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
