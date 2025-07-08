import jwt from 'jsonwebtoken';

import { envConfig } from '@/configs/env';

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = envConfig;
export interface AccessTokenPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '3h' });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '15d' });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET_KEY) as AccessTokenPayload;
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Access token has expired');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid access token', error as Error);
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY) as RefreshTokenPayload;
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Refresh token has expired');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token', error as Error);
  }
};
