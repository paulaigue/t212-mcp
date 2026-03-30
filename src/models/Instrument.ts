export interface Instrument {
  ticker: string,
  type: "STOCK" | "ETF" | "WARRANT",
  workingScheduleId: number,
  isin: string,
  currencyCode: string,
  name: string,
  shortName: string,
  maxOpenQuantity: number,
  extendedHours: boolean,
  addedOn: string,
}
