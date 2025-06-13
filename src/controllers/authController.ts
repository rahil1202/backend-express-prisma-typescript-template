import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { prisma } from '../configs/db.ts';
import {
  sendRegistrationOtpEmail,
  sendRegistrationSuccessEmail,
  sendResetPasswordOtpEmail,
  sendResetPasswordSuccessEmail,
} from '../services/emailService.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.ts';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phoneNumber, password, role, storeId } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      res.status(409).json({ message: 'User already exists with provided email or phone' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpiresAt,
        otpVerified: false,
        isActive: false,
        role: role || 'EMPLOYEE',
        storeId: storeId || undefined,
      },
    });

    await sendRegistrationOtpEmail(email, name, otp);

    res.status(201).json({
      message: 'User registered. OTP sent to email.',
      userId: user.id,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    return;
  }
};

export const confirmRegistration = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.otpVerified) {
      res.status(400).json({ message: 'Account already verified' });
      return;
    }

    if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      res.status(400).json({ message: 'OTP expired or invalid' });
      return;
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    await sendRegistrationSuccessEmail(user.email, user.name);

    await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiresAt: null,
        otpVerified: true,
        isActive: true,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { identifier, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phoneNumber: identifier }],
      },
    });

    if (!user || !user.password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isActive = user.isActive;
    if (!isActive) {
      res.status(401).json({ message: 'User has been added as inactive' });
      return;
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLogin: new Date(),
      },
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    return;
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        otp: hashedOtp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    await sendResetPasswordOtpEmail(email, user.name, otp);

    res.status(200).json({ message: 'OTP sent to email for password reset' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    return;
  }
};

export const verifyForgotPasswordOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
    res.status(400).json({ message: 'OTP expired or invalid' });
    return;
  }

  const isOtpValid = await bcrypt.compare(otp, user.otp);
  if (!isOtpValid) {
    res.status(400).json({ message: 'Invalid OTP' });
    return;
  }

  res.status(200).json({ message: 'OTP verified successfully' });
};

export const resendForgotPasswordOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await prisma.user.update({
    where: { email },
    data: {
      otp: hashedOtp,
      otpExpiresAt: otpExpiresAt,
    },
  });

  await sendResetPasswordOtpEmail(email, user.name, otp);

  res.status(200).json({ message: 'New OTP sent to email' });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
    res.status(400).json({ message: 'OTP expired or invalid' });
    return;
  }

  const isOtpValid = await bcrypt.compare(otp, user.otp);
  if (!isOtpValid) {
    res.status(400).json({ message: 'Invalid OTP' });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
    },
  });

  await sendResetPasswordSuccessEmail(email, user.name);

  res.status(200).json({ message: 'Password reset successfully' });
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.userId !== user.id) {
      res.status(401).json({ message: 'Invalid refresh token', error: 'User ID mismatch' });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token', error: (error as Error).message });
    return;
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });

  res.status(200).json({
    message: 'Access token refreshed',
    accessToken,
  });
};

export const refreshToken = refreshAccessToken;

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });
  res.status(200).json({ message: 'Logged out successfully' });
  return;
};
