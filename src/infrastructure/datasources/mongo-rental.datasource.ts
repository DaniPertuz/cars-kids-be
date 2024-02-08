import { RentalModel } from '../../database/models';
import { RentalDatasource } from '../../domain/datasources/rental.datasource';
import { RentalEntity } from '../../domain/entities/rental.entity';
import { CustomError } from '../../domain/errors';

export class MongoRentalDatasource implements RentalDatasource {
  private async getRentalsByQuery(query: any): Promise<RentalEntity[]> {
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

  getRentals = (): Promise<RentalEntity[]> => this.getRentalsByQuery({});

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
      });

      return result.map(RentalEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por día: ${error}`);
    }
  }

  async getRentalsByMonth(month: string, year: string): Promise<RentalEntity[]> {
    try {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const firstDayOfMonth = new Date(new Date().getFullYear(), monthNumber - 1, 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), monthNumber, 0);

      const result = await RentalModel.find({
        date: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth
        }
      });

      return result.map(RentalEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por mes: ${error}`);
    }
  }

  async getRentalsByPeriod(starting: string, ending: string): Promise<RentalEntity[]> {
    try {
      const startDate = new Date(starting);
      const endDate = new Date(ending);

      const result = await RentalModel.find({
        date: {
          $gte: startDate,
          $lt: endDate
        }
      });

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
      await RentalModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar alquiler: ${error}`);
    }
  }
}
