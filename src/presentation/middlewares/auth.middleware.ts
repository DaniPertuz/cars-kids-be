import { CustomError } from '../../domain/errors';
import { JwtAdapter } from '../../plugins';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserModel } from '../../database/models';

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');

    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<{ email: string; }>(token);

      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await UserModel.findOne({ email: payload.email });

      if (!user) return res.json(401).json({ error: 'Invalid token - user' });

      req.body.user = UserEntity.fromObject(user);

      next();
    } catch (error) {
      CustomError.serverError(`Internal server error: ${error}`);
    }
  }
}
