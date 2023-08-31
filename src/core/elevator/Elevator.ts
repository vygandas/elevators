import { DirectionEnum } from "./Direction.enum.ts";
import { elevatorConfig } from "../../config/elevator.config.ts";
import { Floors } from "../generics/Floors.ts";

/**
 * Elevator class
 *
 * Elevator knows only where it is and where it should go next.
 * It can tell to the client is it moving and where.
 */
export class Elevator extends Floors {
  private id: string = "";
  private currentFloor: number;
  private direction: DirectionEnum = DirectionEnum.Idle;
  private calledToFloor: number = 0;
  public readonly description: string = "";

  private onMove: (direction: DirectionEnum) => void = () => {};
  private onStop: (currentFloor: number) => void = () => {};
  private onIdle: (id: string) => void = () => {};
  private onCalled: (currentFloor: number, calledToFloor: number) => void =
    () => {};
  private onTick: () => void = () => {};

  constructor(
    totalFloors: number,
    currentFloor: number,
    description: string,
    onTick: () => void,
  ) {
    super(totalFloors);
    this.onTick = onTick;
    this.currentFloor = currentFloor;
    this.description = description;
    return this;
  }

  public setId = (id: string) => {
    this.id = id;
    return this;
  };

  public getCurrentFloor = (): number => this.currentFloor;
  public getDirection = (): DirectionEnum => this.direction;
  // public isCalled = () => this.isElevatorCalled;
  public isMoving = (): boolean => this.direction !== DirectionEnum.Idle;
  public isArrived = (): boolean => this.currentFloor === this.calledToFloor;
  public getDistanceToFloor = (): number =>
    Math.abs(this.calledToFloor - this.currentFloor);
  public getDistanceToFloorIncludingCurrentJob = (
    nextFloor: number,
  ): number => {
    // debugger;
    // Get how far current task is
    const currentJobDistance =
      this.direction === DirectionEnum.Idle ? 0 : this.getCurrentFloor();
    // Get how far it will be from the new position after that
    const nextJobDistance = Math.abs(nextFloor - this.calledToFloor);
    return currentJobDistance + nextJobDistance;
  };
  public isCanGoThere = (floor: number) => {
    return this.getTotalFloors() >= floor + 1;
  };
  public getDescription = () => this.description;

  public setOnMove = (fn: typeof this.onMove) => (this.onMove = fn);
  public setOnStop = (fn: typeof this.onStop) => (this.onStop = fn);
  public setOnCalled = (fn: typeof this.onCalled) => (this.onCalled = fn);
  public setOnIdle = (fn: typeof this.onIdle) => (this.onIdle = fn);

  private playArrivalSound = (): void => {
    const audio = new Audio("/elevator-ding-at-arenco-tower-dubai-38520.mp3");
    void audio.play();
  };

  public getId = () => this.id;

  public triggerOnIdle = () => this.onIdle(this.id);

  public callToFloor = (
    floor: number,
    callbackFn: (
      currentFloor?: number,
      isArrived?: boolean,
      direction?: DirectionEnum,
    ) => void,
  ): Elevator => {
    // this.onCalled(this.currentFloor, floor);

    console.log(`ELEVATOR I'm ${this.id} called to floor`, floor);

    // Do not do anything if it's current floor
    if (floor === this.currentFloor) {
      this.playArrivalSound();
      callbackFn(this.currentFloor, true, DirectionEnum.Idle);
      return this;
    }

    // Set where it is called to
    this.calledToFloor = floor;
    this.direction =
      this.calledToFloor < this.currentFloor
        ? DirectionEnum.Down
        : DirectionEnum.UP;

    // Start moving there
    const intervalHandler = setInterval(() => {
      // debugger;
      console.log(
        "callToFloor",
        this.currentFloor,
        this.calledToFloor,
        this.direction,
      );
      if (
        this.currentFloor === this.calledToFloor &&
        this.direction !== DirectionEnum.Idle
      ) {
        this.direction = DirectionEnum.Idle;
        this.playArrivalSound();
        callbackFn(this.currentFloor, true, DirectionEnum.Idle);
        this.onStop(this.currentFloor);
        this.onIdle(this.id);

        clearInterval(intervalHandler);
      } else {
        this.currentFloor =
          this.direction === DirectionEnum.UP
            ? this.currentFloor + 1
            : this.currentFloor - 1;
        this.onTick();
        callbackFn(this.currentFloor, false, this.direction);
        this.onMove(this.direction);
      }
    }, elevatorConfig.speed);

    return this;
  };
}
