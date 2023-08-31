import { Elevator } from "../elevator/Elevator.ts";
import { Floors } from "../generics/Floors.ts";
import { ICallToFloorTask } from "./CallToFloorTask.ts";

/**
 * Controller class
 *
 * Controller is theoretical device that is used to connect elevator call button with elevator.
 * It can support multiple elevators for the same button.
 * This controller decides which elevator to send where.
 */
export class Controller extends Floors {
  private elevators: Array<Elevator> = [];
  private unassignedCallsToFloorsQueue: Array<ICallToFloorTask> = [];
  private assignedCallsToFloorsQueue: Array<ICallToFloorTask> = [];
  private controllerExecutor: NodeJS.Timer | undefined = undefined;

  constructor(totalFloors: number) {
    super(totalFloors);
    this.launchControllerExecutor();
    return this;
  }

  public connectElevator = (elevator: Elevator) => {
    this.elevators.push(elevator);
    return this;
  };

  public callToFloor = (floor: number) => {
    this.unassignedCallsToFloorsQueue.push({ floor });
  };

  private launchControllerExecutor = () => {
    this.controllerExecutor = setInterval(this.takeQueuedCallToFloor, 100);
  };

  private takeQueuedCallToFloor = () => {
    const job = this.unassignedCallsToFloorsQueue.shift();
    if (job) {
      const elevatorIndex = this.findElevatorIndex(job);
      this.assignedCallsToFloorsQueue.push({ ...job, elevatorIndex });
    } else {
      // Idle
    }
  };

  private findElevatorIndex = (job: ICallToFloorTask) => {
    let distance = -1;
    let index = -1;
    for (const [i, elevator] of this.elevators.entries()) {
      const d = elevator.getDistanceToFloorIncludingCurrentJob(job.floor);
      if (distance === -1 || d <= distance) {
        distance = d;
        index = i;
      }
    }
    return index;
  };
}
