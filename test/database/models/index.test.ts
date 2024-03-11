import { BudgetModel, ProductModel, PurchaseModel, RentalModel, UserModel, VehicleModel } from '../../../src/database/models';

describe('Exports', () => {
  test('BudgetModel is exported correctly', () => {
    expect(BudgetModel).toBeDefined();
  });

  test('ProductModel is exported correctly', () => {
    expect(ProductModel).toBeDefined();
  });

  test('PurchaseModel is exported correctly', () => {
    expect(PurchaseModel).toBeDefined();
  });

  test('RentalModel is exported correctly', () => {
    expect(RentalModel).toBeDefined();
  });

  test('UserModel is exported correctly', () => {
    expect(UserModel).toBeDefined();
  });

  test('VehicleModel is exported correctly', () => {
    expect(VehicleModel).toBeDefined();
  });
});
