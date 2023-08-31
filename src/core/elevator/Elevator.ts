import { DirectionEnum } from "./Direction.enum.ts";
import { elevatorConfig } from "../../config/elevator.config.ts";

/**
 * Elevator class
 *
 * Elevator knows only where it is and where it should go next.
 * It can tell to the client is it moving and where.
 */
export class Elevator {
  private readonly totalFloors: number;
  private currentFloor: number;
  private direction: DirectionEnum = DirectionEnum.Idle;
  private calledToFloor: number = 0;
  private readonly description: string = "";

  private onMove: (direction: DirectionEnum) => void = () => {};
  private onStop: (currentFloor: number) => void = () => {};
  private onCalled: (currentFloor: number, calledToFloor: number) => void =
    () => {};

  constructor(totalFloors: number, currentFloor: number, description: string) {
    this.totalFloors = totalFloors;
    this.currentFloor = currentFloor;
    this.description = description;
  }

  public getTotalFloors = (): number => this.totalFloors;
  public getCurrentFloor = (): number => this.currentFloor;
  public getDirection = (): DirectionEnum => this.direction;
  // public isCalled = () => this.isElevatorCalled;
  public isMoving = (): boolean => this.direction !== DirectionEnum.Idle;
  public isArrived = (): boolean => this.currentFloor === this.calledToFloor;
  public getDistanceToFloor = (): number =>
    Math.abs(this.calledToFloor - this.currentFloor);
  public getDescription = () => this.description;

  public setOnMove = (fn: typeof this.onMove) => (this.onMove = fn);
  public setOnStop = (fn: typeof this.onStop) => (this.onStop = fn);
  public setOnCalled = (fn: typeof this.onCalled) => (this.onCalled = fn);

  private playArrivalSound = (): void => {
    const audio = new Audio("/elevator-ding-at-arenco-tower-dubai-38520.mp3");
    void audio.play();
  };

  public callToFloor = (
    floor: number,
    callbackFn: (
      currentFloor?: number,
      isArrived?: boolean,
      direction?: DirectionEnum,
    ) => void,
  ): Elevator => {
    this.onCalled(this.currentFloor, floor);

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
      if (this.currentFloor === this.calledToFloor) {
        this.direction = DirectionEnum.Idle;
        callbackFn(this.currentFloor, true, DirectionEnum.Idle);
        this.playArrivalSound();
        this.onStop(this.currentFloor);
        clearInterval(intervalHandler);
      } else {
        this.currentFloor =
          this.direction === DirectionEnum.UP
            ? this.calledToFloor++
            : this.calledToFloor--;
        callbackFn(this.currentFloor, false, this.direction);
        this.onMove(this.direction);
      }
    }, elevatorConfig.speed);

    return this;
  };
}
