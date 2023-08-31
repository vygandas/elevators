export interface ICallToFloorTask {
  id?: string;
  floor: number;
  // When elevator is assigned, it means the job is taken
  elevatorId?: string;
}
