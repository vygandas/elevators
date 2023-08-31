import { Elevator } from "../elevator/Elevator.ts";
import { Floors } from "../generics/Floors.ts";
import { ICallToFloorTask } from "./CallToFloorTask.ts";
import { v4 as uuid } from "uuid";

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
    const id = uuid();
    elevator.setId(id);
    elevator.setOnIdle(this.findNextJob);
    this.elevators.push(elevator);
    return this;
  };

  public callToFloor = (floor: number) => {
    this.unassignedCallsToFloorsQueue.push({ floor });
  };

  private launchControllerExecutor = () => {
    this.controllerExecutor = setInterval(this.takeQueuedCallToFloor, 100);
    console.log("controllerExecutor", this.controllerExecutor);
  };

  private takeQueuedCallToFloor = () => {
    const job = this.unassignedCallsToFloorsQueue.shift();
    if (job) {
      const elevatorId = this.findElevatorIndex(job);
      const todo = { ...job, elevatorId, id: uuid() };
      this.assignedCallsToFloorsQueue.push(todo);
    }
  };

  private findElevatorIndex = (job: ICallToFloorTask) => {
    let distance = -1;
    let id = "";
    for (const elevator of this.elevators) {
      if (!elevator.isCanGoThere(job.floor)) {
        continue;
      }
      const d = elevator.getDistanceToFloorIncludingCurrentJob(job.floor);
      if (distance === -1 || d <= distance) {
        distance = d;
        id = elevator.getId();
      }
    }
    return id;
  };

  private findNextJob = (id: string) => {
    const elevator = this.elevators.find((e) => e.getId() === id);
    const nextJob = this.assignedCallsToFloorsQueue.find((j) => j.id === id);
    if (elevator && nextJob) {
      // TODO: this is where callback will animate stuff on ui
      elevator.callToFloor(nextJob.floor, () => {});
      elevator.setOnStop(() => {
        this.assignedCallsToFloorsQueue =
          this.assignedCallsToFloorsQueue.filter((j) => j.id === nextJob.id);
      });
    }
  };
}
