export interface IPagination<T> {
  page: number;
  lastPage: number;
  limit: number;
  results: T[];
  total: number;
}
