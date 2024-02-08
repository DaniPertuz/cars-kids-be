import { Request, Response } from 'express';
import { MongoUserDatasource } from '../../infrastructure/datasources/mongo-user.datasource';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user-impl.repository';
import { IStatus, IUserRole } from '../../interfaces';

export class UsersController {
  readonly userRepo = new UserRepositoryImpl(
    new MongoUserDatasource()
  );

  public getUsers = async (req: Request, res: Response) => {
    const users = (await this.userRepo.getUsers()).map(user => user.params);

    return res.json(users);
  };

  public updateUserRole = async (req: Request, res: Response) => {
    const { email, role } = req.body;

    if (!(Object.values(IUserRole).includes(role))) {
      return res.status(400).json({ error: 'Rol de usuario no válido' });
    }

    const user = await this.userRepo.updateUserRole(email, role as IUserRole);

    return res.json(user?.params);
  };

  public deactivateUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    this.userRepo.deactivateUser(email);

    return res.json({ status: IStatus.Inactive });
  };
}
