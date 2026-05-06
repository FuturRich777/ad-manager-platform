import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

interface CreateClientBody {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
}

// Get all clients for the current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const userClients = await prisma.userClient.findMany({
      where: { userId: req.user.userId },
      include: { client: true },
    });

    const clients = userClients.map((uc) => uc.client);
    res.json({ success: true, data: clients });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch clients' });
  }
});

// Create a new client
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const { name, email, phone, website } = req.body as CreateClientBody;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Client name is required' });
    }

    const client = await prisma.client.create({
      data: { name, email, phone, website },
    });

    // Add the user as owner of the client
    await prisma.userClient.create({
      data: {
        userId: req.user.userId,
        clientId: client.id,
        role: 'OWNER',
      },
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ success: false, error: 'Failed to create client' });
  }
});

// Get a specific client
router.get('/:clientId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const { clientId } = req.params;

    // Verify user has access to this client
    const userClient = await prisma.userClient.findUnique({
      where: {
        userId_clientId: {
          userId: req.user.userId,
          clientId,
        },
      },
    });

    if (!userClient) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch client' });
  }
});

// Update a client
router.put('/:clientId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const { clientId } = req.params;
    const { name, email, phone, website } = req.body as CreateClientBody;

    // Verify user has access to this client
    const userClient = await prisma.userClient.findUnique({
      where: {
        userId_clientId: {
          userId: req.user.userId,
          clientId,
        },
      },
    });

    if (!userClient) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const client = await prisma.client.update({
      where: { id: clientId },
      data: { name, email, phone, website },
    });

    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ success: false, error: 'Failed to update client' });
  }
});

// Delete a client
router.delete('/:clientId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const { clientId } = req.params;

    // Verify user is owner of this client
    const userClient = await prisma.userClient.findUnique({
      where: {
        userId_clientId: {
          userId: req.user.userId,
          clientId,
        },
      },
    });

    if (!userClient || userClient.role !== 'OWNER') {
      return res.status(403).json({ success: false, error: 'Only owners can delete clients' });
    }

    await prisma.client.delete({ where: { id: clientId } });
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete client' });
  }
});

export default router;
