import { Request, Response } from 'express';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { MongoVehicleDatasource } from '../../infrastructure/datasources/mongo-vehicle.datasource';
import { VehicleRepositoryImpl } from '../../infrastructure/repositories/vehicle-impl.repository';
import { IStatus, IVehicle, IVehicleSize } from '../../interfaces';
import { VehicleDTO } from '../../domain/dtos/vehicle';

export class VehiclesController {
  readonly vehicleRepo = new VehicleRepositoryImpl(
    new MongoVehicleDatasource()
  );

  public getVehicles = async (req: Request, res: Response) => {
    const vehicles = (await this.vehicleRepo.getVehicles()).map(vehicle => vehicle.params);

    return res.json(vehicles);
  };

  public getVehicleByNickname = async (req: Request, res: Response) => {
    const { nickname } = req.params;

    const vehicle = await this.vehicleRepo.getVehicleByNickname(nickname);

    return (vehicle) ? res.json(vehicle.params) : res.status(404).json({ error: `No se encontró vehículo con apodo ${nickname}` });
  };

  public getVehiclesByColor = async (req: Request, res: Response) => {
    const { color } = req.body;

    const vehicles = (await this.vehicleRepo.getVehiclesByColor(color)).map(vehicle => vehicle.params);

    return (vehicles) ? res.json(vehicles) : res.status(404).json({ error: 'No se encontraron vehículos con este color' });
  };

  public getVehiclesByColorAndSize = async (req: Request, res: Response) => {
    const { color, size } = req.body;

    if (!(Object.values(IVehicleSize).includes(size as IVehicleSize))) {
      return res.status(400).json({ error: 'Color válido pero tamaño de vehículo no válido' });
    }

    const vehicles = (await this.vehicleRepo.getVehiclesByColorAndSize(color, size as IVehicleSize)).map(vehicle => vehicle.params);

    return (vehicles) ? res.json(vehicles) : res.status(404).json({ error: 'No se encontraron vehículos con este color y tamaño' });
  };

  public getVehiclesBySize = async (req: Request, res: Response) => {
    const { size } = req.body;

    if (!(Object.values(IVehicleSize).includes(size as IVehicleSize))) {
      return res.status(400).json({ error: 'Tamaño de vehículo no válido' });
    }

    const vehicles = (await this.vehicleRepo.getVehiclesBySize(size)).map(vehicle => vehicle.params);

    return (vehicles) ? res.json(vehicles) : res.status(404).json({ error: 'No se encontraron vehículos con este tamaño' });
  };

  public getVehiclesByStatus = async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!(Object.values(IStatus).includes(status as IStatus))) {
      return res.status(400).json({ error: 'Estado de vehículo no válido' });
    }

    const vehicles = (await this.vehicleRepo.getVehiclesByStatus(status as IStatus)).map(vehicle => vehicle.params);

    return (vehicles) ? res.json(vehicles) : res.status(404).json({ error: 'No se encontraron vehículos con este estado' });
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

  public deactivateteVehicle = async (req: Request, res: Response) => {
    const { nickname } = req.params;

    const vehicleDB = await this.vehicleRepo.getVehicleByNickname(nickname);

    if (!vehicleDB) return res.status(404).json({ error: 'Vehículo no encontrado' });

    await this.vehicleRepo.deactivateVehicle(nickname);

    return res.json({ status: IStatus.Inactive });
  };
}
