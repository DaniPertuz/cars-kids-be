import request from 'supertest';
import { UserModel } from '../../../src/database/models';
import { IStatus, IUserRole } from '../../../src/interfaces';
import { testServer } from '../../test-server';

jest.mock('../../../src/plugins/jwt.adapter', () => ({
  JwtAdapter: {
    generateJWT: jest.fn(),
    validateToken: jest.fn().mockReturnValue({ email: 'admin@test.com' })
  }
}));

describe('Users routes testing', () => {
  const testAdminUser = {
    name: 'Admin User',
    email: 'admin@test.com',
    password: '123',
    role: IUserRole.Admin,
    status: IStatus.Active
  };

  const testEditorUser = {
    name: 'Test User',
    email: 'test1@test.com',
    password: '123',
    role: IUserRole.Editor,
    status: IStatus.Active
  };

  beforeAll(async () => {
    await testServer.start();
    await UserModel.create(testAdminUser);
  });

  afterAll(async () => {
    await UserModel.deleteMany();
    testServer.close();
  });

  test('should get Editor users /api/users', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .get('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.users.length).toBe(1);
    expect(body.users[0].name).toBe('Test User');

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should update user role /api/users', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com', role: IUserRole.Admin })
      .expect(200);

    expect(body).toEqual({
      email: 'test1@test.com',
      name: 'Test User',
      role: 'admin',
      status: 'active'
    });

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should return a bad request if a required field is not provided api/users', async () => {
    const { body } = await request(testServer.app)
      .put('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com', role: 'User' })
      .expect(400);

    expect(body).toEqual({ error: 'Rol de usuario no válido' });
  });

  test('should deactivate user api/users', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .delete('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com' })
      .expect(200);

    expect(body).toEqual({ status: IStatus.Inactive });

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should return a not found request if email is not valid to deactivate user api/users', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .delete('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com1' })
      .expect(404);

    expect(body).toEqual({ error: 'Usuario no encontrado' });

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });
});
