import { IStatus, IUser, IUserRole } from '../../../../src/interfaces';
import { UserDTO } from '../../../../src/domain/dtos/user/index';

describe('UserDTO', () => {
  const validObject: IUser = {
    name: 'Test User',
    email: 'test-user-1@email.com',
    password: '123',
    role: IUserRole.Editor,
    status: IStatus.Active
  };

  describe('create', () => {
    test('should return error when name field is missing', () => {
      const invalidObject = {
        email: 'test-user-1@email.com',
        password: '123',
        role: IUserRole.Editor,
        status: IStatus.Active
      };
      const [error, userDTO] = UserDTO.create(invalidObject);

      expect(error).toBe('Nombre es requerido');
      expect(userDTO).toBeUndefined();
    });

    test('should return error when email field is missing', () => {
      const invalidObject = {
        name: 'Test User',
        password: '123',
        role: IUserRole.Editor,
        status: IStatus.Active
      };
      const [error, userDTO] = UserDTO.create(invalidObject);

      expect(error).toBe('Email es requerido');
      expect(userDTO).toBeUndefined();
    });

    test('should return error when password field is missing', () => {
      const invalidObject = {
        name: 'Test User',
        email: 'test-user-1@email.com',
        role: IUserRole.Editor,
        status: IStatus.Active
      };
      const [error, userDTO] = UserDTO.create(invalidObject);

      expect(error).toBe('Contraseña es requerida');
      expect(userDTO).toBeUndefined();
    });

    test('should return error when role field is missing', () => {
      const invalidObject = {
        name: 'Test User',
        email: 'test-user-1@email.com',
        password: '123',
        status: IStatus.Active
      };
      const [error, userDTO] = UserDTO.create(invalidObject);

      expect(error).toBe('Rol es requerido');
      expect(userDTO).toBeUndefined();
    });

    test('should return error when status field is missing', () => {
      const invalidObject = {
        name: 'Test User',
        email: 'test-user-1@email.com',
        password: '123',
        role: IUserRole.Editor
      };
      const [error, userDTO] = UserDTO.create(invalidObject);

      expect(error).toBe('Estado es requerido');
      expect(userDTO).toBeUndefined();
    });

    test('should return an error if email is invalid', () => {
      const invalidObject = {
        name: 'Test User',
        email: 'invalid-email',
        password: '123',
        role: IUserRole.Editor,
        status: IStatus.Active
      };

      const [error, userDTO] = UserDTO.create(invalidObject);

      expect(error).toBe('Email no es válido');
      expect(userDTO).toBeUndefined();
    });

    test('should return UserDTO instance when object is valid', () => {
      const [error, userDTO] = UserDTO.create(validObject);

      expect(error).toBeUndefined();
      expect(userDTO).toBeInstanceOf(UserDTO);
    });
  });
});
