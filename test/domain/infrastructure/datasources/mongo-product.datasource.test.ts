import { connect, disconnect } from '../../../../src/database';
import { ProductModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
import { ProductEntity } from '../../../../src/domain/entities/product.entity';
import { MongoProductDatasource } from '../../../../src/infrastructure/datasources/mongo-product.datasource';
import { IStatus } from '../../../../src/interfaces';

describe('Mongo Product datasource', () => {

  const productDatasource = new MongoProductDatasource();

  beforeAll(async () => {
    await connect();
  });

  const testProduct = new ProductEntity({
    name: 'Test Product',
    cost: 8000,
    price: 10000,
    status: IStatus.Active
  });

  const activeProduct = new ProductEntity({
    name: 'Active Product',
    cost: 8000,
    price: 10000,
    status: IStatus.Active
  });

  const activeProduct2 = new ProductEntity({
    name: 'Active Product 2',
    cost: 6000,
    price: 8000,
    status: IStatus.Active
  });

  const inactiveProduct = new ProductEntity({
    name: 'Inactive Product',
    cost: 8000,
    price: 10000,
    status: IStatus.Inactive
  });

  afterAll(async () => {
    await disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await ProductModel.deleteMany();
  });

  test('should create a product', async () => {
    const productDB = await productDatasource.createProduct(testProduct);

    expect(productDB).toBeInstanceOf(ProductEntity);

    await ProductModel.findOneAndDelete({ name: productDB.params.name });
  });

  test('should throw an error if failed to create a product', async () => {
    jest.spyOn(ProductModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(productDatasource.createProduct(testProduct)).rejects.toThrow('Error al crear producto: Error: Test error');
  });

  test('should get all products', async () => {
    await productDatasource.createProduct(activeProduct);
    await productDatasource.createProduct(inactiveProduct);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await productDatasource.getAllProducts(paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.products.length).toBe(1);
    expect(pagination1.products[0].params.name).toBe(activeProduct.params.name);
    expect(pagination1.next).toBe(`/products?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await productDatasource.getAllProducts(paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.products.length).toBe(1);
    expect(pagination2.products[0].params.name).toBe(inactiveProduct.params.name);
    expect(pagination2.prev).toBe(`/products?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    await ProductModel.findOneAndDelete({ name: activeProduct.params.name });
    await ProductModel.findOneAndDelete({ name: inactiveProduct.params.name });
  });

  test('should get products by status', async () => {
    const [error, paginationDto] = PaginationDto.create(1, 1);
    const productTest = new ProductEntity({
      name: 'Status Name',
      cost: 10000,
      price: 12000,
      status: IStatus.Active
    });

    await productDatasource.createProduct(productTest);

    const { products } = await productDatasource.getProductsByStatus(IStatus.Active, paginationDto!);

    expect(error).toBeUndefined();
    expect(products.length).toBeGreaterThanOrEqual(1);
    expect(products[0].params.name).toBe('Status Name');
  });

  test('should getProductsByStatus generate prev and next URLs', async () => {
    await productDatasource.createProduct(activeProduct);
    await productDatasource.createProduct(activeProduct2);
    await productDatasource.createProduct(inactiveProduct);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await productDatasource.getProductsByStatus(IStatus.Active, paginationDto1!);
    
    expect(error1).toBeUndefined();
    expect(pagination1.products.length).toBe(1);
    expect(pagination1.products[0].params.name).toBe(activeProduct.params.name);
    expect(pagination1.next).toBe(`/products/status/${IStatus.Active}?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await productDatasource.getProductsByStatus(IStatus.Active, paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.products.length).toBe(1);
    expect(pagination2.products[0].params.name).toBe(activeProduct2.params.name);
    expect(pagination2.prev).toBe(`/products/status/${IStatus.Active}?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
  });

  test('should throw an error if failed to get all products', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    jest.spyOn(ProductModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(productDatasource.getAllProducts(paginationDto!)).rejects.toThrow('Error al obtener todos los productos: Error: Test error');
  });

  test('should get product by name', async () => {
    const productTest = new ProductEntity({
      name: 'Testing Product',
      cost: 8000,
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

    await expect(productDatasource.getProduct('wrong_name')).rejects.toThrow('Error al obtener producto: Error: Test error');
  });

  test('should update product', async () => {
    const productTest = new ProductEntity({
      name: 'New Testing Product',
      cost: 8000,
      price: 10000,
      status: IStatus.Active
    });

    await productDatasource.createProduct(productTest);

    const updatedProduct = new ProductEntity({
      name: 'Testing Product Updated',
      cost: 8000,
      price: 10000,
      status: IStatus.Active
    });

    const productDB = await productDatasource.updateProduct('New Testing Product', updatedProduct);
    const productDB2 = await productDatasource.updateProduct('Testing Name', updatedProduct);

    expect(productDB?.params).toEqual(expect.objectContaining({
      name: 'Testing Product Updated',
      price: 10000,
      status: IStatus.Active
    }));
    expect(productDB2).toBeNull();
  });

  test('should throw an error when updating product', async () => {
    const name = 'product_name';
    const product = new ProductEntity({
      name: 'Testing Product Updated',
      cost: 8000,
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
      name: 'Testing Product Delete',
      cost: 8000,
      price: 10000,
      status: IStatus.Active
    });

    await productDatasource.createProduct(productTest);

    const productDB = await productDatasource.deleteProduct('Testing Product Delete');
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
