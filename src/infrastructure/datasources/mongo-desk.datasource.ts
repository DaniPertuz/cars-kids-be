import { DeskModel } from '../../database/models';
import { DeskDatasource } from '../../domain/datasources/desk.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { DeskEntity } from '../../domain/entities';
import { CustomError } from '../../domain/errors';
import { DeskQueryResult, IDesk } from '../../interfaces';

export class MongoDeskDatasource implements DeskDatasource {
  async createDesk(desk: DeskEntity): Promise<DeskEntity> {
    try {
      const data = await DeskModel.create(desk.params);

      return DeskEntity.fromObject(data);
    } catch (error) {
      throw CustomError.serverError(`Error al crear puesto de trabajo: ${error}`);
    }
  }

  async getDesks(paginationDto: PaginationDto): Promise<DeskQueryResult> {
    try {
      const { page, limit } = paginationDto;

      const [total, desks] = await Promise.all([
        DeskModel.countDocuments({}),
        DeskModel.find({})
          .skip((page - 1) * limit)
          .limit(limit)
      ]);

      return {
        page,
        limit,
        total,
        next: ((page * limit) < total) ? `/desks?page=${(page + 1)}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/desks?page=${(page - 1)}&limit=${limit}` : null,
        desks: desks.map(DeskEntity.fromObject)
      };
    } catch (error) {
      throw CustomError.serverError(`Error al obtener todos los puestos de trabajo: ${error}`);
    }
  }

  async getDesk(name: string): Promise<DeskEntity | null> {
    try {
      const deskData = await DeskModel.findOne({ name });

      return deskData ? DeskEntity.fromObject(deskData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al obtener puesto de trabajo: ${error}`);
    }
  }

  async updateDesk(name: string, desk: DeskEntity): Promise<DeskEntity | null> {
    try {
      const deskData = await DeskModel.findOneAndUpdate({ name }, desk.params, { new: true });

      return deskData ? DeskEntity.fromObject(deskData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar puesto de trabajo: ${error}`);
    }
  }

  async deleteDesk(name: string): Promise<DeskEntity | null> {
    try {
      const desk = await DeskModel.findOneAndDelete({ name }, { new: true });
      return desk ? DeskEntity.fromObject(desk) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar puesto de trabajo: ${error}`);
    }
  }
}
