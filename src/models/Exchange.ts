export interface TimeEvent {
  date: string,
  type: "OPEN" | "CLOSE",
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
