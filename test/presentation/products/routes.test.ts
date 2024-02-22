import request from 'supertest';
import { testServer } from '../../test-server';
import { ProductModel } from '../../../src/database/models';
import { IStatus } from '../../../src/interfaces';

describe('Products routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await ProductModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const testActiveProduct = {
    name: 'Active Product',
    cost: 8000,
    price: 10000,
    status: IStatus.Active
  };

  const testInactiveProduct = {
    name: 'Inactive Product',
    cost: 8000,
    price: 10000,
    status: IStatus.Inactive
  };

  test('should create a product /api/products', async () => {
    const { body } = await request(testServer.app)
      .post('/api/products')
      .send(testActiveProduct);

    expect(body).toEqual(expect.objectContaining({
      name: testActiveProduct.name,
      cost: testActiveProduct.cost,
      price: testActiveProduct.price,
      status: IStatus.Active,
    }));
  });

  test('should return an error if a product field is not provided /api/products', async () => {
    const invalidProduct = {
      cost: 8000,
      price: 10000,
      status: IStatus.Active
    };

    const { body } = await request(testServer.app)
      .post('/api/products')
      .send(invalidProduct);

    expect(body).toEqual({ error: 'Nombre de producto es requerido' });
  });

  test('should validate if provided name already exists before creating /api/products/', async () => {
    await ProductModel.create(testActiveProduct);

    const { body } = await request(testServer.app)
      .post('/api/products')
      .send(testActiveProduct);

    expect(body).toEqual({ error: 'Ya existe producto con este nombre' });
  });

  test('should get all products /api/products', async () => {
    await ProductModel.create(testActiveProduct);
    await ProductModel.create(testInactiveProduct);

    const { body } = await request(testServer.app)
      .get('/api/products')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.products.length).toBe(2);
    expect(body.products[0].name).toBe(testActiveProduct.name);
    expect(body.products[1].name).toBe(testInactiveProduct.name);

    await ProductModel.findOneAndDelete({ name: testActiveProduct.name });
    await ProductModel.findOneAndDelete({ name: testInactiveProduct.name });
  });

  test('should get product /api/products/:name', async () => {
    await ProductModel.create(testActiveProduct);

    const response = await request(testServer.app)
      .get(`/api/products/${testActiveProduct.name}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining(testActiveProduct));
  });

  test('should return a 404 response if product was not found /api/products/:name', async () => {
    const response = await request(testServer.app)
      .get(`/api/products/${testActiveProduct.name}`)
      .expect(404);

    expect(response.body).toEqual(expect.objectContaining({ error: `No se encontró el producto ${testActiveProduct.name}` }));
  });

  test('should update product /api/products/:name', async () => {
    await ProductModel.create(testActiveProduct);

    const { body } = await request(testServer.app)
      .put(`/api/products/${testActiveProduct.name}`)
      .send({ name: 'Active Update' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      name: 'Active Update',
      cost: 8000,
      price: 10000,
      status: IStatus.Active
    }));

    await ProductModel.findOneAndDelete({ name: testActiveProduct.name });
  });

  test('should return a not found request if product to update was not found /api/products/:name', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/products/${testActiveProduct.name}`)
      .send({ name: 'Active Update' })
      .expect(404);

    expect(body).toEqual({ error: 'Producto no encontrado' });
  });

  test('should delete product /api/products/:name', async () => {
    await ProductModel.create(testActiveProduct);

    const { body } = await request(testServer.app)
      .delete(`/api/products/${testActiveProduct.name}`)
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      name: 'Active Product',
      cost: 8000,
      price: 10000,
      status: IStatus.Inactive
    }));
  });

  test('should return a not found request if product to delete was not found /api/products/:name', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/products/${testActiveProduct.name}`)
      .expect(404);

    expect(body).toEqual({ error: 'Producto no encontrado' });
  });
});
