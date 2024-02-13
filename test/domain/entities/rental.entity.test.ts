import { RentalEntity } from '../../../src/domain/entities/rental.entity';
import { IPayment } from '../../../src/interfaces';

describe('Rental entity', () => {
  const data = {
    client: 'Test Name',
    time: 15,
    date: '01-01-2020',
    vehicle: 'd3ba2daad17250e579833f0e',
    payment: IPayment.Cash,
    amount: 10000,
    exception: 'Test exception'
  };

  test('should create a RentalEntity instance', () => {
    const user = new RentalEntity(data);

    expect(user).toBeInstanceOf(RentalEntity);
    expect(user.params.client).toBe(data.client);
    expect(user.params.time).toBe(data.time);
    expect(user.params.date).toBe(data.date);
    expect(user.params.vehicle).toBe(data.vehicle);
    expect(user.params.payment).toBe(data.payment);
    expect(user.params.amount).toBe(data.amount);
    expect(user.params.exception).toBe(data.exception);
  });

  test('should create a RentalEntity from object', () => {
    const user = RentalEntity.fromObject(data);
    
    expect(user).toBeInstanceOf(RentalEntity);
    expect(typeof user.params.time).toBe('number');
    expect(typeof user.params.date).toBe('string');
    expect(typeof user.params.vehicle).toBe('string');
    expect(typeof user.params.payment).toBe('string');
    expect(typeof user.params.amount).toBe('number');
    expect(typeof user.params.exception).toBe('string');
  });
});
