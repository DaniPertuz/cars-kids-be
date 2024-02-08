import { UserModel } from '../../database/models';
import { LoginUserDTO } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDTO } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors';
import { JwtAdapter, bcryptAdapter } from '../../plugins';

export class AuthService {
  constructor() { }

  public async registerUser(dto: RegisterUserDTO) {
    try {
      const userExists = await UserModel.findOne({ email: dto.params.email });

      if (userExists) throw CustomError.badRequest('Email ya existe');

      const user = new UserModel(dto.params);

      user.password = bcryptAdapter.hash(dto.params.password);

      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user).params;

      const token = await JwtAdapter.generateJWT({ email: user.email });

      if (!token) throw CustomError.serverError('Error al generar JWT');

      return {
        user: userEntity,
        token
      };
    } catch (error) {
      throw CustomError.serverError(`${error}`);
    }
  }

  public async login(dto: LoginUserDTO) {
    const userDB = await UserModel.findOne({ email: dto.email });

    if (!userDB) throw CustomError.badRequest('Email no existe');

    const isMatching = bcryptAdapter.compare(dto.password, userDB.password);

    if (!isMatching) throw CustomError.badRequest('Contraseña incorrecta');

    const { password, ...userEntity } = UserEntity.fromObject(userDB).params;

    const token = await JwtAdapter.generateJWT({ email: userDB.email });

    if (!token) throw CustomError.serverError('Error al generar JWT');

    return {
      user: userEntity,
      token
    };
  }

  public validateUser = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Token inválido');

    const { email } = payload as { email: string; };
    if (!email) throw CustomError.unauthorized('No hay email en token');

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.unauthorized('Email no existe');

    return true;
  };
}
