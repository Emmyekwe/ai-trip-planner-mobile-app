# Travel App Backend API

A Node.js/Express API for the Travel App with PostgreSQL database and OpenAI integration.

## Features

- User authentication and registration
- Trip management and recommendations
- AI-powered travel suggestions
- Database viewer web interface

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users` - Get user profile
- `POST /trips` - Create new trip
- `GET /trips` - Get user trips
- `POST /recommendations` - Get AI recommendations
- `GET /api/stats` - Database statistics
- `GET /api/users` - All users (admin)
- `GET /api/trips` - All trips (admin)
- `GET /db-viewer` - Database viewer web interface

## Environment Variables

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `OPENAI_API_KEY` - OpenAI API key
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Local Development

1. Install dependencies: `npm install`
2. Set up environment variables (see env.example)
3. Start server: `npm start`

## Deployment

This app is configured for deployment on Render. See deployment instructions below. 