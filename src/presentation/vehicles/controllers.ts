import { Request, Response } from 'express';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { MongoVehicleDatasource } from '../../infrastructure/datasources/mongo-vehicle.datasource';
import { VehicleRepositoryImpl } from '../../infrastructure/repositories/vehicle-impl.repository';
import { IStatus, IVehicle, IVehicleSize } from '../../interfaces';
import { VehicleDTO } from '../../domain/dtos/vehicle';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';

export class VehiclesController {
  readonly vehicleRepo = new VehicleRepositoryImpl(
    new MongoVehicleDatasource()
  );

  public getVehicles = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const vehicles = await this.vehicleRepo.getVehicles(paginationDto!);

    const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;

    return res.json({
      page: vehiclePage,
      limit: limitPage,
      total,
      next,
      prev,
      vehicles: data.map(vehicle => vehicle.params)
    });
  };

  public getVehicleByNickname = async (req: Request, res: Response) => {
    const { nickname } = req.params;

    const vehicle = await this.vehicleRepo.getVehicleByNickname(nickname);

    return (vehicle) ? res.json(vehicle.params) : res.status(404).json({ error: `No se encontró vehículo con apodo ${nickname}` });
  };

  public getVehiclesByColor = async (req: Request, res: Response) => {
    const { color } = req.body;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const vehicles = await this.vehicleRepo.getVehiclesByColor(color, paginationDto!);

    const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;

    return res.json({
      page: vehiclePage,
      limit: limitPage,
      total,
      next,
      prev,
      vehicles: data.map(vehicle => vehicle.params)
    });
  };

  public getVehiclesByColorAndSize = async (req: Request, res: Response) => {
    const { color, size } = req.body;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    if (!(Object.values(IVehicleSize).includes(size as IVehicleSize))) {
      return res.status(400).json({ error: 'Color válido pero tamaño de vehículo no válido' });
    }

    const vehicles = await this.vehicleRepo.getVehiclesByColorAndSize(color, size as IVehicleSize, paginationDto!);

    const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;

    return res.json({
      page: vehiclePage,
      limit: limitPage,
      total,
      next,
      prev,
      vehicles: data.map(vehicle => vehicle.params)
    });
  };

  public getVehiclesBySize = async (req: Request, res: Response) => {
    const { size } = req.body;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    if (!(Object.values(IVehicleSize).includes(size as IVehicleSize))) {
      return res.status(400).json({ error: 'Tamaño de vehículo no válido' });
    }

    const vehicles = await this.vehicleRepo.getVehiclesBySize(size, paginationDto!);

    const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;

    return res.json({
      page: vehiclePage,
      limit: limitPage,
      total,
      next,
      prev,
      vehicles: data.map(vehicle => vehicle.params)
    });
  };

  public getVehiclesByStatus = async (req: Request, res: Response) => {
    const { status } = req.body;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    if (!(Object.values(IStatus).includes(status as IStatus))) {
      return res.status(400).json({ error: 'Estado de vehículo no válido' });
    }

    const vehicles = await this.vehicleRepo.getVehiclesByStatus(status as IStatus, paginationDto!);

    const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;

    return res.json({
      page: vehiclePage,
      limit: limitPage,
      total,
      next,
      prev,
      vehicles: data.map(vehicle => vehicle.params)
    });
  };

  public createVehicle = async (req: Request, res: Response) => {
    const [error, vehicleDto] = VehicleDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const vehicleData: VehicleEntity = VehicleEntity.fromObject(vehicleDto!.params);

    const vehicle = (await this.vehicleRepo.createVehicle(vehicleData)).params;

    return res.json(vehicle);
  };

  public updateVehicle = async (req: Request, res: Response) => {
    const { nickname } = req.params;
    const { nickname: newNickname, category, img, color, size, status } = req.body;

    const vehicleDB = await this.vehicleRepo.getVehicleByNickname(nickname);

    if (!vehicleDB) return res.status(404).json({ error: 'Vehículo no encontrado' });

    const updatedVehicleData: IVehicle = {
      nickname: newNickname,
      category,
      img,
      color,
      size,
      status
    };

    const updatedVehicleEntity = VehicleEntity.fromObject(updatedVehicleData);

    const updatedVehicle = await this.vehicleRepo.updateVehicle(nickname, updatedVehicleEntity);

    return res.json(updatedVehicle?.params);
  };

  public deactivateVehicle = async (req: Request, res: Response) => {
    const { nickname } = req.params;

    const vehicleDB = await this.vehicleRepo.getVehicleByNickname(nickname);

    if (!vehicleDB) return res.status(404).json({ error: 'Vehículo no encontrado' });

    await this.vehicleRepo.deactivateVehicle(nickname);

    return res.json({ status: IStatus.Inactive });
  };
}
