import { UserDatasource } from '../../../src/domain/datasources/user.datasource';
import { UserEntity } from '../../../src/domain/entities/user.entity';
import { IUserRole, UserQueryResult } from '../../../src/interfaces';

describe('User datasource', () => {
  class MockDatasource implements UserDatasource {
    getUsers(): Promise<UserQueryResult> {
      throw new Error('Method not implemented.');
    }
    updateUserPassword(email: string, password: string): Promise<UserEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null> {
      throw new Error('Method not implemented.');
    }
    deactivateUser(email: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  test('should test the abstract User class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.getUsers).toBe('function');
    expect(typeof mockDatasource.updateUserPassword).toBe('function');
    expect(typeof mockDatasource.updateUserRole).toBe('function');
    expect(typeof mockDatasource.deactivateUser).toBe('function');
  });
});
