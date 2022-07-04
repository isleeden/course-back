export class getPaginationData {
  readonly limit: 10;
  readonly offset: 0;
  readonly sort: string;
  readonly where: string;
}

export class getByUserIdPaginationData extends getPaginationData {
  readonly user_id: string;
}
