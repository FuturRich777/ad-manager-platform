import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth/routes';
import clientRoutes from './clients/routes';
import { errorHandler } from './middleware/errorHandler';
import { optionalAuthMiddleware } from './middleware/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Initialize Prisma
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(optionalAuthMiddleware);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'Ad Manager Platform API',
    version: '0.1.0',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/clients',
      'POST /api/clients',
      'GET /api/clients/:clientId',
      'PUT /api/clients/:clientId',
      'DELETE /api/clients/:clientId',
    ]
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: Health check: http://localhost:${port}/health`);
  console.log(`[server]: API docs: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[server]: Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
