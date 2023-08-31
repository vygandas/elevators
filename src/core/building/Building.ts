import { Controller } from "../controller/Controller.ts";
import { v4 as uuid } from "uuid";

export class Building {
  public readonly id: string;
  private elevatorControllers: Array<Controller> = [];

  constructor() {
    this.id = uuid();
  }

  public addElevatorController = (c: Controller) =>
    this.elevatorControllers.push(c);

  public getElevatorControllers = () => this.elevatorControllers;
}
