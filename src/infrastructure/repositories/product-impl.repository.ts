import { ProductDatasource } from '../../domain/datasources/product.datasource';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repository/product.repository';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly productDatasource: ProductDatasource) { }

  createProduct(product: ProductEntity): Promise<ProductEntity> {
    return this.productDatasource.createProduct(product);
  }

  getAllProducts(): Promise<ProductEntity[]> {
    return this.productDatasource.getAllProducts();
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
