import { UserEntity } from '../../../src/domain/entities/user.entity';
import { IStatus, IUserRole } from '../../../src/interfaces';

describe('User entity', () => {
  const data = {
    email: 'test@test.com',
    password: '123456',
    name: 'Test Name',
    role: IUserRole.Editor,
    status: IStatus.Active
  };

  test('should create a UserEntity instance', () => {
    const user = new UserEntity(data);

    expect(user).toBeInstanceOf(UserEntity);
    expect(user.params.email).toBe(data.email);
    expect(user.params.password).toBe(data.password);
    expect(user.params.name).toBe(data.name);
    expect(user.params.role).toBe(data.role);
    expect(user.params.status).toBe(data.status);
  });

  test('should create a UserEntity from object', () => {
    const user = UserEntity.fromObject(data);
    
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.params.email).toBe('test@test.com');
    expect(user.params.password).toBe('123456');
    expect(user.params.name).toBe('Test Name');
    expect(user.params.role).toBe(IUserRole.Editor);
    expect(user.params.status).toBe(IStatus.Active);
  });
});
