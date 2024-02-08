import { Request, Response } from 'express';
import { RentalRepositoryImpl } from '../../infrastructure/repositories/rental-impl.repository';
import { MongoRentalDatasource } from '../../infrastructure/datasources/mongo-rental.datasource';
import { RentalEntity } from '../../domain/entities/rental.entity';
import { IRental, IStatus } from '../../interfaces';
import { RentalDTO } from '../../domain/dtos/rental';

export class RentalsController {
  readonly rentalRepo = new RentalRepositoryImpl(
    new MongoRentalDatasource()
  );

  public getRentals = async (req: Request, res: Response) => {
    const rentals = (await this.rentalRepo.getRentals()).map(rental => rental.params);

    return res.json(rentals);
  };

  public getRental = async (req: Request, res: Response) => {
    const { id } = req.params;

    const rental = await this.rentalRepo.getRental(id);

    return (rental) ? res.json(rental.params) : res.status(404).json({ error: `Rental with ID ${id} not found` });
  };

  public getRentalsByDay = async (req: Request, res: Response) => {
    const { day, month, year } = req.params;

    const rentals = (await this.rentalRepo.getRentalsByDay(day, month, year)).map(rental => rental.params);

    return res.json(rentals);
  };

  public getRentalsByMonth = async (req: Request, res: Response) => {
    const { month, year } = req.params;

    const rentals = (await this.rentalRepo.getRentalsByMonth(month, year)).map(rental => rental.params);

    return res.json(rentals);
  };

  public getRentalsByPeriod = async (req: Request, res: Response) => {
    const { starting, ending } = req.params;

    const rentals = (await this.rentalRepo.getRentalsByPeriod(starting, ending)).map(rental => rental.params);

    return res.json(rentals);
  };

  public createRental = async (req: Request, res: Response) => {
    const [error, rentalDto] = RentalDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const rentalData: RentalEntity = RentalEntity.fromObject(rentalDto!.params);

    const rental = (await this.rentalRepo.createRental(rentalData)).params;

    return res.json(rental);
  };

  public updateRental = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, rentalDto] = RentalDTO.update({ ...req.body, _id: id });

    if (error) return res.status(400).json({ error });

    const rentalDB = await this.rentalRepo.getRental(id);

    if (!rentalDB) {
      return res.status(404).json({ error: 'Alquiler no encontrado' });
    }

    const updatedRentalEntity = RentalEntity.fromObject(rentalDto?.params!);

    const updatedRental = await this.rentalRepo.updateRental(id, updatedRentalEntity);

    return res.json(updatedRental?.params);
  };

  public deactivateRental = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.rentalRepo.deactivateRental(id);

    return res.json({ status: IStatus.Inactive });
  };
}
