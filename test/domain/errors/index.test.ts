import { CustomError } from '../../../src/domain/errors';

describe('CustomError', () => {
  describe('badRequest', () => {
    test('should return a CustomError instance with status code 400', () => {
      const error = CustomError.badRequest('Bad request');

      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad request');
    });
  });

  describe('unauthorized', () => {
    test('should return a CustomError instance with status code 401', () => {
      const error = CustomError.unauthorized('Unauthorized');

      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });
  });

  describe('forbidden', () => {
    test('should return a CustomError instance with status code 403', () => {
      const error = CustomError.forbidden('Forbidden');

      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Forbidden');
    });
  });

  describe('not found', () => {
    test('should return a CustomError instance with status code 404', () => {
      const error = CustomError.notFound('Not Found');

      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not Found');
    });
  });

  describe('server error', () => {
    test('should return a CustomError instance with status code 500', () => {
      const error = CustomError.serverError('Server error');

      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Server error');
    });
  });
});
