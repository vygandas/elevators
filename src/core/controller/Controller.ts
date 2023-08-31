import { Elevator } from "../elevator/Elevator.ts";
import { Floors } from "../generics/Floors.ts";
import { ICallToFloorTask } from "./CallToFloorTask.ts";
import { v4 as uuid } from "uuid";
import { DirectionEnum } from "../elevator/Direction.enum.ts";

/**
 * Controller class
 *
 * Controller is theoretical device that is used to connect elevator call button with elevator.
 * It can support multiple elevators for the same button.
 * This controller decides which elevator to send where.
 */
export class Controller extends Floors {
  public readonly id;
  private elevators: Array<Elevator> = [];
  private unassignedCallsToFloorsQueue: Array<ICallToFloorTask> = [];
  private assignedCallsToFloorsQueue: Array<ICallToFloorTask> = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private controllerExecutor: NodeJS.Timer | undefined = undefined;
  private readonly onTick: () => void = () => {
    console.log("TICK IS NOT SET");
  };

  constructor(totalFloors: number, onTick: () => void) {
    super(totalFloors);
    this.onTick = onTick;
    this.id = uuid();
    this.launchControllerExecutor();
    return this;
  }

  public connectElevator = (elevator: Elevator) => {
    const id = uuid();
    elevator.setId(id);
    elevator.setOnIdle(this.findNextJob);
    elevator.setOnStop(() => {
      console.log("STOPPED");
    });
    this.elevators.push(elevator);
    return this;
  };

  public getElevators = () => {
    return this.elevators;
  };

  public callToFloor = (floor: number) => {
    console.log("CONTROLLER calling elevator to floor:", floor, this.elevators);
    this.unassignedCallsToFloorsQueue.push({ floor });
  };

  private launchControllerExecutor = () => {
    this.controllerExecutor = setInterval(this.takeQueuedCallToFloor, 1000);
    // console.log("controllerExecutor", this.controllerExecutor);
  };

  private takeQueuedCallToFloor = () => {
    // Aggregate new calls
    const job = this.unassignedCallsToFloorsQueue.shift();
    if (job) {
      const elevatorId = this.findElevatorIndex(job);
      console.log("CONTROLLER elevatorId", elevatorId);
      const todo = { ...job, elevatorId, id: uuid() };
      this.assignedCallsToFloorsQueue.push(todo);
      console.log(
        "CONTROLLER this.assignedCallsToFloorsQueue",
        this.assignedCallsToFloorsQueue,
      );
    }
    // Initiate prepared calls
    for (const elevator of this.elevators) {
      // console.log("elevator", {
      //   id: elevator.getId(),
      //   direction: elevator.getDirection(),
      // });
      if (elevator.getDirection() === DirectionEnum.Idle) {
        elevator.triggerOnIdle();
      }
    }
    this.onTick();
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
    const nextJob = this.assignedCallsToFloorsQueue.find(
      (j) => j.elevatorId === id,
    );
    // if (this.assignedCallsToFloorsQueue.length > 0) {
    //   debugger;
    // }

    if (elevator && nextJob) {
      console.log({ elevator, nextJob });
      // TODO: this is where callback will animate stuff on ui
      elevator.callToFloor(
        nextJob.floor,
        (currentFloor, isArrived, direction) => {
          console.log("CALLBACK OF ELEVATOR", {
            currentFloor,
            isArrived,
            direction,
          });
        },
      );
      this.assignedCallsToFloorsQueue = this.assignedCallsToFloorsQueue.filter(
        (j) => j.id !== nextJob.id,
      );
    }
  };
}
