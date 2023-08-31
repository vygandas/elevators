export interface ICallToFloorTask {
  floor: number;
  // When elevator is assigned, it means the job is taken
  elevatorIndex?: number;
}
