import { connect, disconnect } from '../../../../src/database';
import { UserModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
import { MongoUserDatasource } from '../../../../src/infrastructure/datasources/mongo-user.datasource';
import { IStatus, IUserRole } from '../../../../src/interfaces';

describe('Mongo User datasource', () => {
  let userDatasource: MongoUserDatasource;

  beforeEach(() => {
    userDatasource = new MongoUserDatasource();
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await UserModel.deleteMany();
    await disconnect();
  });

  test('should get users', async () => {
    const mockUser1 = { name: 'Admin 1', email: 'admin-test@test.com', password: 'pass-admin', role: IUserRole.Admin, status: IStatus.Active };
    const mockUser2 = { name: 'Test 1', email: 'testing1@test.com', password: 'pass-test1', role: IUserRole.Editor, status: IStatus.Active };
    const mockUser3 = { name: 'Test 2', email: 'testing2@test.com', password: 'pass-test2', role: IUserRole.Editor, status: IStatus.Active };

    await UserModel.create(mockUser1);
    await UserModel.create(mockUser2);
    await UserModel.create(mockUser3);

    const [error1, paginationDto1] = PaginationDto.create(1, 1);
    const pagination1 = await userDatasource.getUsers(paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.users.length).toBe(1);
    expect(pagination1.users[0].params.name).toBe(mockUser2.name);
    expect(pagination1.prev).toBeNull();
    expect(pagination1.next).toBe(`/users?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);

    const [error2, paginationDto2] = PaginationDto.create(2, 1);
    const pagination2 = await userDatasource.getUsers(paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.users.length).toBe(1);
    expect(pagination2.users[0].params.name).toBe(mockUser3.name);
    expect(pagination2.prev).toBe(`/users?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    const [error3, paginationDto3] = PaginationDto.create(3, 1);
    const pagination3 = await userDatasource.getUsers(paginationDto3!);

    expect(error3).toBeUndefined();
    expect(pagination3.next).toBeNull();

    await UserModel.findOneAndDelete({ email: 'admin-test@test.com' });
    await UserModel.findOneAndDelete({ email: 'testing1@test.com' });
    await UserModel.findOneAndDelete({ email: 'testing2@test.com' });
  });

  test('should throw server error when getting users', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    const updatedUserData = {
      name: 'User 4',
      email: 'testing4@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    jest.spyOn(UserModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(userDatasource.getUsers(paginationDto!)).rejects.toThrow('Error al obtener usuarios: Error: Test error');

    await UserModel.findOneAndDelete({ email: 'testing4@test.com' });
  });

  test('should update user role', async () => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'testing5@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserRole('testing5@test.com', IUserRole.Admin);

    expect(updatedUser?.params.role).toBe(IUserRole.Admin);

    await UserModel.findOneAndDelete({ email: 'testing5@test.com' });
  });

  test('should throw server error when an error occurs during update', async () => {
    const updatedUserData = {
      name: 'Updated User Error',
      email: 'testing6@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(userDatasource.updateUserRole('testing6@test.com', IUserRole.Admin)).rejects.toThrow('Error al actualizar rol de usuario: Error: Test error');

    await UserModel.findOneAndDelete({ email: 'testing6@test.com' });
  });

  test('should return null when user is not found', async () => {
    const updatedUser = await userDatasource.updateUserRole('nonexistent@example.com', IUserRole.Admin);

    expect(updatedUser).toBeNull();
  });

  test('should update user password', async () => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'testing5@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserPassword('testing5@test.com', 'test-pass1');

    expect(updatedUser?.params).toEqual(expect.objectContaining({
      name: 'Updated User',
      email: 'testing5@test.com',
      role: IUserRole.Editor,
      status: IStatus.Active
    }));

    await UserModel.findOneAndDelete({ email: 'testing5@test.com' });
  });

  test('should throw server error when an error occurs during update', async () => {
    const updatedUserData = {
      name: 'Updated User Error',
      email: 'testing6@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(userDatasource.updateUserPassword('testing6@test.com', 'test-pass1')).rejects.toThrow('Error al actualizar contraseña de usuario: Error: Test error');

    await UserModel.findOneAndDelete({ email: 'testing6@test.com' });
  });

  test('should return null when user is not found', async () => {
    const updatedUser = await userDatasource.updateUserPassword('nonexistent@example.com', 'test-pass1');

    expect(updatedUser).toBeNull();
  });

  test('should deactivate user', async () => {
    const mockFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(userDatasource.deactivateUser('user@example.com')).rejects.toThrow('Error al eliminar usuario: Error: Test error');

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { email: 'user@example.com' },
      { status: 'inactive' },
      { new: true }
    );
  });
});
