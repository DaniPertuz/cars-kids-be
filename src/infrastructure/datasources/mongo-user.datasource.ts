import { UserModel } from '../../database/models';
import { UserDatasource } from '../../domain/datasources/user.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors';
import { IStatus, IUserRole, UserQueryResult } from '../../interfaces';

export class MongoUserDatasource implements UserDatasource {
  async getUsers(paginationDto: PaginationDto): Promise<UserQueryResult> {
    try {
      const { page, limit } = paginationDto;

      const [total, users] = await Promise.all([
        UserModel.countDocuments({ role: IUserRole.Editor }),
        UserModel.find({ role: IUserRole.Editor })
          .select('-password')
          .sort({ name: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
      ]);

      return {
        page,
        limit,
        total,
        next: ((page * limit) < total) ? `/users?page=${(page + 1)}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/users?page=${(page - 1)}&limit=${limit}` : null,
        users: users.map(UserEntity.fromObject)
      };
    } catch (error: any) {
      throw CustomError.serverError(`Error al obtener usuarios: ${error}`);
    }
  }

  async updateUserRole(email: string, role: IUserRole): Promise<UserEntity | null> {
    try {
      const userData = await UserModel.findOneAndUpdate({ email }, { role }, { new: true, projection: { password: 0 } });

      return userData ? UserEntity.fromObject(userData) : null;
    } catch (error: any) {
      throw CustomError.serverError(`Error al actualizar rol de usuario: ${error}`);
    }
  }

  async deactivateUser(email: string): Promise<void> {
    try {
      await UserModel.findOneAndUpdate({ email }, { status: IStatus.Inactive }, { new: true });
    } catch (error: any) {
      throw CustomError.serverError(`Error al eliminar usuario: ${error}`);
    }
  }
}
