import { doubleCsrf } from 'csrf-csrf';

const csrfConfig = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET as string,
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => {
    const token =
      (req.headers['x-csrf-token'] as string) ||
      ((req.body as Record<string, unknown>)?._csrf as string);
    return token;
  },
});

export const { generateToken, doubleCsrfProtection } = csrfConfig;
