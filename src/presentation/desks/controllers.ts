import { Request, Response } from 'express';
import { MongoDeskDatasource } from '../../infrastructure/datasources/mongo-desk.datasource';
import { DeskRepositoryImpl } from '../../infrastructure/repositories/desk-impl.repository';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { DeskDTO } from '../../domain/dtos/desk';
import { DeskEntity } from '../../domain/entities';
import { IDesk } from '../../interfaces';

export class DeskController {
  readonly deskRepo = new DeskRepositoryImpl(
    new MongoDeskDatasource()
  );

  public getDesks = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const desks = await this.deskRepo.getDesks(paginationDto!);

    const { page: productPage, limit: limitPage, total, next, prev, desks: data } = desks;

    return res.json({
      page: productPage,
      limit: limitPage,
      total,
      next,
      prev,
      desks: data.map(desk => desk.params)
    });
  };

  public getDesk = async (req: Request, res: Response) => {
    const { name } = req.params;

    const desk = await this.deskRepo.getDesk(name);

    return (desk) ? res.json(desk.params) : res.status(404).json({ error: `No se encontró el puesto de trabajo ${name}` });
  };

  public createDesk = async (req: Request, res: Response) => {
    const [error, deskDto] = DeskDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const deskDB = await this.deskRepo.getDesk(deskDto!.params.name);

    if (deskDB) return res.status(400).json({ error: 'Ya existe puesto de trabajo con este nombre' });

    const deskData: DeskEntity = DeskEntity.fromObject(deskDto!.params);

    const desk = (await this.deskRepo.createDesk(deskData)).params;

    return res.json(desk);
  };

  public updateDesk = async (req: Request, res: Response) => {
    const { name } = req.params;
    const { name: newName } = req.body;

    const deskDB = await this.deskRepo.getDesk(name);

    if (!deskDB) return res.status(404).json({ error: 'Puesto de trabajo no encontrado' });

    const existingDesk = await this.deskRepo.getDesk(newName);

    if (existingDesk) return res.status(404).json({ error: 'Ya existe un puesto de trabajo con este nombre' });

    const updatedDeskData: IDesk = {
      name: newName
    };

    const updatedDeskEntity = DeskEntity.fromObject(updatedDeskData);

    const updatedDesk = await this.deskRepo.updateDesk(name, updatedDeskEntity);

    return res.json(updatedDesk!.params);
  };

  public deleteDesk = async (req: Request, res: Response) => {
    const { name } = req.params;

    const deskDB = await this.deskRepo.getDesk(name);

    if (!deskDB) return res.status(404).json({ error: 'Puesto de trabajo no encontrado' });

    const desk = await this.deskRepo.deleteDesk(name);

    return res.json(desk!.params);
  };
}
