export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
  ) { }

  static create(page: number = 1, limit: number = 5): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit)) return ['Page y limit deben ser numéricos'];

    if (page <= 0) return ['Page debe ser mayor que 0'];
    if (limit <= 0) return ['Limit debe ser mayor que 0'];

    return [undefined, new PaginationDto(page, limit)];
  }
}
