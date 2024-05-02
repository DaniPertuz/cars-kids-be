import { IDesk } from '../../../../src/interfaces';
import { DeskDTO } from '../../../../src/domain/dtos/desk/index';

describe('DeskDTO', () => {
  const validObject: IDesk = {
    name: 'Valid Desk'
  };

  describe('create', () => {
    test('should return error when name field is missing', () => {
      const invalidObject = {};
      const [error, productDTO] = DeskDTO.create(invalidObject);

      expect(error).toBe('Nombre del puesto de trabajo es requerido');
      expect(productDTO).toBeUndefined();
    });

    test('should return DeskDTO instance when object is valid', () => {
      const [error, deskDTO] = DeskDTO.create(validObject);

      expect(error).toBeUndefined();
      expect(deskDTO).toBeInstanceOf(DeskDTO);
    });
  });
});
