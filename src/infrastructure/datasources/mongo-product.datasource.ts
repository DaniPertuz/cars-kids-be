import { ProductModel } from '../../database/models';
import { ProductDatasource } from '../../domain/datasources/product.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CustomError } from '../../domain/errors';
import { IStatus, ProductQueryResult } from '../../interfaces';

export class MongoProductDatasource implements ProductDatasource {
  async createProduct(product: ProductEntity): Promise<ProductEntity> {
    try {
      const data = await ProductModel.create(product.params);

      return ProductEntity.fromObject(data);
    } catch (error) {
      throw CustomError.serverError(`Error al crear producto: ${error}`);
    }
  }

  async getAllProducts(paginationDto: PaginationDto): Promise<ProductQueryResult> {
    try {
      const { page, limit } = paginationDto;

      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find({})
          .sort({ name: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
      ]);

      return {
        page,
        limit,
        total,
        next: ((page * limit) < total) ? `/products?page=${(page + 1)}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/products?page=${(page - 1)}&limit=${limit}` : null,
        products: products.map(ProductEntity.fromObject)
      };
    } catch (error) {
      throw CustomError.serverError(`Error al obtener todos los productos: ${error}`);
    }
  }

  async getProductsByStatus(status: IStatus, paginationDto: PaginationDto): Promise<ProductQueryResult> {
    try {
      const { page, limit } = paginationDto;

      const [total, products] = await Promise.all([
        ProductModel.countDocuments({ status }),
        ProductModel.find({ status })
          .sort({ name: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
      ]);

      return {
        page,
        limit,
        total,
        next: ((page * limit) < total) ? `/products/status/${status}?page=${(page + 1)}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/products/status/${status}?page=${(page - 1)}&limit=${limit}` : null,
        products: products.map(ProductEntity.fromObject)
      };
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por estado: ${error}`);
    }
  }

  async getProduct(name: string): Promise<ProductEntity | null> {
    try {
      const productData = await ProductModel.findOne({ name });

      return productData ? ProductEntity.fromObject(productData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al obtener producto: ${error}`);
    }
  }

  async updateProduct(name: string, product: ProductEntity): Promise<ProductEntity | null> {
    try {
      const productData = await ProductModel.findOneAndUpdate({ name }, product.params, { new: true });

      return productData ? ProductEntity.fromObject(productData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar producto: ${error}`);
    }
  }

  async deleteProduct(name: string): Promise<ProductEntity | null> {
    try {
      const product = await ProductModel.findOneAndUpdate({ name }, { status: IStatus.Inactive }, { new: true });
      return product ? ProductEntity.fromObject(product) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar producto: ${error}`);
    }
  }
}
