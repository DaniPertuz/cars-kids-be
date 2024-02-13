import mongoose from 'mongoose';
import { connect, disconnect } from '../../src/database';

jest.mock('mongoose');

describe('Connection to MongoDB', () => {

  jest.mock('mongoose', () => ({
    connections: [],
    connect: jest.fn(),
    disconnect: jest.fn(),
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should connect to MongoDB', async () => {
    await connect();
    expect(mongoose.connect).toHaveBeenCalled();
  });

  test('should not connect to MongoDB when a connection already exists', async () => {
    await connect();
    expect(mongoose.connect).not.toHaveBeenCalled(); // Verificar que no se haya llamado a mongoose.connect
  });

  test('should disconnect and then connect to MongoDB when a connection exists but is not ready', async () => {
    await disconnect();
    await connect();
    expect(mongoose.disconnect).toHaveBeenCalled(); // Verificar que se haya llamado a mongoose.disconnect
    expect(mongoose.connect).toHaveBeenCalled(); // Verificar que se haya llamado a mongoose.connect
  });
});
