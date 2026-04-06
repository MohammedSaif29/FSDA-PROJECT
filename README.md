# EduVault - Educational Resource Library

EduVault is a full-stack educational resource platform for browsing, uploading, reviewing, and managing books, papers, and other academic materials.

## Repository Layout

This repository is organized so the two main parts of the system are easy to review:

- `frontend/`: React + Vite user interface
- `backend/`: Spring Boot API, authentication, business logic, and database integration
- `server/`: supporting Node auth helper used in local development
- `docs/`: production frontend build output
- `scripts/`: local development helper scripts

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Spring Boot, Java, Maven
- Database: MySQL
- Authentication: JWT and Google OAuth

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.6+

## Quick Start

### 1. Database

Create the database:

```sql
CREATE DATABASE eduvault;
```

Load the schema:

```bash
mysql -u root -p eduvault < schema.sql
```

Then update the database credentials in `backend/src/main/resources/application.properties`.

### 2. Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8081`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev:frontend
```

Frontend runs on `http://localhost:5173/FSDA-PROJECT/`.

### 4. Start Everything From Root

```bash
npm run dev
```

This starts:

- backend
- auth helper
- frontend

## Faculty-Friendly Structure

### Frontend

- `frontend/src/`
- `frontend/public/`
- `frontend/package.json`
- `frontend/vite.config.js`

### Backend

- `backend/src/main/java/`
- `backend/src/main/resources/`
- `backend/pom.xml`

## Key Features

- Role-based authentication for admin and user accounts
- Google sign-in with admin separation rules
- Admin workspace for users, resources, uploads, and analytics
- Downloadable educational resources with thumbnails and metadata
- Responsive frontend for laptop and mobile layouts
- Secure backend endpoints for uploads, downloads, and moderation

## Common Commands

From the repository root:

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
```

From the frontend folder:

```bash
cd frontend
npm run dev:frontend
npm run build
npm run lint
```

From the backend folder:

```bash
cd backend
mvn spring-boot:run
mvn -DskipTests compile
```

## Default Admin Login

- Email: `admin@eduvault.com`
- Password: `admin123`
