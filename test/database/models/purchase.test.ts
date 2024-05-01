import { Schema } from 'mongoose';
import { connect, disconnect } from '../../../src/database';
import { ProductModel, PurchaseModel } from '../../../src/database/models';
import { IPayment, IStatus } from '../../../src/interfaces';

describe('Purchase model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return PurchaseModel', async () => {
    const productData = {
      name: 'Purchase Product',
      cost: 8000,
      price: 10000,
      payment: IPayment.Cash,
      status: IStatus.Active
    };

    const product = await ProductModel.create(productData);
    const productId = product._id;

    const purchaseData = {
      product: productId,
      quantity: 1,
      price: 10000,
      payment: IPayment.Cash,
      purchaseDate: '2000-11-10T05:00:00.000Z',
      user: '65dba23a1e356e83da7c2e1a'
    };

    const purchase = await PurchaseModel.create(purchaseData);

    expect(purchase.toJSON()).toEqual(expect.objectContaining({
      product: productId,
      quantity: 1,
      price: 10000,
      payment: IPayment.Cash,
      purchaseDate: new Date('2000-11-10T05:00:00.000Z')
    }));

    await PurchaseModel.findOneAndDelete({ purchaseDate: purchase.purchaseDate });
    await ProductModel.findOneAndDelete({ name: 'Purchase Product' });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      payment: {
        type: String,
        enum: {
          values: ['cash', 'nequi', 'bancolombia', 'daviplata'],
          message: '{VALUE} no es un medio de pago válido',
          default: 'cash',
          required: true
        }
      },
      purchaseDate: { type: Date, required: true },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    };

    const schema = PurchaseModel.schema.obj;

    expect(schema).toEqual(expectedSchema);
  });
});
