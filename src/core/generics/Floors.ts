export class Floors {
  private readonly totalFloors: number;

  constructor(totalFloors: number) {
    this.totalFloors = totalFloors;
  }

  public getTotalFloors = (): number => this.totalFloors;
}
