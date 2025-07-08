import { z, type AnyZodObject } from 'zod';

export const signupSchema: AnyZodObject = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'EMPLOYEE']).default('EMPLOYEE'),
});

export const confirmRegistrationSchema: AnyZodObject = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const resendRegistrationOtpSchema: AnyZodObject = z.object({
  email: z.string().email('Invalid email address'),
});

export const loginSchema: AnyZodObject = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema: AnyZodObject = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyForgotPasswordOtpSchema: AnyZodObject = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const resendForgotPasswordOtpSchema: AnyZodObject = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema: AnyZodObject = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const refreshTokenSchema: AnyZodObject = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
