import { Controller } from "../controller/Controller.ts";
import { v4 as uuid } from "uuid";

export class Building {
  public readonly id: string;
  public readonly title: string;
  private elevatorControllers: Array<Controller> = [];

  constructor(title: string) {
    this.id = uuid();
    this.title = title;
  }

  public addElevatorController = (c: Controller) =>
    this.elevatorControllers.push(c);

  public getElevatorControllers = () => this.elevatorControllers;

  public getMaxFloors = () => {
    let max = 0;
    for (const controller of this.elevatorControllers) {
      if (controller.getTotalFloors() >= max) {
        max = controller.getTotalFloors();
      }
    }
    return max;
  };
}
