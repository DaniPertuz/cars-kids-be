import { Schema } from 'mongoose';
import { connect, disconnect } from '../../../src/database';
import { RentalModel, VehicleModel } from '../../../src/database/models';
import { ICategory, IPayment, IStatus, IVehicleSize } from '../../../src/interfaces';

describe('Rental model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return RentalModel', async () => {
    const vehicleData = {
      nickname: 'Testing Nickname',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    };

    const vehicle = await VehicleModel.create(vehicleData);

    const vehicleID = vehicle._id;

    const rentalData = {
      client: 'Test Client',
      time: 15,
      date: new Date('2000-11-10T05:00:00.000Z'),
      vehicle: vehicleID,
      payment: IPayment.Cash,
      amount: 100000,
      user: 'd4ba2daad17250e579833f0e',
      desk: 'd4ba2daad17250e579833f1e',
      exception: ''
    };

    const rental = await RentalModel.create(rentalData);

    expect(rental.toJSON()).toEqual(expect.objectContaining({
      client: 'Test Client',
      time: 15,
      date: new Date('2000-11-10T05:00:00.000Z'),
      vehicle: vehicleID,
      payment: IPayment.Cash,
      amount: 100000,
      exception: ''
    }));

    await RentalModel.findOneAndDelete({ client: 'Test Client' });
    await VehicleModel.findByIdAndDelete(vehicleID);
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      client: { type: String, required: true, default: 'NN' },
      time: { type: Number, required: true },
      date: { type: Date, required: true },
      vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
      payment: {
        type: String,
        enum: {
          values: ['cash', 'nequi', 'bancolombia', 'daviplata'],
          message: '{VALUE} no es un medio de pago válido',
          default: 'cash',
          required: true
        }
      },
      amount: { type: Number, required: true },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      desk: { type: Schema.Types.ObjectId, ref: 'Desk', required: true },
      exception: { type: String, required: false }
    };

    const schema = RentalModel.schema.obj;

    expect(schema).toEqual(expectedSchema);
  });
});
