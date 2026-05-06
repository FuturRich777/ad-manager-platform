import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): AuthPayload | null {
  try {
    return jwt.decode(token) as AuthPayload;
  } catch (error) {
    return null;
  }
}
