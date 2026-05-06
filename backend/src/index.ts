import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth/routes';
import clientRoutes from './clients/routes';
import integrationsRoutes from './integrations/routes';
import campaignRoutes from './campaigns/routes';
import contentRoutes from './content/routes';
import schedulerRoutes from './scheduler/routes';
import { errorHandler } from './middleware/errorHandler';
import { optionalAuthMiddleware } from './middleware/auth';
import {
  setupPostAdProcessor,
  setupSyncMetricsProcessor,
  setupWebhookProcessor,
  closeQueues,
} from './scheduler/queue';

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

// Initialize Job Processors
console.log('[scheduler]: Initializing job processors...');
setupPostAdProcessor();
setupSyncMetricsProcessor();
setupWebhookProcessor();
console.log('[scheduler]: Job processors ready');

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API documentation
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'Ad Manager Platform API',
    version: '0.1.0',
    modules: {
      auth: 'User authentication & authorization',
      clients: 'Client management',
      integrations: 'Platform OAuth & account connections',
      campaigns: 'Campaign & ad management',
      content: 'Content asset library',
      scheduler: 'Job scheduling & automation',
    },
    endpoints: {
      auth: [
        'POST /api/auth/signup - Register new user',
        'POST /api/auth/login - Login user',
        'GET /api/auth/me - Get current user',
      ],
      clients: [
        'GET /api/clients - List all clients',
        'POST /api/clients - Create client',
        'GET /api/clients/:id - Get client',
        'PUT /api/clients/:id - Update client',
        'DELETE /api/clients/:id - Delete client',
      ],
      integrations: [
        'GET /api/integrations/facebook/auth-url - Get Facebook OAuth URL',
        'POST /api/integrations/facebook/callback - Connect Facebook',
        'GET /api/integrations/google/auth-url - Get Google OAuth URL',
        'POST /api/integrations/google/callback - Connect Google',
        'GET /api/integrations/linkedin/auth-url - Get LinkedIn OAuth URL',
        'POST /api/integrations/linkedin/callback - Connect LinkedIn',
        'GET /api/integrations/clients/:clientId/accounts - Get connected accounts',
        'DELETE /api/integrations/clients/:clientId/accounts/:accountId - Disconnect',
      ],
      campaigns: [
        'GET /api/campaigns/client/:clientId - List campaigns',
        'POST /api/campaigns - Create campaign',
        'GET /api/campaigns/:campaignId - Get campaign',
        'PUT /api/campaigns/:campaignId - Update campaign',
        'DELETE /api/campaigns/:campaignId - Delete campaign',
        'POST /api/campaigns/:campaignId/ads - Create ad',
        'GET /api/campaigns/:campaignId/ads - List ads',
        'PUT /api/campaigns/ads/:adId - Update ad',
        'DELETE /api/campaigns/ads/:adId - Delete ad',
      ],
      content: [
        'GET /api/content/client/:clientId - List content assets',
        'POST /api/content - Create asset',
        'GET /api/content/:assetId - Get asset',
        'PUT /api/content/:assetId - Update asset',
        'DELETE /api/content/:assetId - Delete asset',
      ],
      scheduler: [
        'GET /api/scheduler/scheduled-ads/client/:clientId - List scheduled ads',
        'POST /api/scheduler/schedule-ad - Schedule ad posting',
        'POST /api/scheduler/cancel-scheduled-ad/:jobId - Cancel scheduled posting',
        'GET /api/scheduler/scheduled-ad/:jobId - Get job status',
        'GET /api/scheduler/metrics-sync/client/:clientId - List metrics sync jobs',
        'POST /api/scheduler/sync-metrics-now - Trigger metrics sync',
        'GET /api/scheduler/health - Queue health status',
        'GET /api/scheduler/stats/client/:clientId - Queue statistics',
      ],
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/scheduler', schedulerRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: Health check: http://localhost:${port}/health`);
  console.log(`[server]: API docs: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[server]: Shutting down gracefully...');
  
  // Close job queues
  await closeQueues();
  
  // Close database
  await prisma.$disconnect();
  
  // Close server
  server.close(() => {
    console.log('[server]: Server closed');
    process.exit(0);
  });
});

export default app;
