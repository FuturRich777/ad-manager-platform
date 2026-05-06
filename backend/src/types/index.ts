import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'ACCOUNT_MANAGER' | 'VIEWER';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CampaignCreateInput {
  name: string;
  description?: string;
  objective: string;
  budget: number;
  dailyBudget?: number;
  startDate: Date;
  endDate?: Date;
  targetAudience?: Record<string, any>;
}

export interface AdCreateInput {
  campaignId: string;
  platform: 'FACEBOOK' | 'GOOGLE' | 'LINKEDIN';
  title: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  ctaText?: string;
}
