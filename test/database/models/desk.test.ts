import { connect, disconnect } from '../../../src/database';
import { DeskModel } from '../../../src/database/models';

describe('Desk model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return DeskModel', async () => {
    const deskData = {
      name: 'Test Name'
    };

    const desk = await DeskModel.create(deskData);

    expect(desk.toJSON()).toEqual(expect.objectContaining(deskData));

    await DeskModel.findOneAndDelete({ name: desk.name });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      name: { type: String, required: true, unique: true },
    };

    const schema = DeskModel.schema.obj;

    expect(schema).toEqual(expect.objectContaining(expectedSchema));
  });
});
