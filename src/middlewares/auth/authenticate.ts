// middleware to verify token, role and authenticate user
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from '../../configs/db.ts';
import { envConfig } from '../../configs/env.ts';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}

const { ACCESS_SECRET_KEY } = envConfig;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET_KEY) as { userId: number; role: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isActive: true },
      select: { id: true, role: true },
    });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid Token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
