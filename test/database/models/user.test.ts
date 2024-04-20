import { connect, disconnect } from '../../../src/database';
import { IStatus, IUserRole } from '../../../src/interfaces';
import { UserModel } from '../../../src/database/models';

describe('User model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return UserModel', async () => {
    const userData = {
      name: 'Test Name',
      img: 'Test Image',
      email: 'test@testemail.com',
      password: '000000',
      role: IUserRole.Editor,
      status: IStatus.Active
    };

    const user = await UserModel.create(userData);

    expect(user.toJSON()).toEqual(expect.objectContaining(userData));

    await UserModel.findOneAndDelete({ name: user.name });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      name: { type: String, required: true },
      img: { type: String, required: false, default: '' },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: {
          values: ['admin', 'editor'],
          message: '{VALUE} no es un rol válido',
          default: 'editor',
          required: true
        }
      },
      status: {
        type: String,
        enum: {
          values: ['active', 'inactive'],
          message: '{VALUE} no es un estado válido',
          default: 'active',
          required: true
        }
      }
    };

    const schema = UserModel.schema.obj;

    expect(schema).toEqual(expectedSchema);
  });
});
