import { DeskEntity } from '../../../src/domain/entities';

describe('Desk entity', () => {
  const data = {
    name: 'Test Desk'
  };

  test('should create a DeskEntity instance', () => {
    const desk = new DeskEntity(data);

    expect(desk).toBeInstanceOf(DeskEntity);
    expect(desk.params.name).toBe(data.name);
  });

  test('should create a DeskEntity from object', () => {
    const desk = DeskEntity.fromObject(data);

    expect(desk).toBeInstanceOf(DeskEntity);
    expect(desk.params.name).toBe('Test Desk');
  });
});
