import request from 'supertest';
import { DeskModel } from '../../../src/database/models';
import { testServer } from '../../test-server';

describe('Desks routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await DeskModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const testDesk = {
    name: 'Testing Desk'
  };

  test('should create a desk /api/desks', async () => {
    const { body } = await request(testServer.app)
      .post('/api/desks')
      .send(testDesk);

    expect(body).toEqual(expect.objectContaining({
      name: testDesk.name
    }));
  });

  test('should get desks /api/desks', async () => {
    await DeskModel.create(testDesk);

    const { body } = await request(testServer.app)
      .get('/api/desks')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.desks.length).toBe(1);
    expect(body.desks[0].name).toBe(testDesk.name);
  });

  test('should get desk /api/desks/:name', async () => {
    await DeskModel.create(testDesk);

    const { body } = await request(testServer.app)
      .get(`/api/desks/${testDesk.name}`)
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.name).toBe(testDesk.name);
  });

  test('should update desk /api/desks/:name', async () => {
    await DeskModel.create(testDesk);

    const { body } = await request(testServer.app)
      .put(`/api/desks/${testDesk.name}`)
      .send({ name: 'New Desk Name' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      name: 'New Desk Name'
    }));
  });

  test('should delete desk /api/desks/:name', async () => {
    await DeskModel.create(testDesk);

    const { body } = await request(testServer.app)
      .delete(`/api/desks/${testDesk.name}`)
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      name: 'Testing Desk'
    }));
  });
});
