import { UserModel } from '../../database/models';
import { UserDatasource } from '../../domain/datasources/user.datasource';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors';
import { IStatus, IUserRole } from '../../interfaces';

export class MongoUserDatasource implements UserDatasource {
  async getUsers(): Promise<UserEntity[]> {
    try {
      const users = await UserModel.find({ role: IUserRole.Editor }).select('-password');

      return users.map(UserEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener usuarios: ${error}`);
    }
  }

  async updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null> {
    try {
      const userData = await UserModel.findOneAndUpdate({ email }, { role }, { new: true, projection: { password: 0 } });

      return userData ? UserEntity.fromObject(userData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar rol de usuario: ${error}`);
    }
  }

  async deactivateUser(email: string): Promise<void> {
    try {
      await UserModel.findOneAndUpdate({ email }, { status: IStatus.Inactive }, { new: true });
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar usuario: ${error}`);
    }
  }
}
