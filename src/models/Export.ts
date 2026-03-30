export interface Export {
  reportId: number,
  timeFrom: string,
  timeTo: string,
  dataIncluded: {
    includeOrders: boolean,
    includeTransactions: boolean,
    includeDividends: boolean,
    includeInterest: boolean,
  },
  status: string,
  downloadLink: string | null,
}
