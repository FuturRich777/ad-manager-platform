# Ad Manager Platform

A comprehensive ad management platform for automating posting, scheduling, and analytics across Facebook, Google Ads, and LinkedIn.

## Project Structure

```
.
├── backend/          # Node.js + Express + TypeScript backend
├── frontend/         # React + TypeScript frontend
├── docker-compose.yml # PostgreSQL and Redis for development
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Database and Redis

```bash
docker-compose up -d
```

### 3. Set up Environment Variables

Backend:
```bash
cp backend/.env.example backend/.env
```

Frontend:
```bash
cp frontend/.env.example frontend/.env
```

### 4. Initialize Database

```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Run Development Servers

In separate terminals:

```bash
# Terminal 1 - Backend
npm run dev --workspace=backend

# Terminal 2 - Frontend
npm run dev --workspace=frontend
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

## Features

- ✅ Multi-client management
- ✅ Campaign creation and scheduling
- ✅ Platform integrations (Facebook, Google, LinkedIn)
- ✅ Analytics and reporting
- ✅ Content library
- ✅ Automated posting via job queue

## Tech Stack

### Backend
- Express.js
- TypeScript
- PostgreSQL + Prisma ORM
- Bull (job queue)
- Redis

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Recharts

## Development

### Database Migrations

```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

### Running Tests

```bash
npm run test --workspaces
```

### Building for Production

```bash
npm run build --workspaces
```

## API Documentation

API endpoints documentation coming soon.

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Create a pull request

## License

MIT
