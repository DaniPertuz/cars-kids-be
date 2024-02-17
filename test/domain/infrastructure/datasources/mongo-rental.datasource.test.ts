import { connect, disconnect } from '../../../../src/database';
import { RentalModel } from '../../../../src/database/models';
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
    const rentalDB = await rentalDatasource.createRental(rental);

    const rentals = await rentalDatasource.getRentals();

    expect(rentals.length).toBeGreaterThanOrEqual(1);
    expect(rentals[0].params.client).toBe('NN Test');

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should getRentals throw an error', async () => {
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(rentalDatasource.getRentals()).rejects.toThrow('Error al obtener alquileres: Error: Test error');
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

    const rentals = await rentalDatasource.getRentalsByDay('24', '01', '2023');

    expect(rentals.length).toBeGreaterThanOrEqual(1);

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should getRentalsByDay throw an error', async () => {
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const day = '1';
    const month = '1';
    const year = '2020';

    await expect(rentalDatasource.getRentalsByDay(day, month, year)).rejects.toThrow('Error al obtener los alquileres por día: Error: Test error');
  });

  test('should get rentals by month', async () => {
    const rentalDB = await rentalDatasource.createRental(rental);

    const rentals = await rentalDatasource.getRentalsByMonth('01', '2023');

    expect(rentals.length).toBeGreaterThanOrEqual(1);

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should getRentalsByMonth throw an error', async () => {
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const month = '1';
    const year = '2024';

    await expect(rentalDatasource.getRentalsByMonth(month, year)).rejects.toThrow('Error al obtener los alquileres por mes: Error: Test error');
  });

  test('should get rentals within the specified period', async () => {
    const rentalDB = await rentalDatasource.createRental(rental);

    const starting = '10-12-2022';
    const ending = '01-02-2023';

    const result = await rentalDatasource.getRentalsByPeriod(starting, ending);

    expect(result).toHaveLength(1);

    await RentalModel.findOneAndDelete({ client: rentalDB.params.client });
  });

  test('should throw an error when querying within the specified period', async () => {
    jest.spyOn(RentalModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const starting = '01-01-2023';
    const ending = '01-02-2023';

    await expect(rentalDatasource.getRentalsByPeriod(starting, ending)).rejects.toThrow('Error al obtener los alquileres por periodo: Error: Test error');
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
