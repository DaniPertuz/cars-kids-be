import { ProductEntity } from '../entities/product.entity';

export abstract class ProductDatasource {
  abstract createProduct(product: ProductEntity): Promise<ProductEntity>;
  abstract getAllProducts(): Promise<ProductEntity[]>;
  abstract getProduct(name: string): Promise<ProductEntity | null>;
  abstract updateProduct(name: string, product: ProductEntity): Promise<ProductEntity | null>;
  abstract deleteProduct(name: string): Promise<ProductEntity | null>;
}
