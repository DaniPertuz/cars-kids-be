import { UserModel } from '../../database/models';
import { UserDatasource } from '../../domain/datasources/user.datasource';
import { UserEntity } from '../../domain/entities/user.entity';
import { IStatus, IUserRole } from '../../interfaces';

export class MongoUserDatasource implements UserDatasource {
  async getUsers(): Promise<UserEntity[]> {
    const users = await UserModel.find({ role: IUserRole.Editor }).select('-password');

    return users.map(UserEntity.fromObject);
  }

  async updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null> {
    const userData = await UserModel.findOneAndUpdate({ email }, { role }, { new: true, projection: { password: 0 } });

    return userData ? UserEntity.fromObject(userData) : null;
  }

  async deactivateUser(email: string): Promise<void> {
    await UserModel.findOneAndUpdate({ email }, { status: IStatus.Inactive }, { new: true });
  }
}
