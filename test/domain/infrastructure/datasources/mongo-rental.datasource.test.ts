import { connect, disconnect } from '../../../../src/database';
import { RentalModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
import { RentalEntity } from '../../../../src/domain/entities/rental.entity';
import { MongoRentalDatasource } from '../../../../src/infrastructure/datasources/mongo-rental.datasource';
import { IPayment } from '../../../../src/interfaces';

describe('Mongo Rental datasource', () => {

  const rentalDatasource = new MongoRentalDatasource();

  const rental = new RentalEntity({
    client: 'NN Test',
    time: 15,
    date: '01-24-2023',
    vehicle: '15c42daad17250e579833f0e',
    payment: IPayment.Cash,
    amount: 10000,
    exception: ''
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await RentalModel.deleteMany();
    await disconnect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a rental', async () => {
    const rentalDB = await rentalDatasource.createRental(rental);

    expect(rentalDB).toBeInstanceOf(RentalEntity);

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should throw CustomError.serverError when RentalModel.create throws an error', async () => {
    jest.spyOn(RentalModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(rentalDatasource.createRental(rental)).rejects.toThrow('Error al crear alquiler: Error: Test error');
  });

  test('should get rentals', async () => {
    await rentalDatasource.createRental(rental);
    const [error, paginationDto] = PaginationDto.create(1, 1);

    const { rentals, prev, next } = await rentalDatasource.getRentals(paginationDto!);

    expect(rentals.length).toBeGreaterThanOrEqual(1);
    expect(rentals[0].params.client).toBe('NN Test');
    expect(prev).toBeNull();
    expect(next).toBeNull();
    expect(error).toBeUndefined();

    await RentalModel.findOneAndDelete({ client: 'NN Test' });
  });

  test('should getRentalsByQuery generate prev and next URLs', async () => {
    await rentalDatasource.createRental(rental);
    await rentalDatasource.createRental(rental);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await rentalDatasource.getRentalsByQuery({}, paginationDto1!);

    expect(pagination1.next).toBe(`/rentals?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await rentalDatasource.getRentalsByQuery({}, paginationDto2!);

    expect(pagination2.prev).toBe(`/rentals?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
    expect(error2).toBeUndefined();

    await RentalModel.findOneAndDelete({ client: 'NN Test' });
    await RentalModel.findOneAndDelete({ client: 'NN Test' });
  });

  test('should getRentals throw an error', async () => {
    const [error, paginationDto] = PaginationDto.create();
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(rentalDatasource.getRentals(paginationDto!)).rejects.toThrow('Error al obtener alquileres: Error: Test error');
  });

  test('should return the rental corresponding to the provided ID', async () => {
    const rentalId = '1';
    const mockRental = { id: rentalId };
    jest.spyOn(RentalModel, 'findById').mockResolvedValueOnce(mockRental);

    const result = await rentalDatasource.getRental(rentalId);

    expect(result).toBeDefined();
    // expect(result?.id).toBe(rentalId); // Verificar que el ID del alquiler es el esperado
  });

  test('should throw an error when getting a rental', async () => {
    jest.spyOn(RentalModel, 'findById').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = rentalDatasource.getRental('1');

    await expect(result).rejects.toThrow('Error al obtener alquiler: Error: Test error');
  });

  test('should return null when rental is not found', async () => {
    jest.spyOn(RentalModel, 'findById').mockResolvedValueOnce(null);

    const result = await rentalDatasource.getRental('wrong_id');

    expect(result).toBeNull();
  });

  test('should get rentals by day', async () => {
    const rentalDB = await rentalDatasource.createRental(rental);
    const [error, paginationDto] = PaginationDto.create();

    const { rentals } = await rentalDatasource.getRentalsByDay('24', '01', '2023', paginationDto!);

    expect(rentals.length).toBeGreaterThanOrEqual(1);
    expect(error).toBeUndefined();

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should getRentalsByDay throw an error', async () => {
    const [error, paginationDto] = PaginationDto.create();
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const day = '1';
    const month = '1';
    const year = '2020';

    await expect(rentalDatasource.getRentalsByDay(day, month, year, paginationDto!)).rejects.toThrow('Error al obtener los alquileres por día: Error: Test error');
  });

  test('should getRentalsByDay generate prev and next URLs', async () => {
    await rentalDatasource.createRental(rental);
    await rentalDatasource.createRental(rental);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await rentalDatasource.getRentalsByDay('24', '01', '2023', paginationDto1!);

    expect(pagination1.next).toBe(`/rentals?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await rentalDatasource.getRentalsByDay('24', '01', '2023', paginationDto2!);

    expect(pagination2.prev).toBe(`/rentals?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
    expect(error2).toBeUndefined();

    await RentalModel.findOneAndDelete({ client: 'NN Test' });
    await RentalModel.findOneAndDelete({ client: 'NN Test' });
  });

  test('should get rentals by month', async () => {
    const [error, paginationDto] = PaginationDto.create();
    const rentalDB = await rentalDatasource.createRental(rental);

    const { rentals } = await rentalDatasource.getRentalsByMonth('01', '2023', paginationDto!);

    expect(rentals.length).toBeGreaterThanOrEqual(1);

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should getRentalsByMonth throw an error', async () => {
    const [error, paginationDto] = PaginationDto.create();
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const month = '1';
    const year = '2024';

    await expect(rentalDatasource.getRentalsByMonth(month, year, paginationDto!)).rejects.toThrow('Error al obtener los alquileres por mes: Error: Test error');
  });

  test('should getRentalsByMonth generate prev and next URLs', async () => {
    await rentalDatasource.createRental(rental);
    await rentalDatasource.createRental(rental);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await rentalDatasource.getRentalsByMonth('01', '2023', paginationDto1!);

    expect(pagination1.next).toBe(`/rentals?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await rentalDatasource.getRentalsByMonth('01', '2023', paginationDto2!);

    expect(pagination2.prev).toBe(`/rentals?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
    expect(error2).toBeUndefined();

    await RentalModel.findOneAndDelete({ client: 'NN Test' });
    await RentalModel.findOneAndDelete({ client: 'NN Test' });
  });

  test('should get rentals within the specified period', async () => {
    const rentalDB = await rentalDatasource.createRental(rental);
    const [error, paginationDto] = PaginationDto.create();

    const starting = '10-12-2022';
    const ending = '01-02-2023';

    const { rentals } = await rentalDatasource.getRentalsByPeriod(starting, ending, paginationDto!);

    expect(rentals).toHaveLength(1);

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should throw an error when querying within the specified period', async () => {
    const [error, paginationDto] = PaginationDto.create();
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const starting = '01-01-2023';
    const ending = '01-02-2023';

    await expect(rentalDatasource.getRentalsByPeriod(starting, ending, paginationDto!)).rejects.toThrow('Error al obtener los alquileres por periodo: Error: Test error');
  });

  test('should getRentalsByPeriod generate prev and next URLs', async () => {
    await rentalDatasource.createRental(rental);
    await rentalDatasource.createRental(rental);
    const starting = '01-01-2023';
    const ending = '01-02-2023';
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await rentalDatasource.getRentalsByPeriod(starting, ending, paginationDto1!);

    expect(pagination1.next).toBe(`/rentals?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await rentalDatasource.getRentalsByPeriod(starting, ending, paginationDto2!);

    expect(pagination2.prev).toBe(`/rentals?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
    expect(error2).toBeUndefined();

    await RentalModel.findOneAndDelete({ client: 'NN Test' });
    await RentalModel.findOneAndDelete({ client: 'NN Test' });
  });

  test('should update a valid rental successfully', async () => {
    const id = '1234567890';
    const updatedRentalData = new RentalEntity({
      _id: id,
      client: 'NN Test',
      time: 15,
      date: '01-24-2023',
      vehicle: '15c42daad17250e579833f0e',
      payment: IPayment.Cash,
      amount: 10000,
      exception: 'Exception'
    });

    jest.spyOn(RentalModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedRentalData);

    const updatedRental = await rentalDatasource.updateRental(id, updatedRentalData);

    expect(updatedRental).toBeInstanceOf(RentalEntity);
  });

  test('should return null when no rental is found for the provided ID', async () => {
    jest.spyOn(RentalModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const result = await rentalDatasource.updateRental('999', rental);

    expect(result).toBeNull();
  });

  test('should throw an error when updating rental', async () => {
    jest.spyOn(RentalModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = rentalDatasource.updateRental('1', rental);

    await expect(result).rejects.toThrow('Error al actualizar alquiler: Error: Test error');
  });

  test('should return null when rental to be updated is not found', async () => {
    jest.spyOn(RentalModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const result = await rentalDatasource.updateRental('wrong_id', rental);

    expect(result).toBeNull();
  });

  test('should delete a rental', async () => {
    const rentalId = '1';
    jest.spyOn(RentalModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

    await rentalDatasource.deactivateRental(rentalId);

    expect(RentalModel.findByIdAndDelete).toHaveBeenCalledWith(rentalId);
  });

  test('should throw an error when deleting a rental', async () => {
    jest.spyOn(RentalModel, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = rentalDatasource.deactivateRental('1');

    await expect(result).rejects.toThrow('Error al eliminar alquiler: Error: Test error');
  });

});
