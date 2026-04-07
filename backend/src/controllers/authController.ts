import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/authService';
import { env } from '../config/env';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, name, password, roles } = req.body;
    const result = await authService.registerUser(email, name, password, roles);
    res.status(201).json({ success: true, message: 'User registered successfully', data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshAccessToken(token);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const user = await authService.getProfile(authReq.user!.userId);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const user = await authService.updateProfile(authReq.user!.userId, req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function googleCallback(req: Request, res: Response): Promise<void> {
  const user = (req as AuthRequest).user as unknown as { accessToken: string; refreshToken: string };
  if (!user) {
    res.redirect(`${env.CLIENT_URL}/auth/error`);
    return;
  }
  res.redirect(
    `${env.CLIENT_URL}/auth/callback?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`
  );
}
