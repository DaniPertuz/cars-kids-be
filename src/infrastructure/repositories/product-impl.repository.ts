import { ProductDatasource } from '../../domain/datasources/product.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repository/product.repository';
import { ProductQueryResult } from '../../interfaces';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly productDatasource: ProductDatasource) { }

  createProduct(product: ProductEntity): Promise<ProductEntity> {
    return this.productDatasource.createProduct(product);
  }

  getAllProducts(paginationDto: PaginationDto): Promise<ProductQueryResult> {
    return this.productDatasource.getAllProducts(paginationDto);
  }

  getProduct(name: string): Promise<ProductEntity | null> {
    return this.productDatasource.getProduct(name);
  }

  updateProduct(name: string, product: ProductEntity): Promise<ProductEntity | null> {
    return this.productDatasource.updateProduct(name, product);
  }

  deleteProduct(name: string): Promise<ProductEntity | null> {
    return this.productDatasource.deleteProduct(name);
  }  
}
