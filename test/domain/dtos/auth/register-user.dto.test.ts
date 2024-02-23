import { RegisterUserDTO } from '../../../../src/domain/dtos/auth/register-user.dto';
import { IStatus, IUserRole } from '../../../../src/interfaces';

describe('RegisterUserDTO', () => {
  test('should return an error if email is missing', () => {
    const [error, registerUserDTO] = RegisterUserDTO.create({
      name: 'Test User',
      email: '',
      password: 'password',
      role: IUserRole.Editor,
      status: IStatus.Active
    });
    expect(error).toBe('Email es requerido');
    expect(registerUserDTO).toBeUndefined();
  });

  test('should return an error if name is missing', () => {
    const [error, registerUserDTO] = RegisterUserDTO.create({
      name: '',
      email: 'test@test.com',
      password: 'password',
      role: IUserRole.Editor,
      status: IStatus.Active
    });
    expect(error).toBe('Nombre es requerido');
    expect(registerUserDTO).toBeUndefined();
  });

  test('should return an error if password is missing', () => {
    const [error, registerUserDTO] = RegisterUserDTO.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '',
      role: IUserRole.Editor,
      status: IStatus.Active
    });
    expect(error).toBe('Contraseña es requerida');
    expect(registerUserDTO).toBeUndefined();
  });

  test('should return an email is not valid', () => {
    const [error, registerUserDTO] = RegisterUserDTO.create({
      name: 'Test Name',
      email: 'invalid email',
      password: 'password',
      role: IUserRole.Editor,
      status: IStatus.Active
    });
    expect(error).toBe('Email no es válido');
    expect(registerUserDTO).toBeUndefined();
  });

  test('should return an error if role is missing', () => {
    const [error, registerUserDTO] = RegisterUserDTO.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password',
      role: '' as IUserRole,
      status: IStatus.Active
    });

    expect(error).toBe('Rol es requerido');
    expect(registerUserDTO).toBeUndefined();
  });

  test('should create RegisterUserDTO if all fields are provided', () => {
    const [error, registerUserDTO] = RegisterUserDTO.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password',
      role: IUserRole.Editor,
      status: IStatus.Active
    });
    expect(error).toBeUndefined();
    expect(registerUserDTO).toBeInstanceOf(RegisterUserDTO);
    expect(registerUserDTO?.params).toEqual({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password',
      role: IUserRole.Editor,
      status: IStatus.Active
    });
  });
});
