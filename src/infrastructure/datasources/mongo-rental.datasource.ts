import { RentalModel } from '../../database/models';
import { RentalDatasource } from '../../domain/datasources/rental.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { RentalEntity } from '../../domain/entities/rental.entity';
import { CustomError } from '../../domain/errors';
import { RentalQueryResult } from '../../interfaces';

export class MongoRentalDatasource implements RentalDatasource {
  public async getRentalsByQuery(query: any, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    const { page, limit } = paginationDto;

    const [total, sum, rentals] = await Promise.all([
      RentalModel.countDocuments(query),
      RentalModel.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: null,
            sum: { $sum: '$amount' }
          }
        },
        {
          $project: {
            _id: 0,
            sum: 1
          }
        }
      ]),
      RentalModel.find(query)
        .populate('vehicle', '-_id nickname')
        .populate('user', '-_id name')
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return {
      page,
      limit,
      sum: sum.length > 0 ? sum[0].sum : 0,
      total,
      next: ((page * limit) < total) ? `/rentals?page=${(page + 1)}&limit=${limit}` : null,
      prev: (page - 1 > 0) ? `/rentals?page=${(page - 1)}&limit=${limit}` : null,
      rentals: rentals.map(RentalEntity.fromObject)
    };
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

  async getRentals(paginationDto: PaginationDto): Promise<RentalQueryResult> {
    try {
      return await this.getRentalsByQuery({}, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener alquileres: ${error}`);
    }
  }

  async getRentalsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    try {
      const dayNumber = parseInt(day, 10);
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      const selectedDate = new Date(yearNumber, monthNumber - 1, dayNumber);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const query = {
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      };

      return await this.getRentalsByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por día: ${error}`);
    }
  }

  async getRentalsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    try {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
      const lastDayOfMonth = new Date(Number(year), monthNumber, 0);

      const query = {
        date: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth
        }
      };

      return await this.getRentalsByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los alquileres por mes: ${error}`);
    }
  }

  async getRentalsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    try {
      const startingDateParts = starting.split('-').map(Number);
      const endingDateParts = ending.split('-').map(Number);
      const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
      const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);

      const query = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };

      return await this.getRentalsByQuery(query, paginationDto);
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
