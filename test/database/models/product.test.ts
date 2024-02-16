import { connect, disconnect } from '../../../src/database';
import { IStatus } from '../../../src/interfaces';
import { ProductModel } from '../../../src/database/models';

describe('Product model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return ProductModel', async () => {
    const productData = {
      name: 'Test Name',
      price: 10000,
      status: IStatus.Active
    };

    const product = await ProductModel.create(productData);

    expect(product.toJSON()).toEqual(expect.objectContaining(productData));

    await ProductModel.findOneAndDelete({ name: product.name });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      name: { type: expect.any(Function), required: true },
      price: { type: expect.any(Function), required: true },
      status: {
        type: expect.any(Function),
        enum: {
          values: ['active', 'inactive'],
          message: '{VALUE} no es un estado válido',
          default: 'active',
          required: true
        }
      }
    };

    const schema = ProductModel.schema.obj;

    expect(schema).toEqual(expect.objectContaining(expectedSchema));
  });
});
