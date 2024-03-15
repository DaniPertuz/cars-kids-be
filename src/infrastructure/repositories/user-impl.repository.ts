import { UserDatasource } from '../../domain/datasources/user.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repository/user.repository';
import { IUserRole, UserQueryResult } from '../../interfaces';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDatasource: UserDatasource) { }

  getUsers(paginationDto: PaginationDto): Promise<UserQueryResult> {
    return this.userDatasource.getUsers(paginationDto);
  }

  updateUserPassword(email: string, password: string): Promise<UserEntity | null> {
    return this.userDatasource.updateUserPassword(email, password);
  }

  updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null> {
    return this.userDatasource.updateUserRole(email, role);
  }

  deactivateUser(email: string): Promise<void> {
    return this.userDatasource.deactivateUser(email);
  }
}
