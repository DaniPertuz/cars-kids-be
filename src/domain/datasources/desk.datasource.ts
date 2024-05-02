import { DeskQueryResult } from '../../interfaces';
import { PaginationDto } from '../dtos/shared/pagination.dto';
import { DeskEntity } from '../entities/desk.entity';

export abstract class DeskDatasource {
  abstract createDesk(desk: DeskEntity): Promise<DeskEntity>;
  abstract getDesks(paginationDto: PaginationDto): Promise<DeskQueryResult>;
  abstract getDesk(name: string): Promise<DeskEntity | null>;
  abstract updateDesk(name: string, desk: DeskEntity): Promise<DeskEntity | null>;
  abstract deleteDesk(name: string): Promise<DeskEntity | null>;
}
