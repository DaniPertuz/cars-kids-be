import { IStatus, IUserRole, UserQueryResult } from '../../interfaces';
import { PaginationDto } from '../dtos/shared/pagination.dto';
import { UserEntity } from '../entities/user.entity';

export abstract class UserDatasource {
  abstract updateUserName(email: string, name: string): Promise<UserEntity | null>;
  abstract updateUserImage(email: string, img: string): Promise<UserEntity | null>;
  abstract updateUserEmail(email: string, newEmail: string): Promise<UserEntity | null>;
  abstract updateUserPassword(email: string, password: string): Promise<UserEntity | null>;
  abstract updateUserStatus(email: string, status: IStatus): Promise<UserEntity | null>;
  // Admin actions
  abstract getUsers(paginationDto: PaginationDto): Promise<UserQueryResult>;
  abstract updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null>;
  abstract deactivateUser(email: string): Promise<void>;
}
