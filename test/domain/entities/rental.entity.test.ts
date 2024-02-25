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
    user: 'd4ba2daad17250e579833f0e',
    exception: 'Test exception'
  };

  test('should create a RentalEntity instance', () => {
    const rental = new RentalEntity(data);

    expect(rental).toBeInstanceOf(RentalEntity);
    expect(rental.params.client).toBe(data.client);
    expect(rental.params.time).toBe(data.time);
    expect(rental.params.date).toBe(data.date);
    expect(rental.params.vehicle).toBe(data.vehicle);
    expect(rental.params.payment).toBe(data.payment);
    expect(rental.params.amount).toBe(data.amount);
    expect(rental.params.exception).toBe(data.exception);
  });

  test('should create a RentalEntity from object', () => {
    const rental = RentalEntity.fromObject(data);
    
    expect(rental).toBeInstanceOf(RentalEntity);
    expect(typeof rental.params.time).toBe('number');
    expect(typeof rental.params.date).toBe('string');
    expect(typeof rental.params.vehicle).toBe('string');
    expect(typeof rental.params.payment).toBe('string');
    expect(typeof rental.params.amount).toBe('number');
    expect(typeof rental.params.user).toBe('string');
    expect(typeof rental.params.exception).toBe('string');
  });
});
