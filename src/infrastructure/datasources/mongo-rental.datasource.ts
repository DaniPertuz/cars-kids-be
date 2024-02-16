import { RentalModel } from '../../database/models';
import { RentalDatasource } from '../../domain/datasources/rental.datasource';
import { RentalEntity } from '../../domain/entities/rental.entity';
import { CustomError } from '../../domain/errors';

export class MongoRentalDatasource implements RentalDatasource {
  public async getRentalsByQuery(query: any): Promise<RentalEntity[]> {
    const rentalData = await RentalModel.find(query).populate('vehicle', '-createdAt -updatedAt');
    return rentalData.map(RentalEntity.fromObject);
  }

  async createRental(rental: RentalEntity): Promise<RentalEntity> {
    try {
      const data = await RentalModel.create(rental.params);
      return RentalEntity.fromObject(data);
    } catch (error) {
      throw CustomError.serverError(`Error al crear alquiler: ${error}`);
    }
  }

  async getRental(id: string): Promise<RentalEntity | null> {
    try {
      const rentalData = await RentalModel.findById(id);
      return rentalData ? RentalEntity.fromObject(rentalData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al obtener alquiler: ${error}`);
    }
  }

  async getRentals(): Promise<RentalEntity[]> {
    try {
      return await this.getRentalsByQuery({});
    } catch (error) {
      throw CustomError.serverError(`Error al obtener alquileres: ${error}`);
    }
  }

  async getRentalsByDay(day: string, month: string, year: string): Promise<RentalEntity[]> {
    try {
      const dayNumber = parseInt(day, 10);
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      const selectedDate = new Date(yearNumber, monthNumber - 1, dayNumber);

      const result = await RentalModel.find({
        date: {
          $gte: selectedDate,
          $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        }
      }).populate('vehicle', '-_id nickname');

      return result.map(RentalEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por día: ${error}`);
    }
  }

  async getRentalsByMonth(month: string, year: string): Promise<RentalEntity[]> {
    try {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
      const lastDayOfMonth = new Date(Number(year), monthNumber, 0);

      const result = await RentalModel.find({
        date: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth
        }
      }).populate('vehicle', '-_id nickname');

      return result.map(RentalEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por mes: ${error}`);
    }
  }

  async getRentalsByPeriod(starting: string, ending: string): Promise<RentalEntity[]> {
    try {
      const startingDateParts = starting.split('-').map(Number);
      const endingDateParts = ending.split('-').map(Number);
      const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
      const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);

      const result = await RentalModel.find({
        date: {
          $gte: startDate,
          $lt: endDate
        }
      }).populate('vehicle', '-_id nickname');

      return result.map(RentalEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por periodo: ${error}`);
    }
  }

  async updateRental(id: string, rental: RentalEntity): Promise<RentalEntity | null> {
    try {
      const rentalData = await RentalModel.findByIdAndUpdate(id, rental.params, { new: true });

      return rentalData ? RentalEntity.fromObject(rentalData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar alquiler: ${error}`);
    }
  }

  async deactivateRental(id: string): Promise<void> {
    try {
      await RentalModel.findByIdAndDelete(id);
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar alquiler: ${error}`);
    }
  }
}
