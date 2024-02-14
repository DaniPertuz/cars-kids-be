import request from 'supertest';
import { UserModel } from '../../../src/database/models';
import { IStatus, IUserRole } from '../../../src/interfaces';
import { testServer } from '../../test-server';

describe('Users routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await UserModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const testUser = {
    name: 'Test User',
    email: 'test1@test.com',
    password: '123',
    role: IUserRole.Editor,
    status: IStatus.Active
  };

  test('should get Editor users /api/users', async () => {
    await UserModel.create(testUser);

    const { body } = await request(testServer.app)
      .get('/api/users')
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(1);
    expect(body[0].name).toBe('Test User');
  });

  test('should update user role /api/users', async () => {
    await UserModel.create(testUser);

    const { body } = await request(testServer.app)
      .put('/api/users')
      .send({ email: 'test1@test.com', role: IUserRole.Admin })
      .expect(200);

    expect(body).toEqual({
      email: 'test1@test.com',
      name: 'Test User',
      role: 'admin',
      status: 'active'
    });
  });

  test('should return a bad request if a required field is not provided api/users', async () => {
    const { body } = await request(testServer.app)
      .put('/api/users')
      .send({ email: 'test1@test.com', role: 'User' })
      .expect(400);

    expect(body).toEqual({ error: 'Rol de usuario no válido' });
  });

  test('should deactivate user api/users', async () => {
    await UserModel.create(testUser);

    const { body } = await request(testServer.app)
      .delete('/api/users')
      .send({ email: 'test1@test.com' })
      .expect(200);

    expect(body).toEqual({ status: IStatus.Inactive });
  });

  test('should return a not found request if email is not valid to deactivate user api/users', async () => {
    await UserModel.create(testUser);

    const { body } = await request(testServer.app)
      .delete('/api/users')
      .send({ email: 'test1@test.com1' })
      .expect(404);

    expect(body).toEqual({ error: 'Usuario no encontrado' });
  });
});
