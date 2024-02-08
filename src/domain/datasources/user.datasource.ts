import { IUserRole } from '../../interfaces';
import { UserEntity } from '../entities/user.entity';

export abstract class UserDatasource {
  // Admin actions
  abstract getUsers(): Promise<UserEntity[]>;
  abstract updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null>;
  abstract deactivateUser(email: string): Promise<void>;
}
