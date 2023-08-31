import { Building } from "../core/building/Building.ts";
import { Controller } from "../core/controller/Controller.ts";
import { Elevator } from "../core/elevator/Elevator.ts";

export const initBuildings = (onTick: () => void = () => {}) => {
  const buildings = [];

  // First building with 1 elevators zone which has 2 elevators
  const b1 = new Building("Office space Old Town");
  const c1_1 = new Controller(6, onTick);
  const e1_1_1 = new Elevator(6, 0, "Northern elevator");
  const e1_1_2 = new Elevator(6, 0, "Southern elevator");
  c1_1.connectElevator(e1_1_1);
  c1_1.connectElevator(e1_1_2);
  b1.addElevatorController(c1_1);

  buildings.push(b1);

  // Second building with 2 elevators zones which has 2 and 3 elevators
  const b2 = new Building("Central Hospital of Kaunas");
  const c2_1 = new Controller(8, onTick);
  const e2_1_1 = new Elevator(5, 0, "Ambulance public elevator");
  const e2_1_2 = new Elevator(8, 0, "Ambulance personnel elevator");
  c2_1.connectElevator(e2_1_1);
  c2_1.connectElevator(e2_1_2);

  const c2_2 = new Controller(7, onTick);
  const e2_2_1 = new Elevator(5, 0, "Operating room lounge patients");
  const e2_2_2 = new Elevator(5, 0, "Operating room lounge cargo");
  const e2_2_3 = new Elevator(7, 0, "Operating room lounge fire escape");
  c2_2.connectElevator(e2_2_1);
  c2_2.connectElevator(e2_2_2);
  c2_2.connectElevator(e2_2_3);
  b2.addElevatorController(c2_1);
  b2.addElevatorController(c2_2);

  buildings.push(b2);

  return buildings;
};
