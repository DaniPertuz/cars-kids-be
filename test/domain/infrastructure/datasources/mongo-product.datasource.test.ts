import { connect, disconnect } from '../../../../src/database';
import { ProductModel } from '../../../../src/database/models';
import { ProductEntity } from '../../../../src/domain/entities/product.entity';
import { MongoProductDatasource } from '../../../../src/infrastructure/datasources/mongo-product.datasource';
import { IStatus } from '../../../../src/interfaces';

describe('Mongo Product datasource', () => {

  const productDatasource = new MongoProductDatasource();

  const product = new ProductEntity({
    name: 'Test Product',
    price: 10000,
    status: IStatus.Active
  });

  const inactiveProduct = new ProductEntity({
    name: 'Test Product',
    price: 10000,
    status: IStatus.Inactive
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await ProductModel.deleteMany();
    await disconnect();
  });

  test('should create a product', async () => {

    const productDB = await productDatasource.createProduct(product);

    expect(productDB).toBeInstanceOf(ProductEntity);

    await ProductModel.findOneAndDelete({ name: productDB.params.name });
  });

  test('should throw an error if failed to create a product', async () => {
    jest.spyOn(ProductModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(productDatasource.createProduct(product)).rejects.toThrow('Error al crear producto: Error: Test error');
  });

  test('should get all products', async () => {
    await productDatasource.createProduct(product);
    await productDatasource.createProduct(inactiveProduct);

    const products = await productDatasource.getAllProducts();

    expect(products.length).toBe(2);
    expect(products[0].params.name).toBe(product.params.name);

    await ProductModel.findOneAndDelete({ name: product.params.name });
    await ProductModel.findOneAndDelete({ name: inactiveProduct.params.name });
  });

  test('should throw an error if failed to get all products', async () => {
    jest.spyOn(ProductModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(productDatasource.getAllProducts()).rejects.toThrow('Error al obtener todos los productos: Error: Test error');
  });

  test('should get active products', async () => {
    await productDatasource.createProduct(product);
    await productDatasource.createProduct(inactiveProduct);

    const products = await productDatasource.getActiveProducts();

    expect(products.length).toBe(1);
    expect(products[0].params.name).toBe(product.params.name);

    await ProductModel.findOneAndDelete({ name: product.params.name });
    await ProductModel.findOneAndDelete({ name: inactiveProduct.params.name });
  });

  test('should throw an error if failed to get active products', async () => {
    jest.spyOn(ProductModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(productDatasource.getActiveProducts()).rejects.toThrow('Error al obtener todos los productos activos: Error: Test error');
  });

  test('should get product by name', async () => {
    const productTest = new ProductEntity({
      name: 'Testing Product',
      price: 10000,
      status: IStatus.Active
    });

    await productDatasource.createProduct(productTest);

    const productDB = await productDatasource.getProduct('Testing Product');
    const productDB2 = await productDatasource.getProduct('Testing Name');

    expect(productDB).toBeInstanceOf(ProductEntity);
    expect(productDB?.params.name).toEqual(productTest.params.name);
    expect(productDB2).toBeNull();
  });

  test('should throw an error if failed to get product', async () => {
    jest.spyOn(ProductModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(productDatasource.getProduct('Nickname')).rejects.toThrow('Error al obtener producto: Error: Test error');
  });

  test('should update product', async () => {
    const productTest = new ProductEntity({
      name: 'Testing Product',
      price: 10000,
      status: IStatus.Active
    });

    await productDatasource.createProduct(productTest);

    const updatedProduct = new ProductEntity({
      name: 'Testing Product Updated',
      price: 10000,
      status: IStatus.Active
    });

    const productDB = await productDatasource.updateProduct('Testing Product', updatedProduct);
    const productDB2 = await productDatasource.updateProduct('Testing Name', updatedProduct);

    expect(productDB).toEqual(updatedProduct);
    expect(productDB2).toBeNull();
  });

  test('should throw an error when updating product', async () => {
    const name = 'product_name';
    const product = new ProductEntity({
      name: 'Testing Product Updated',
      price: 10000,
      status: IStatus.Active
    });

    const error = new Error('Failed to update product');

    const mockFindOneAndUpdate = jest.spyOn(ProductModel, 'findOneAndUpdate');

    mockFindOneAndUpdate.mockRejectedValue(error);

    await expect(productDatasource.updateProduct(name, product)).rejects.toThrow(`Error al actualizar producto: ${error}`);

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ name }, product.params, { new: true });

    mockFindOneAndUpdate.mockRestore();
  });

  test('should delete product', async () => {
    const productTest = new ProductEntity({
      name: 'Testing Product',
      price: 10000,
      status: IStatus.Active
    });

    await productDatasource.createProduct(productTest);

    const productDB = await productDatasource.deleteProduct('Testing Product');
    const productDB2 = await productDatasource.deleteProduct('Testing Name');

    expect(productDB?.params.status).toBe(IStatus.Inactive);
    expect(productDB2).toBeNull();
  });

  test('should throw an error when deleting a product', async () => {
    const name = 'product_name';
    const error = new Error('Test Error');

    const mockFindOneAndUpdate = jest.spyOn(ProductModel, 'findOneAndUpdate');

    mockFindOneAndUpdate.mockRejectedValue(error);

    await expect(productDatasource.deleteProduct(name)).rejects.toThrow(`Error al eliminar producto: ${error}`);

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ name }, { status: 'inactive' }, { new: true });

    mockFindOneAndUpdate.mockRestore();
  });
});
