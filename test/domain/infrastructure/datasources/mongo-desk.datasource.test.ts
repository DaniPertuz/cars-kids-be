import { connect, disconnect } from '../../../../src/database';
import { DeskModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
import { DeskEntity } from '../../../../src/domain/entities';
import { MongoDeskDatasource } from '../../../../src/infrastructure/datasources/mongo-desk.datasource';

describe('Mongo Desk datasource', () => {

  const deskDatasource = new MongoDeskDatasource();

  beforeAll(async () => {
    await connect();
  });

  const desk1 = new DeskEntity({
    name: 'Test Desk 1'
  });

  const desk2 = new DeskEntity({
    name: 'Test Desk 2'
  });

  afterAll(async () => {
    await disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await DeskModel.deleteMany();
  });

  test('should create a desk', async () => {
    const deskDB = await deskDatasource.createDesk(desk1);

    expect(deskDB).toBeInstanceOf(DeskEntity);

    await DeskModel.findOneAndDelete({ name: deskDB.params.name });
  });

  test('should throw an error if failed to create a desk', async () => {
    jest.spyOn(DeskModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(deskDatasource.createDesk(desk1)).rejects.toThrow('Error al crear puesto de trabajo: Error: Test error');
  });

  test('should get all desks', async () => {
    await deskDatasource.createDesk(desk1);
    await deskDatasource.createDesk(desk2);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await deskDatasource.getDesks(paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.desks.length).toBe(1);
    expect(pagination1.desks[0].params.name).toBe(desk1.params.name);
    expect(pagination1.next).toBe(`/desks?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await deskDatasource.getDesks(paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.desks.length).toBe(1);
    expect(pagination2.desks[0].params.name).toBe(desk2.params.name);
    expect(pagination2.prev).toBe(`/desks?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    await DeskModel.findOneAndDelete({ name: desk1.params.name });
    await DeskModel.findOneAndDelete({ name: desk2.params.name });
  });

  test('should throw an error if failed to get all desks', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    jest.spyOn(DeskModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(deskDatasource.getDesks(paginationDto!)).rejects.toThrow('Error al obtener todos los puestos de trabajo: Error: Test error');
  });

  test('should get desk by name', async () => {
    const deskTest = new DeskEntity({
      name: 'Testing Desk'
    });

    await deskDatasource.createDesk(deskTest);

    const deskDB = await deskDatasource.getDesk('Testing Desk');
    const deskDB2 = await deskDatasource.getDesk('Testing Name');

    expect(deskDB).toBeInstanceOf(DeskEntity);
    expect(deskDB?.params.name).toEqual(deskTest.params.name);
    expect(deskDB2).toBeNull();
  });

  test('should throw an error if failed to get product', async () => {
    jest.spyOn(DeskModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(deskDatasource.getDesk('wrong_name')).rejects.toThrow('Error al obtener puesto de trabajo: Error: Test error');
  });

  test('should update desk', async () => {
    const deskTest = new DeskEntity({
      name: 'New Testing Desk'
    });

    await deskDatasource.createDesk(deskTest);

    const updatedDesk = new DeskEntity({
      name: 'Testing Desk Updated'
    });

    const deskDB = await deskDatasource.updateDesk('New Testing Desk', updatedDesk);
    const deskDB2 = await deskDatasource.updateDesk('Testing Name', updatedDesk);

    expect(deskDB?.params).toEqual(expect.objectContaining({
      name: 'Testing Desk Updated'
    }));
    expect(deskDB2).toBeNull();
  });

  test('should throw an error when updating desk', async () => {
    const name = 'desk_name';
    const desk = new DeskEntity({
      name: 'Testing Desk Updated'
    });

    const error = new Error('Failed to update desk');

    const mockFindOneAndUpdate = jest.spyOn(DeskModel, 'findOneAndUpdate');

    mockFindOneAndUpdate.mockRejectedValue(error);

    await expect(deskDatasource.updateDesk(name, desk)).rejects.toThrow(`Error al actualizar puesto de trabajo: ${error}`);

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ name }, desk.params, { new: true });

    mockFindOneAndUpdate.mockRestore();
  });

  test('should delete desk', async () => {
    const deskTest = new DeskEntity({
      name: 'Testing Product Delete'
    });

    await deskDatasource.createDesk(deskTest);

    const deskDB = await deskDatasource.deleteDesk('Testing Product Delete');
    const deskDB2 = await deskDatasource.deleteDesk('Testing Name');

    expect(deskDB).toBeInstanceOf(DeskEntity);
    expect(deskDB2).toBeNull();
  });

  test('should throw an error when deleting a desk', async () => {
    jest.spyOn(DeskModel, 'findOneAndDelete').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = deskDatasource.deleteDesk('1');

    await expect(result).rejects.toThrow('Error al eliminar puesto de trabajo: Error: Test error');
  });
});
