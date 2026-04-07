import { Request, Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const hasRole = authReq.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Required roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }
    next();
  };
}
