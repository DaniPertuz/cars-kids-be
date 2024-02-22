import { IUserRole, UserQueryResult } from '../../interfaces';
import { PaginationDto } from '../dtos/shared/pagination.dto';
import { UserEntity } from '../entities/user.entity';

export abstract class UserDatasource {
  // Admin actions
  abstract getUsers(paginationDto: PaginationDto): Promise<UserQueryResult>;
  abstract updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null>;
  abstract deactivateUser(email: string): Promise<void>;
}
