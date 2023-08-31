import { DirectionEnum } from "./Direction.enum.ts";
import { elevatorConfig } from "../../config/elevator.config.ts";

export class Elevator {
  private readonly totalFloors: number;
  private currentFloor: number;
  private direction: DirectionEnum = DirectionEnum.Idle;
  private calledToFloor: number = 0;

  constructor(totalFloors: number, currentFloor: number) {
    this.totalFloors = totalFloors;
    this.currentFloor = currentFloor;
  }

  public getTotalFloors = (): number => this.totalFloors;
  public getCurrentFloor = (): number => this.currentFloor;
  public getDirection = (): DirectionEnum => this.direction;
  // public isCalled = () => this.isElevatorCalled;
  public isMoving = (): boolean => this.direction !== DirectionEnum.Idle;
  public isArrived = (): boolean => this.currentFloor === this.calledToFloor;
  public getDistanceToFloor = (): number =>
    Math.abs(this.calledToFloor - this.currentFloor);

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
        clearInterval(intervalHandler);
      } else {
        this.currentFloor =
          this.direction === DirectionEnum.UP
            ? this.calledToFloor++
            : this.calledToFloor--;
        callbackFn(this.currentFloor, false, this.direction);
      }
    }, elevatorConfig.speed);

    return this;
  };
}
