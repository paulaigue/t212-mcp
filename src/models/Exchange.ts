export interface TimeEvent {
  date: string,
  type: string,
}

export interface WorkingSchedule {
  id: number,
  timeEvents: TimeEvent[],
}

export interface Exchange {
  id: number,
  name: string,
  workingSchedules: WorkingSchedule[],
}
