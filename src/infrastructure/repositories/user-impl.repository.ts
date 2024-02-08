import { UserDatasource } from '../../domain/datasources/user.datasource';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repository/user.repository';
import { IUserRole } from '../../interfaces';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDatasource: UserDatasource) { }

  getUsers(): Promise<UserEntity[]> {
    return this.userDatasource.getUsers();
  }

  updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null> {
    return this.userDatasource.updateUserRole(email, role);
  }

  deactivateUser(email: string): Promise<void> {
    return this.userDatasource.deactivateUser(email);
  }
}
