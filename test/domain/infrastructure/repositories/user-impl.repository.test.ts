import { IUserRole } from '../../../../src/interfaces';
import { UserDatasource } from '../../../../src/domain/datasources/user.datasource';
import { UserRepositoryImpl } from '../../../../src/infrastructure/repositories/user-impl.repository';

type MockUserDatasource = UserDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('User repository implementation', () => {
  const mockUserDatasource: MockUserDatasource = {
    getUsers: jest.fn(),
    updateUserPassword: jest.fn(),
    updateUserRole: jest.fn(),
    deactivateUser: jest.fn()
  };

  const userRepositoryImpl = new UserRepositoryImpl(mockUserDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'getUsers', args: [], },
    { method: 'updateUserPassword', args: ['test@test.com', 'test-pass1'] },
    { method: 'updateUserRole', args: ['test@test.com', IUserRole.Editor] },
    { method: 'deactivateUser', args: ['test@test.com'] }
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (userRepositoryImpl as any)[method](...args);
      expect(mockUserDatasource[method]).toHaveBeenCalled();
    });
  });
});
