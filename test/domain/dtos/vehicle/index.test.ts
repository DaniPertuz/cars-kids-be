import { ICategory, IStatus, IVehicle, IVehicleSize } from '../../../../src/interfaces';
import { VehicleDTO } from '../../../../src/domain/dtos/vehicle';

describe('VehicleDTO', () => {
  const validObject: IVehicle = {
    nickname: 'Test Vehicle',
    category: ICategory.Car,
    color: '#000000',
    size: IVehicleSize.Large,
    status: IStatus.Active
  };

  describe('create', () => {
    test('should return error when nickname field is missing', () => {
      const invalidObject = {
        category: ICategory.Car,
        color: '#000000',
        size: IVehicleSize.Large,
        status: IStatus.Active
      };
      const [error, vehicleDTO] = VehicleDTO.create(invalidObject);

      expect(error).toBe('Apodo de vehículo es requerido');
      expect(vehicleDTO).toBeUndefined();
    });

    test('should return error when category field is missing', () => {
      const invalidObject = {
        nickname: 'Test Vehicle',
        color: '#000000',
        size: IVehicleSize.Large,
        status: IStatus.Active
      };
      const [error, vehicleDTO] = VehicleDTO.create(invalidObject);

      expect(error).toBe('Categoría de vehículo es requerida');
      expect(vehicleDTO).toBeUndefined();
    });

    test('should return error when color field is missing', () => {
      const invalidObject = {
        nickname: 'Test Vehicle',
        category: ICategory.Car,
        size: IVehicleSize.Large,
        status: IStatus.Active
      };
      const [error, vehicleDTO] = VehicleDTO.create(invalidObject);

      expect(error).toBe('Color de vehículo es requerido');
      expect(vehicleDTO).toBeUndefined();
    });

    test('should return error when size field is missing', () => {
      const invalidObject = {
        nickname: 'Test Vehicle',
        category: ICategory.Car,
        color: '#000000',
        status: IStatus.Active
      };
      const [error, vehicleDTO] = VehicleDTO.create(invalidObject);

      expect(error).toBe('Tamaño de vehículo es requerido');
      expect(vehicleDTO).toBeUndefined();
    });

    test('should return VehicleDTO instance when object is valid', () => {
      const [error, vehicleDTO] = VehicleDTO.create(validObject);

      expect(error).toBeUndefined();
      expect(vehicleDTO).toBeInstanceOf(VehicleDTO);
    });
  });
});
