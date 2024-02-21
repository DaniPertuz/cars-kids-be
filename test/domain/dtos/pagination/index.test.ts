import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';

describe('PaginationDto', () => {
  describe('create', () => {
    test('should create a PaginationDto instance with default values', () => {
      const [error, paginationDto] = PaginationDto.create();

      expect(error).toBeUndefined();
      expect(paginationDto).toBeInstanceOf(PaginationDto);
      expect(paginationDto!.page).toEqual(1);
      expect(paginationDto!.limit).toEqual(5);
    });

    test('should create a PaginationDto instance with provided values', () => {
      const [error, paginationDto] = PaginationDto.create(2, 10);

      expect(error).toBeUndefined();
      expect(paginationDto).toBeInstanceOf(PaginationDto);
      expect(paginationDto!.page).toEqual(2);
      expect(paginationDto!.limit).toEqual(10);
    });

    test('should return an error if page or limit are not numbers', () => {
      const [errorPage, paginationDtoPage] = PaginationDto.create(NaN, 10);

      expect(errorPage).toEqual('Page y limit deben ser numéricos');
      expect(paginationDtoPage).toBeUndefined();

      const [errorLimit, paginationDtoLimit] = PaginationDto.create(1, NaN);

      expect(errorLimit).toEqual('Page y limit deben ser numéricos');
      expect(paginationDtoLimit).toBeUndefined();
    });

    test('should return an error if page or limit are less than or equal to 0', () => {
      const [error1, paginationDto1] = PaginationDto.create(0, 10);

      expect(error1).toEqual('Page debe ser mayor que 0');
      expect(paginationDto1).toBeUndefined();

      const [error2, paginationDto2] = PaginationDto.create(1, 0);

      expect(error2).toEqual('Limit debe ser mayor que 0');
      expect(paginationDto2).toBeUndefined();
    });
  });
});
