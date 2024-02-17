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
    price: 10000,
    status: IStatus.Active
  };

  const testInactiveProduct = {
    name: 'Inactive Product',
    price: 10000,
    status: IStatus.Inactive
  };

  test('should create a product /api/products', async () => {
    const { body } = await request(testServer.app)
      .post('/api/products')
      .send(testActiveProduct);

    expect(body).toEqual(expect.objectContaining({
      name: testActiveProduct.name,
      price: testActiveProduct.price,
      status: 'active',
    }));

    await ProductModel.findOneAndDelete({ name: testActiveProduct.name });
  });

  test('should get all products /api/products', async () => {
    await ProductModel.create(testActiveProduct);
    await ProductModel.create(testInactiveProduct);

    const { body } = await request(testServer.app)
      .get('/api/products')
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].name).toBe(testActiveProduct.name);
    expect(body[1].name).toBe(testInactiveProduct.name);

    await ProductModel.findOneAndDelete({ name: testActiveProduct.name });
    await ProductModel.findOneAndDelete({ name: testInactiveProduct.name });
  });

  test('should get active products /api/products/active', async () => {
    await ProductModel.create(testActiveProduct);
    await ProductModel.create(testInactiveProduct);

    const { body } = await request(testServer.app)
      .get('/api/products/active')
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(1);
    expect(body[0].name).toBe(testActiveProduct.name);

    await ProductModel.findOneAndDelete({ name: testActiveProduct.name });
    await ProductModel.findOneAndDelete({ name: testInactiveProduct.name });
  });

  test('should update product /api/products/:name', async () => {
    await ProductModel.create(testActiveProduct);

    const { body } = await request(testServer.app)
      .put(`/api/products/${testActiveProduct.name}`)
      .send({ name: 'Active Update' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      name: 'Active Update',
      price: 10000,
      status: IStatus.Active
    }));

    await ProductModel.findOneAndDelete({ name: testActiveProduct.name });
  });

  test('should delete product /api/products/:name', async () => {
    await ProductModel.create(testActiveProduct);

    const { body } = await request(testServer.app)
      .delete(`/api/products/${testActiveProduct.name}`)
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      name: 'Active Product',
      price: 10000,
      status: IStatus.Inactive
    }));
  });
});
