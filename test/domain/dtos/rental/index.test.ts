import { RentalDTO } from '../../../../src/domain/dtos/rental';
import { IPayment, IRental } from '../../../../src/interfaces';

describe('RentalDTO', () => {

  const validObject: IRental = {
    _id: '1223',
    client: 'NN Test',
    time: 15,
    date: '01-24-2023',
    vehicle: '15c42daad17250e579833f0e',
    payment: IPayment.Cash,
    amount: 10000,
    user: 'd4ba2daad17250e579833f0e',
    exception: ''
  };

  describe('create', () => {
    test('should return error when client field is missing', () => {
      const invalidObject = {
        time: 15,
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        payment: IPayment.Cash,
        user: 'd4ba2daad17250e579833f0e',
        amount: 10000
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Nombre de cliente es requerido');
    });

    test('should return error when time field is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        payment: IPayment.Cash,
        user: 'd4ba2daad17250e579833f0e',
        amount: 10000
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Tiempo es requerido');
    });

    test('should return error when date field is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        time: 15,
        vehicle: '15c42daad17250e579833f0e',
        payment: IPayment.Cash,
        user: 'd4ba2daad17250e579833f0e',
        amount: 10000
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Fecha es requerida');
    });

    test('should return error when vehicle field is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        time: 15,
        date: '01-24-2023',
        payment: IPayment.Cash,
        user: 'd4ba2daad17250e579833f0e',
        amount: 10000
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Vehículo es requerido');
    });

    test('should return error when payment field is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        time: 15,
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        user: 'd4ba2daad17250e579833f0e',
        amount: 10000
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Tipo de pago es requerido');
    });

    test('should return error when amount field is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        time: 15,
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        user: 'd4ba2daad17250e579833f0e',
        payment: IPayment.Cash
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Monto es requerido');
    });

    test('should return error when user field is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        time: 15,
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        payment: IPayment.Cash,
        amount: 10000
      };
      const [error] = RentalDTO.create(invalidObject);

      expect(error).toBe('Usuario es requerido');
    });

    test('should return error for invalid user ID', () => {
      const invalidUserId = 'invalidUserId';
      const invalidRental = {
        client: 'NN Test',
        time: 15,
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        payment: IPayment.Cash,
        amount: 10000,
        user: invalidUserId
      };
  
      const [error, rentalDTO] = RentalDTO.create(invalidRental);
  
      expect(error).toBe('Invalid User ID');
      expect(rentalDTO).toBeUndefined();
  });

    test('should return RentalDTO instance when object is valid', () => {
      const [, rentalDTO] = RentalDTO.create(validObject);

      expect(rentalDTO).toBeInstanceOf(RentalDTO);
    });
  });

  describe('update', () => {
    test('should return error when ID is missing', () => {
      const invalidObject = {
        client: 'NN Test',
        time: 15,
        date: '01-24-2023',
        vehicle: '15c42daad17250e579833f0e',
        payment: IPayment.Cash,
        amount: 10000,
        user: 'd4ba2daad17250e579833f0e',
        exception: ''
      };

      const [error, rentalDTO] = RentalDTO.update(invalidObject);

      expect(error).toBe('ID de alquiler no es válido');
      expect(rentalDTO).toBeUndefined();
    });

    test('should return RentalDTO instance with default ID when object is valid', () => {
      const [, rentalDTO] = RentalDTO.update(validObject);

      expect(rentalDTO).toBeInstanceOf(RentalDTO);
    });
  });
});
