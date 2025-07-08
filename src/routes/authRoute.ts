import { Router } from 'express';

import {
  signup,
  login,
  confirmRegistration,
  forgotPassword,
  verifyForgotPasswordOtp,
  resendForgotPasswordOtp,
  resetPassword,
  refreshAccessToken,
  refreshToken,
} from '@/controllers/authController';
import { authRateLimiter } from '@/middlewares/rateLimiter';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  signupSchema,
  loginSchema,
  confirmRegistrationSchema,
  forgotPasswordSchema,
  verifyForgotPasswordOtpSchema,
  resendForgotPasswordOtpSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '@/schemas/authSchema';

const router = Router();

router.use(authRateLimiter);

router.post('/signup', validateRequest({ body: signupSchema }), signup);
router.post('/login', validateRequest({ body: loginSchema }), login);
router.post(
  '/confirm-registration',
  validateRequest({ body: confirmRegistrationSchema }),
  confirmRegistration
);
router.post('/forgot-password', validateRequest({ body: forgotPasswordSchema }), forgotPassword);
router.post(
  '/verify-forgot-password-otp',
  validateRequest({ body: verifyForgotPasswordOtpSchema }),
  verifyForgotPasswordOtp
);
router.post(
  '/resend-forgot-password-otp',
  validateRequest({ body: resendForgotPasswordOtpSchema }),
  resendForgotPasswordOtp
);
router.post('/reset-password', validateRequest({ body: resetPasswordSchema }), resetPassword);
router.post('/refresh-token', validateRequest({ body: refreshTokenSchema }), refreshToken);
router.post(
  '/refresh-access-token',
  validateRequest({ body: refreshTokenSchema }),
  refreshAccessToken
);

export default router;
