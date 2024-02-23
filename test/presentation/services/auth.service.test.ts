import { UserModel } from '../../../src/database/models';
import { LoginUserDTO } from '../../../src/domain/dtos/auth/login-user.dto';
import { RegisterUserDTO } from '../../../src/domain/dtos/auth/register-user.dto';
import { CustomError } from '../../../src/domain/errors';
import { IStatus, IUserRole } from '../../../src/interfaces';
import { JwtAdapter, bcryptAdapter } from '../../../src/plugins';
import { AuthService } from '../../../src/presentation/services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should register a new user', async () => {
      UserModel.findOne = jest.fn().mockResolvedValue(null);

      UserModel.prototype.save = jest.fn().mockResolvedValueOnce({
        name: 'Test Register User',
        email: 'testuser@test.com',
        password: 'hashedPassword',
        role: IUserRole.Editor,
        status: IStatus.Active
      });

      JwtAdapter.generateJWT = jest.fn().mockResolvedValue('generatedToken');

      const registerUserDTO: RegisterUserDTO = {
        params: {
          name: 'Test Register User',
          email: 'testuser@test.com',
          password: 'password',
          role: IUserRole.Editor,
          status: IStatus.Active
        }
      };

      const result = await authService.registerUser(registerUserDTO);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'testuser@test.com' });
      expect(UserModel.prototype.save).toHaveBeenCalled();
      expect(JwtAdapter.generateJWT).toHaveBeenCalledWith({ email: 'testuser@test.com' });
      expect(result).toEqual({
        user: {
          email: 'testuser@test.com',
          name: 'Test Register User',
          role: IUserRole.Editor,
          status: IStatus.Active
        },
        token: 'generatedToken'
      });
    });

    test('should register a new user and return user information and token', async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      bcryptAdapter.hash = jest.fn().mockReturnValueOnce('hashedPassword');

      JwtAdapter.generateJWT = jest.fn().mockResolvedValueOnce('generatedToken');

      UserModel.prototype.save = jest.fn().mockResolvedValueOnce({
        name: 'Test Register User',
        email: 'testuser@test.com',
        password: 'password',
        role: IUserRole.Editor,
        status: IStatus.Active
      });

      const result = await authService.registerUser({
        params: {
          name: 'Test Register User',
          email: 'testuser@test.com',
          password: 'testPassword',
          role: IUserRole.Editor,
          status: IStatus.Active
        }
      });

      expect(result).toEqual({
        user: {
          name: 'Test Register User',
          email: 'testuser@test.com',
          role: IUserRole.Editor,
          status: IStatus.Active
        },
        token: 'generatedToken'
      });
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'testuser@test.com' });
      expect(bcryptAdapter.hash).toHaveBeenCalledWith('testPassword');
      expect(JwtAdapter.generateJWT).toHaveBeenCalledWith({ email: 'testuser@test.com' });
      expect(UserModel.prototype.save).toHaveBeenCalled();
    });

    test('should throw an error if the email already exists', async () => {
      UserModel.findOne = jest.fn().mockResolvedValue({
        name: 'Test Register User',
        email: 'testuser@test.com',
        password: 'password',
        role: IUserRole.Editor,
        status: IStatus.Active
      });

      const registerUserDTO: RegisterUserDTO = {
        params: {
          name: 'Test Register User',
          email: 'testuser@test.com',
          password: 'password',
          role: IUserRole.Editor,
          status: IStatus.Active
        }
      };

      await expect(authService.registerUser(registerUserDTO)).rejects.toThrow(CustomError.serverError('Error: Email ya existe'));
    });

    test('should throw an error to generate JWT on register', async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      (JwtAdapter.generateJWT as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.registerUser({
        params: {
          name: 'Test Register User',
          email: 'testuser@test.com',
          password: await bcryptAdapter.hash('password'),
          role: IUserRole.Editor,
          status: IStatus.Active
        }
      })).rejects.toThrow(CustomError.badRequest('Error: Error al generar JWT'));
      expect(JwtAdapter.generateJWT).toHaveBeenCalledWith({ email: 'testuser@test.com' });
    });
  });

  describe('login', () => {
    test('should login a user with correct email and password', async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce({
        name: 'Test Register User',
        email: 'testuser@test.com',
        password: await bcryptAdapter.hash('password'),
        role: IUserRole.Editor,
        status: IStatus.Active
      });

      bcryptAdapter.compare = jest.fn().mockResolvedValueOnce(true);

      JwtAdapter.generateJWT = jest.fn().mockResolvedValueOnce('generatedToken');

      const loginUserDTO: LoginUserDTO = {
        email: 'testuser@test.com',
        password: 'password'
      };

      const result = await authService.login(loginUserDTO);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'testuser@test.com' });
      expect(JwtAdapter.generateJWT).toHaveBeenCalledWith({ email: 'testuser@test.com' });
      expect(result).toEqual({
        user: {
          name: 'Test Register User',
          email: 'testuser@test.com',
          role: IUserRole.Editor,
          status: IStatus.Active
        },
        token: 'generatedToken'
      });
    });

    test('should throw an error if the email does not exist', async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      const loginUserDTO: LoginUserDTO = {
        email: 'nonexistent@test.com',
        password: 'password'
      };

      await expect(authService.login(loginUserDTO)).rejects.toThrow(CustomError.badRequest('Email no existe'));
    });

    test('should throw an error if the password is incorrect', async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce({
        email: 'testuser@test.com',
        password: await bcryptAdapter.hash('password'),
      });

      const loginUserDTO: LoginUserDTO = {
        email: 'testuser@test.com',
        password: 'wrongPassword'
      };

      await expect(authService.login(loginUserDTO)).rejects.toThrow(CustomError.badRequest('Contraseña incorrecta'));
    });
  });

  describe('validateUser', () => {
    test('should return true if the token is valid and the user exists', async () => {
      JwtAdapter.validateToken = jest.fn().mockResolvedValueOnce({ email: 'test@test.com' });
      UserModel.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@test.com' });

      const result = await authService.validateUser('validToken');

      expect(JwtAdapter.validateToken).toHaveBeenCalledWith('validToken');
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(result).toBe(true);
    });

    test('should throw an error if the token is invalid', async () => {
      JwtAdapter.validateToken = jest.fn().mockResolvedValueOnce(null);

      await expect(authService.validateUser('invalidToken')).rejects.toThrow(CustomError.unauthorized('Token inválido'));
    });

    test('should throw an error if the token does not contain an email', async () => {
      JwtAdapter.validateToken = jest.fn().mockResolvedValueOnce({});

      await expect(authService.validateUser('invalidToken')).rejects.toThrow(CustomError.unauthorized('No hay email en token'));
    });

    test('should throw an error if the user does not exist', async () => {
      JwtAdapter.validateToken = jest.fn().mockResolvedValueOnce({ email: 'test@test.com' });

      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(authService.validateUser('validToken')).rejects.toThrow(CustomError.unauthorized('Email no existe'));
    });
  });
});
