import { DeskDatasource } from '../../domain/datasources/desk.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { DeskEntity } from '../../domain/entities';
import { DeskRepository } from '../../domain/repository/desk.repository';
import { DeskQueryResult } from '../../interfaces';

export class DeskRepositoryImpl implements DeskRepository {
  constructor(private readonly deskDatasource: DeskDatasource) { }

  createDesk(desk: DeskEntity): Promise<DeskEntity> {
    return this.deskDatasource.createDesk(desk);
  }
  getDesks(paginationDto: PaginationDto): Promise<DeskQueryResult> {
    return this.deskDatasource.getDesks(paginationDto);
  }
  getDesk(name: string): Promise<DeskEntity | null> {
    return this.deskDatasource.getDesk(name);
  }
  updateDesk(name: string, desk: DeskEntity): Promise<DeskEntity | null> {
    return this.deskDatasource.updateDesk(name, desk);
  }
  deleteDesk(name: string): Promise<DeskEntity | null> {
    return this.deskDatasource.deleteDesk(name);
  }
}
