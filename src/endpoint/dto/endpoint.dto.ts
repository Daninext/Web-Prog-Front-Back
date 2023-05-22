export class EndpointDto {
  path: string;
  count: number;

  constructor(path: string, count: number) {
    this.path = path;
    this.count = count;
  }
}
