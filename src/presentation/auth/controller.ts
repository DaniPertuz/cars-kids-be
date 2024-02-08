import { Request, Response } from 'express';
import { RegisterUserDTO } from '../../domain/dtos/auth/register-user.dto';
import { CustomError } from '../../domain/errors';
import { AuthService } from '../services/auth.service';
import { LoginUserDTO } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {

  constructor(
    public readonly service: AuthService
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  };

  registerUser = async (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    this.service.registerUser(registerDto!)
      .then(user => res.json(user))
      .catch(error => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    this.service.login(loginDto!)
      .then(user => res.json(user))
      .catch(error => this.handleError(error, res));
  };
}
