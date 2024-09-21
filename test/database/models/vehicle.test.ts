import { connect, disconnect } from '../../../src/database';
import { ICategory, IStatus, IVehicleSize } from '../../../src/interfaces/index';
import { VehicleModel } from '../../../src/database/models';

describe('Vehicle model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return VehicleModel', async () => {
    const vehicleData = {
      nickname: 'Test Nickame',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      rentalInfo: [
        { "time": 15, "price": 10000 },
        { "time": 20, "price": 14000 },
        { "time": 30, "price": 18000 }
      ],
      status: IStatus.Active
    };

    const vehicle = await VehicleModel.create(vehicleData);

    expect(vehicle.toJSON()).toEqual(expect.objectContaining({
      ...vehicleData,
      rentalInfo: expect.arrayContaining([
        expect.objectContaining({ time: 15, price: 10000 }),
        expect.objectContaining({ time: 20, price: 14000 }),
        expect.objectContaining({ time: 30, price: 18000 })
      ]),
      _id: expect.any(Object)
    }));

    await VehicleModel.findOneAndDelete({ nickname: vehicle.nickname });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      nickname: { type: String, required: true, unique: true },
      img: { type: String, required: false, default: '' },
      category: { type: String, required: true },
      color: { type: String, required: true },
      size: {
        type: String,
        enum: {
          values: ['S', 'M', 'L'],
          message: '{VALUE} no es un tamaño válido',
          default: 'M',
          required: true
        }
      },
      rentalInfo: [{
        time: { type: Number, required: true, default: 0 },
        price: { type: Number, required: true, default: 0 },
        _id: false
      }],
      status: {
        type: String,
        enum: {
          values: ['active', 'inactive'],
          message: '{VALUE} no es un estado válido',
          default: 'active',
          required: true
        }
      }
    };

    const schema = VehicleModel.schema.obj;

    expect(schema).toEqual(expect.objectContaining(expectedSchema));
  });
});
