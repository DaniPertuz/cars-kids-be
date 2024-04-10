import { Request, Response } from 'express';
import { MongoProductDatasource } from '../../infrastructure/datasources/mongo-product.datasource';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/product-impl.repository';
import { ProductDTO } from '../../domain/dtos/product';
import { ProductEntity } from '../../domain/entities/product.entity';
import { IProduct, IStatus } from '../../interfaces';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';

export class ProductsController {
  readonly productRepo = new ProductRepositoryImpl(
    new MongoProductDatasource()
  );

  public getAllProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    
    if (error) return res.status(400).json({ error });
    
    const products = await this.productRepo.getAllProducts(paginationDto!);

    const { page: productPage, limit: limitPage, total, next, prev, products: data } = products;

    return res.json({
      page: productPage,
      limit: limitPage,
      total,
      next,
      prev,
      products: data.map(product => product.params)
    });
  };

  public getProductsByStatus = async (req: Request, res: Response) => {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    
    if (error) return res.status(400).json({ error });

    if (!(Object.values(IStatus).includes(status as IStatus))) {
      return res.status(400).json({ error: 'Estado de producto no válido' });
    }

    const products = await this.productRepo.getProductsByStatus(status as IStatus, paginationDto!);

    const { page: productPage, limit: limitPage, total, next, prev, products: data } = products;

    return res.json({
      page: productPage,
      limit: limitPage,
      total,
      next,
      prev,
      products: data.map(product => product.params)
    });
  };

  public getProduct = async (req: Request, res: Response) => {
    const { name } = req.params;

    const product = await this.productRepo.getProduct(name);

    return (product) ? res.json(product.params) : res.status(404).json({ error: `No se encontró el producto ${name}` });
  };

  public createProduct = async (req: Request, res: Response) => {
    const [error, productDto] = ProductDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const productDB = await this.productRepo.getProduct(productDto!.params.name);

    if (productDB) return res.status(400).json({ error: 'Ya existe producto con este nombre' });

    const productData: ProductEntity = ProductEntity.fromObject(productDto!.params);

    const product = (await this.productRepo.createProduct(productData)).params;

    return res.json(product);
  };

  public updateProduct = async (req: Request, res: Response) => {
    const { name } = req.params;
    const { name: newName, cost, price, status } = req.body;

    const productDB = await this.productRepo.getProduct(name);

    if (!productDB) return res.status(404).json({ error: 'Producto no encontrado' });

    const existingProduct = await this.productRepo.getProduct(newName);

    if (existingProduct) return res.status(404).json({ error: 'Ya existe un producto con este nombre' });

    const updatedProductData: IProduct = {
      name: newName,
      cost,
      price,
      status
    };

    const updatedProductEntity = ProductEntity.fromObject(updatedProductData);

    const updatedProduct = await this.productRepo.updateProduct(name, updatedProductEntity);

    return res.json(updatedProduct!.params);
  };

  public deleteProduct = async (req: Request, res: Response) => {
    const { name } = req.params;

    const productDB = await this.productRepo.getProduct(name);

    if (!productDB) return res.status(404).json({ error: 'Producto no encontrado' });

    const product = await this.productRepo.deleteProduct(name);

    return res.json(product!.params);
  };
}
