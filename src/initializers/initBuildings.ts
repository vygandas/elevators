import { Building } from "../core/building/Building.ts";
import { Controller } from "../core/controller/Controller.ts";
import { Elevator } from "../core/elevator/Elevator.ts";

export const initBuildings = () => {
  const buildings = [];

  const b1 = new Building();
  const c1_1 = new Controller(5);
  const e1_1_1 = new Elevator(5, 0, "Northern elevator");
  const e1_1_2 = new Elevator(5, 0, "Southern elevator");
  c1_1.connectElevator(e1_1_1);
  c1_1.connectElevator(e1_1_2);
  b1.addElevatorController(c1_1);

  buildings.push(b1);

  return buildings;
};
