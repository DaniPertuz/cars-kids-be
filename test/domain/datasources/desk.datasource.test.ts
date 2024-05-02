import { DeskDatasource } from '../../../src/domain/datasources/desk.datasource';
import { PaginationDto } from '../../../src/domain/dtos/shared/pagination.dto';
import { DeskEntity } from '../../../src/domain/entities';
import { DeskQueryResult } from '../../../src/interfaces';

describe('Desk datasource', () => {
  class MockDatasource implements DeskDatasource {
    createDesk(desk: DeskEntity): Promise<DeskEntity> {
      throw new Error('Method not implemented.');
    }
    getDesks(paginationDto: PaginationDto): Promise<DeskQueryResult> {
      throw new Error('Method not implemented.');
    }
    getDesk(name: string): Promise<DeskEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateDesk(name: string, desk: DeskEntity): Promise<DeskEntity | null> {
      throw new Error('Method not implemented.');
    }
    deleteDesk(name: string): Promise<DeskEntity | null> {
      throw new Error('Method not implemented.');
    }
  }

  test('should test the abstract Desk class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.createDesk).toBe('function');
    expect(typeof mockDatasource.getDesk).toBe('function');
    expect(typeof mockDatasource.getDesks).toBe('function');
    expect(typeof mockDatasource.updateDesk).toBe('function');
    expect(typeof mockDatasource.deleteDesk).toBe('function');
  });
});
