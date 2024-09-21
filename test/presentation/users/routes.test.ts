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
    img: 'User image',
    email: 'admin@test.com',
    password: '123',
    role: IUserRole.Admin,
    status: IStatus.Active
  };

  const testEditorUser = {
    name: 'Test User',
    img: 'User image',
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

  test('should update user role /api/users/role', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users/role')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com', role: IUserRole.Admin })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      email: 'test1@test.com',
      name: 'Test User',
      img: 'User image',
      role: 'admin',
      status: 'active'
    }));

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should return a bad request if a required field is not provided api/users', async () => {
    const { body } = await request(testServer.app)
      .put('/api/users/role')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com', role: 'User' })
      .expect(400);

    expect(body).toEqual({ error: 'Rol de usuario no válido' });
  });

  test('should update user password /api/users/password', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users/password')
      .send({ email: 'test1@test.com', password: 'test-pass1' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      email: 'test1@test.com',
      name: 'Test User',
      img: 'User image',
      role: 'editor',
      status: 'active'
    }));

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should update user name /api/users/name', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users/name')
      .send({ email: 'test1@test.com', name: 'Test User Updated' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      email: 'test1@test.com',
      name: 'Test User Updated',
      img: 'User image',
      role: 'editor',
      status: 'active'
    }));

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should update user image /api/users/image', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users/image')
      .send({ email: 'test1@test.com', img: 'Image link' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      email: 'test1@test.com',
      name: 'Test User',
      img: 'Image link',
      role: 'editor',
      status: 'active'
    }));

    await UserModel.findOneAndDelete({ email: 'test1@test.com' });
  });

  test('should update user email /api/users/email', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users/email')
      .send({ email: 'test1@test.com', newEmail: 'test11@test.com' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      email: 'test11@test.com',
      name: 'Test User',
      img: 'User image',
      role: 'editor',
      status: 'active'
    }));

    await UserModel.findOneAndDelete({ email: 'test11@test.com' });
  });

  test('should update user status /api/users/status', async () => {
    await UserModel.create(testEditorUser);

    const { body } = await request(testServer.app)
      .put('/api/users/status')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'test1@test.com', status: IStatus.Inactive })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      email: 'test1@test.com',
      name: 'Test User',
      img: 'User image',
      role: 'editor',
      status: 'inactive'
    }));

    await UserModel.findOneAndDelete({ email: 'test11@test.com' });
  });

  test('should return a not found request if email is not valid to update user password api/users/password', async () => {
    const { body } = await request(testServer.app)
      .put('/api/users/password')
      .send({ email: 'testing-2@test.com', password: 'test-pass1' })
      .expect(404);

    expect(body).toEqual({ error: 'Usuario no encontrado' });
  });

  test('should deactivate user api/users', async () => {
    await UserModel.create({
      name: 'Test User',
      img: 'User image',
      email: 'testing1@test.com',
      password: '123',
      role: IUserRole.Editor,
      status: IStatus.Active
    });

    const { body } = await request(testServer.app)
      .delete('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'testing1@test.com' })
      .expect(200);

    expect(body).toEqual({ status: IStatus.Inactive });

    await UserModel.findOneAndDelete({ email: 'testing1@test.com' });
  });

  test('should return a not found request if email is not valid to deactivate user api/users', async () => {
    await UserModel.create({
      name: 'Test User',
      img: 'Test Image',
      email: 'testing2@test.com',
      password: '123',
      role: IUserRole.Editor,
      status: IStatus.Active
    });

    const { body } = await request(testServer.app)
      .delete('/api/users')
      .set('Authorization', 'Bearer mock-token-here')
      .send({ email: 'testing2@test.com1' })
      .expect(404);

    expect(body).toEqual({ error: 'Usuario no encontrado' });

    await UserModel.findOneAndDelete({ email: 'testing2@test.com' });
  });
});
