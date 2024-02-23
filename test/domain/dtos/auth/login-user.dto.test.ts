import { LoginUserDTO } from '../../../../src/domain/dtos/auth/login-user.dto';

describe('LoginUserDTO', () => {
  test('should return an error if email is missing', () => {
    const [error, loginUserDTO] = LoginUserDTO.create({ password: 'password' });
    expect(error).toBe('Email es requerido');
    expect(loginUserDTO).toBeUndefined();
  });

  test('should return an error if email is invalid', () => {
    const [error, loginUserDTO] = LoginUserDTO.create({ email: 'invalid-email', password: 'password' });
    expect(error).toBe('Email no es válido');
    expect(loginUserDTO).toBeUndefined();
  });

  test('should return an error if password is missing', () => {
    const [error, loginUserDTO] = LoginUserDTO.create({ email: 'test@example.com' });
    expect(error).toBe('Contraseña es requerida');
    expect(loginUserDTO).toBeUndefined();
  });

  test('should create a LoginUserDTO instance if inputs are valid', () => {
    const [error, loginUserDTO] = LoginUserDTO.create({ email: 'test@example.com', password: 'password' });
    expect(error).toBeUndefined();
    expect(loginUserDTO).toBeInstanceOf(LoginUserDTO);
    expect(loginUserDTO?.email).toBe('test@example.com');
    expect(loginUserDTO?.password).toBe('password');
  });
});
