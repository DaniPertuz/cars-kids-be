import { DeskDatasource } from '../../../../src/domain/datasources/desk.datasource';
import { DeskEntity } from '../../../../src/domain/entities';
import { DeskRepositoryImpl } from '../../../../src/infrastructure/repositories/desk-impl.repository';

type MockDeskDatasource = DeskDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('Desk repository implementation', () => {
  const mockDeskDatasource: MockDeskDatasource = {
    createDesk: jest.fn(),
    getDesk: jest.fn(),
    getDesks: jest.fn(),
    updateDesk: jest.fn(),
    deleteDesk: jest.fn()
  };

  const productRepositoryImpl = new DeskRepositoryImpl(mockDeskDatasource);

  const desk = new DeskEntity({
    name: 'Test Desk'
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'createDesk', args: [desk], },
    { method: 'getDesk', args: [desk] },
    { method: 'getDesks', args: [] },
    { method: 'updateDesk', args: ['Test Desk'] },
    { method: 'deleteDesk', args: ['Test Desk'] },
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (productRepositoryImpl as any)[method](...args);
      expect(mockDeskDatasource[method]).toHaveBeenCalled();
    });
  });
});
