import { Request, Response } from 'express';
import { MongoUserDatasource } from '../../infrastructure/datasources/mongo-user.datasource';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user-impl.repository';
import { IStatus, IUserRole } from '../../interfaces';
import User from '../../database/models/user';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';

export class UsersController {
  readonly userRepo = new UserRepositoryImpl(
    new MongoUserDatasource()
  );

  public getUsers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const users = await this.userRepo.getUsers(paginationDto!);

    const { page: productPage, limit: limitPage, total, next, prev, users: data } = users;

    return res.json({
      page: productPage,
      limit: limitPage,
      total,
      next,
      prev,
      users: data.map(user => user.params)
    });
  };

  public updateUserName = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    const userDB = await User.findOne({ email });

    if (!userDB) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = await this.userRepo.updateUserName(email, name);

    return res.json(user?.params);
  };

  public updateUserEmail = async (req: Request, res: Response) => {
    const { email, newEmail } = req.body;

    const userDB = await User.findOne({ email });

    if (!userDB) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = await this.userRepo.updateUserEmail(email, newEmail);

    return res.json(user?.params);
  };

  public updateUserImage = async (req: Request, res: Response) => {
    const { email, img } = req.body;

    const userDB = await User.findOne({ email });

    if (!userDB) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = await this.userRepo.updateUserImage(email, img);

    return res.json(user?.params);
  };

  public updateUserPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userDB = await User.findOne({ email });

    if (!userDB) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = await this.userRepo.updateUserPassword(email, password);

    return res.json(user?.params);
  };

  public updateUserRole = async (req: Request, res: Response) => {
    const { email, role } = req.body;

    if (!(Object.values(IUserRole).includes(role))) return res.status(400).json({ error: 'Rol de usuario no válido' });

    const user = await this.userRepo.updateUserRole(email, role as IUserRole);

    return res.json(user?.params);
  };

  public updateUserStatus = async (req: Request, res: Response) => {
    const { email, status } = req.body;

    if (!(Object.values(IStatus).includes(status))) return res.status(400).json({ error: 'Estado de usuario no válido' });

    const user = await this.userRepo.updateUserStatus(email, status as IStatus);

    return res.json(user?.params);
  };

  public deactivateUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    const userDB = await User.findOne({ email });

    if (!userDB) return res.status(404).json({ error: 'Usuario no encontrado' });

    this.userRepo.deactivateUser(email);

    return res.json({ status: IStatus.Inactive });
  };
}
