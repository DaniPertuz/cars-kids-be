import { Request, Response } from 'express';
import { MongoProductDatasource } from '../../infrastructure/datasources/mongo-product.datasource';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/product-impl.repository';
import { ProductDTO } from '../../domain/dtos/product';
import { ProductEntity } from '../../domain/entities/product.entity';
import { IProduct } from '../../interfaces';

export class ProductsController {
  readonly productRepo = new ProductRepositoryImpl(
    new MongoProductDatasource()
  );

  public getProducts = async (req: Request, res: Response) => {
    const vehicles = (await this.productRepo.getProducts()).map(vehicle => vehicle.params);

    return res.json(vehicles);
  };

  public getProduct = async (req: Request, res: Response) => {
    const { name } = req.params;

    const product = await this.productRepo.getProduct(name);

    return (product) ? res.json(product.params) : res.status(404).json({ error: `No se encontró el producto ${name}` });
  };

  public createProduct = async (req: Request, res: Response) => {
    const [error, productDto] = ProductDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const productData: ProductEntity = ProductEntity.fromObject(productDto!.params);

    const product = (await this.productRepo.createProduct(productData)).params;

    return res.json(product);
  };

  public updateProduct = async (req: Request, res: Response) => {
    const { name } = req.params;
    const { name: newName, payment, amount, status } = req.body;

    const productDB = await this.productRepo.getProduct(name);

    if (!productDB) return res.status(404).json({ error: 'Producto no encontrado' });

    const updatedProductData: IProduct = {
      name: newName,
      payment,
      amount,
      status
    };

    const updatedProductEntity = ProductEntity.fromObject(updatedProductData);

    const updatedVehicle = await this.productRepo.updateProduct(name, updatedProductEntity);

    return res.json(updatedVehicle?.params);
  };

  public deleteProduct = async (req: Request, res: Response) => {
    const { name } = req.params;

    const productDB = await this.productRepo.getProduct(name);

    if (!productDB) return res.status(404).json({ error: 'Producto no encontrado' });

    const product = await this.productRepo.deleteProduct(name);

    return res.json(product);
  };
}
