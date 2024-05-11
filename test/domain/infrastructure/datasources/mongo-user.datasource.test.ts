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
    const mockUser1 = { name: 'Admin 1', img: 'Admin 1 image', email: 'admin-test@test.com', password: 'pass-admin', role: IUserRole.Admin, status: IStatus.Active };
    const mockUser2 = { name: 'Test 1', img: 'Test 1 image', email: 'testing1@test.com', password: 'pass-test1', role: IUserRole.Editor, status: IStatus.Active };
    const mockUser3 = { name: 'Test 2', img: 'Test 2 image', email: 'testing2@test.com', password: 'pass-test2', role: IUserRole.Editor, status: IStatus.Active };

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
      img: 'New Image',
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
      img: 'New Image',
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
      img: 'New Image',
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
      img: 'New Image',
      email: 'testing5@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserPassword('testing5@test.com', 'test-pass1');

    expect(updatedUser?.params).toEqual(expect.objectContaining({
      name: 'Updated User',
      img: 'New Image',
      email: 'testing5@test.com',
      role: IUserRole.Editor,
      status: IStatus.Active
    }));

    await UserModel.findOneAndDelete({ email: 'testing5@test.com' });
  });

  test('should update user name', async () => {
    const updatedUserData = {
      name: 'Updated User',
      img: 'New Image',
      email: 'testing5@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserName('testing5@test.com', 'New Update');

    expect(updatedUser?.params).toEqual(expect.objectContaining({
      name: 'New Update',
      img: 'New Image',
      email: 'testing5@test.com',
      role: IUserRole.Editor,
      status: IStatus.Active
    }));

    await UserModel.findOneAndDelete({ email: 'testing5@test.com' });
  });

  test('should throw a server error if the update name fails', async () => {
    const mockUserData = {
      email: 'test@test.com',
      name: 'Test User'
    };

    const errorMessage = 'Database error';

    jest.spyOn(UserModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error(errorMessage));

    await expect(userDatasource.updateUserName(mockUserData.email, mockUserData.name)).rejects.toThrow('Error al actualizar nombre de usuario: Error: Database error');
  });

  test('should update user image', async () => {
    const updatedUserData = {
      name: 'Updated User',
      img: 'Updated image',
      email: 'testing55@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserImage('testing55@test.com', 'New Image');

    expect(updatedUser?.params).toEqual(expect.objectContaining({
      name: 'Updated User',
      img: 'New Image',
      email: 'testing55@test.com',
      role: IUserRole.Editor,
      status: IStatus.Active
    }));

    await UserModel.findOneAndDelete({ email: 'testing55@test.com' });
  });

  test('should throw a server error if the update image fails', async () => {
    const mockUserData = {
      email: 'test@test.com'
    };

    const errorMessage = 'Database error';

    jest.spyOn(UserModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error(errorMessage));

    await expect(userDatasource.updateUserImage(mockUserData.email, 'Test image.jpg')).rejects.toThrow('Error al actualizar imagen de usuario: Error: Database error');
  });

  test('should update user status', async () => {
    const updatedUserData = {
      name: 'Updated User',
      img: 'Updated image',
      email: 'testing55@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Inactive
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserStatus('testing55@test.com', IStatus.Active);

    expect(updatedUser?.params).toEqual(expect.objectContaining({
      name: 'Updated User',
      img: 'Updated image',
      email: 'testing55@test.com',
      role: IUserRole.Editor,
      status: IStatus.Active
    }));

    await UserModel.findOneAndDelete({ email: 'testing55@test.com' });
  });

  test('should throw a server error if the update image fails', async () => {
    const mockUserData = {
      email: 'test@test.com'
    };

    const errorMessage = 'Database error';

    jest.spyOn(UserModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error(errorMessage));

    await expect(userDatasource.updateUserStatus(mockUserData.email, IStatus.Active)).rejects.toThrow('Error al actualizar estado de usuario: Error: Database error');
  });

  test('should update user email', async () => {
    const updatedUserData = {
      name: 'Updated User',
      img: 'New Image',
      email: 'testing5@test.com',
      password: 'test-pass',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    await UserModel.create(updatedUserData);

    const updatedUser = await userDatasource.updateUserEmail('testing5@test.com', 'testing51@test.com');

    expect(updatedUser?.params).toEqual(expect.objectContaining({
      name: 'Updated User',
      img: 'New Image',
      email: 'testing51@test.com',
      role: IUserRole.Editor,
      status: IStatus.Active
    }));

    await UserModel.findOneAndDelete({ email: 'testing51@test.com' });
  });

  test('should throw a server error if the update email fails', async () => {
    const mockUserData = {
      email: 'test@test.com'
    };

    const errorMessage = 'Database error';

    jest.spyOn(UserModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error(errorMessage));

    await expect(userDatasource.updateUserEmail(mockUserData.email, 'new-email@test.com')).rejects.toThrow('Error al actualizar email de usuario: Error: Database error');
  });

  test('should throw server error when an error occurs during update', async () => {
    const updatedUserData = {
      name: 'Updated User Error',
      img: 'New Image',
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
