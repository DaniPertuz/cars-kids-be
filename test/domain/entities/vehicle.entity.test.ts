import { VehicleEntity } from '../../../src/domain/entities/vehicle.entity';
import { ICategory, IStatus, IVehicleSize } from '../../../src/interfaces';

describe('Vehicle entity', () => {
  const data = {
    nickname: 'Test Name',
    img: 'Test image',
    category: ICategory.Car,
    color: '#000000',
    rentalInfo: [
      { "time": 15, "price": 10000 },
      { "time": 20, "price": 14000 },
      { "time": 30, "price": 18000 }
    ],
    size: IVehicleSize.Large,
    status: IStatus.Active
  };

  test('should create a VehicleEntity instance', () => {
    const vehicle = new VehicleEntity(data);

    expect(vehicle).toBeInstanceOf(VehicleEntity);
    expect(vehicle.params.nickname).toBe(data.nickname);
    expect(vehicle.params.img).toBe(data.img);
    expect(vehicle.params.category).toBe(data.category);
    expect(vehicle.params.color).toBe(data.color);
    expect(vehicle.params.rentalInfo).toBe(data.rentalInfo);
    expect(vehicle.params.size).toBe(data.size);
    expect(vehicle.params.status).toBe(data.status);
  });

  test('should create a VehicleEntity from object', () => {
    const vehicle = VehicleEntity.fromObject(data);
    
    expect(vehicle).toBeInstanceOf(VehicleEntity);
    expect(vehicle.params.nickname).toBe('Test Name');
    expect(vehicle.params.img).toBe('Test image');
    expect(vehicle.params.category).toBe(ICategory.Car);
    expect(vehicle.params.color).toBe('#000000');
    expect(vehicle.params.rentalInfo?.length).toBe(3);
    expect(vehicle.params.size).toBe(IVehicleSize.Large);
    expect(vehicle.params.status).toBe(IStatus.Active);
  });
});
