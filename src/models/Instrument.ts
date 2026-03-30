export interface Instrument {
  ticker: string,
  type: string,
  workingScheduleId: number,
  isin: string,
  currencyCode: string,
  name: string,
  shortName: string,
  maxOpenQuantity: number,
  extendedHours: boolean,
  addedOn: string,
}
