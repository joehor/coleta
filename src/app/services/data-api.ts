export interface DataApi {
  Success: boolean;
  Data: [];
  Paginas: {
    PageNumber: number;
    PageSize: number;
    PageCount: number;
  };
}
