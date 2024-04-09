import { IStatus, ProductQueryResult } from '../../interfaces';
import { PaginationDto } from '../dtos/shared/pagination.dto';
import { ProductEntity } from '../entities/product.entity';

export abstract class ProductDatasource {
  abstract createProduct(product: ProductEntity): Promise<ProductEntity>;
  abstract getAllProducts(paginationDto: PaginationDto): Promise<ProductQueryResult>;
  abstract getProductsByStatus(status: IStatus, paginationDto: PaginationDto): Promise<ProductQueryResult>;
  abstract getProduct(name: string): Promise<ProductEntity | null>;
  abstract updateProduct(name: string, product: ProductEntity): Promise<ProductEntity | null>;
  abstract deleteProduct(name: string): Promise<ProductEntity | null>;
}
