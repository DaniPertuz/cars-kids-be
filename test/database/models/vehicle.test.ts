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
      status: IStatus.Active
    };

    const vehicle = await VehicleModel.create(vehicleData);

    expect(vehicle.toJSON()).toEqual(expect.objectContaining({
      ...vehicleData,
      _id: expect.any(Object)
    }));

    await VehicleModel.findOneAndDelete({ nickname: vehicle.nickname });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      nickname: { type: expect.any(Function), required: true, unique: true },
      img: { type: expect.any(Function), required: false, default: '' },
      category: { type: expect.any(Function), required: true },
      color: { type: expect.any(Function), required: true },
      size: {
        type: expect.any(Function),
        enum: {
          values: ['S', 'M', 'L'],
          message: '{VALUE} no es un tamaño válido',
          default: 'M',
          required: true
        }
      },
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

    const schema = VehicleModel.schema.obj;

    expect(schema).toEqual(expect.objectContaining(expectedSchema));
  });
});
