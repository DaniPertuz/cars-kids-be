import { UserDatasource } from '../../../src/domain/datasources/user.datasource';
import { UserEntity } from '../../../src/domain/entities/user.entity';
import { IUserRole, UserQueryResult } from '../../../src/interfaces';

describe('User datasource', () => {
  class MockDatasource implements UserDatasource {
    getUsers(): Promise<UserQueryResult> {
      throw new Error('Method not implemented.');
    }
    updateUserName(email: string, name: string): Promise<UserEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateUserImage(email: string, img: string): Promise<UserEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateUserEmail(email: string, newEmail: string): Promise<UserEntity | null> {
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
    expect(typeof mockDatasource.updateUserName).toBe('function');
    expect(typeof mockDatasource.updateUserImage).toBe('function');
    expect(typeof mockDatasource.updateUserEmail).toBe('function');
    expect(typeof mockDatasource.updateUserPassword).toBe('function');
    expect(typeof mockDatasource.updateUserRole).toBe('function');
    expect(typeof mockDatasource.deactivateUser).toBe('function');
  });
});
