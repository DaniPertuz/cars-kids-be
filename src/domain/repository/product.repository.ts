import { ProductEntity } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract createProduct(product: ProductEntity): Promise<ProductEntity>;
  abstract getActiveProducts(): Promise<ProductEntity[]>;
  abstract getAllProducts(): Promise<ProductEntity[]>;
  abstract getProduct(name: string): Promise<ProductEntity | null>;
  abstract updateProduct(name: string, product: ProductEntity): Promise<ProductEntity | null>;
  abstract deleteProduct(name: string): Promise<ProductEntity | null>;
}