import { connect, disconnect } from '../../../../src/database';
import { UserModel } from '../../../../src/database/models';
import { MongoUserDatasource } from '../../../../src/infrastructure/datasources/mongo-user.datasource';
import { IStatus, IUserRole } from '../../../../src/interfaces';

jest.mock('../../../../src/database/models', () => ({
  UserModel: {
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
  }
}));

describe('Mongo User datasource', () => {
  let userDatasource: MongoUserDatasource;

  beforeEach(() => {
    userDatasource = new MongoUserDatasource();
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should get users', async () => {
    const mockUsers = [
      { name: 'Daniel', email: 'test@test.com', role: IUserRole.Editor, status: IStatus.Active }
    ];

    const findMock = jest.fn().mockResolvedValueOnce(mockUsers);

    (UserModel.find as jest.Mock).mockReturnValue({ select: findMock });

    const users = await userDatasource.getUsers();

    expect(users).toHaveLength(mockUsers.length);
    expect(users[0].params.name).toBe(mockUsers[0].name);
  });

  test('should update user role', async () => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'test@test.com',
      role: IUserRole.Admin,
      status: IStatus.Active
    };

    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(updatedUserData);

    const updatedUser = await userDatasource.updateUserRole('test@test.com', IUserRole.Admin);

    expect(updatedUser?.params.role).toBe(IUserRole.Admin);
  });

  test('should return null when user is not found', async () => {
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    const updatedUser = await userDatasource.updateUserRole('nonexistent@example.com', IUserRole.Admin);

    expect(updatedUser).toBeNull();
});

  test('should deactivate user', async () => {
    await userDatasource.deactivateUser('user@example.com');

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'user@example.com' },
      { status: 'inactive' },
      { new: true }
    );
  });
});
