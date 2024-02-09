import { envs } from '../../src/plugins/envs.plugin';

describe('Test envs.plugin.ts', () => {

  test('should return env options', () => {
    expect(envs).toEqual({
      JWT_SEED: 'C@R$K!D$S3ED',
      MONGO_URL: 'mongodb+srv://dpertuzo:E3QxBGhjtpNqOnsC@cluster0.fo76r.mongodb.net/cars-kids',
      PORT: 3300,
      PUBLIC_PATH: 'public'
    });
  });

  test('should return error if env is not found', async () => {
    jest.resetModules();
    process.env.PORT = 'ABC';

    try {
      await import('../../src/plugins/envs.plugin');
      expect(true).toBe(false);
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  });
});
