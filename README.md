# EduVault Backend

Spring Boot backend prepared for Railway deployment.

## Run locally

1. Copy `.env.example` to `.env`
2. Fill in your database, JWT, and Google OAuth values
3. Run `mvn spring-boot:run`

## Railway

- Root directory: `backend`
- Build command: `mvn clean package -DskipTests`
- Start command: `java -Dserver.port=$PORT -jar target/*.jar`

Set these Railway variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_URL`
- `FRONTEND_LOGIN_URL`
- `FRONTEND_OAUTH_SUCCESS_URL`
- `APP_CORS_ALLOWED_ORIGINS`
- Google OAuth vars if you use Google login

Demo seed data is disabled by default. Only enable `APP_SEED_DEMO_DATA` or `APP_SEED_ADMIN_ACCOUNT` if you explicitly want sample records or a bootstrap admin account.
