export interface HistoricalOrderInstrument {
  ticker: string,
  name: string,
  isin: string,
  currency: string,
}

export interface HistoricalOrderDetails {
  id: number,
  strategy: string,
  type: string,
  ticker: string,
  status: string,
  value: number,
  filledValue: number,
  currency: string,
  extendedHours: boolean,
  initiatedFrom: string,
  side: "BUY" | "SELL",
  createdAt: string,
  instrument: HistoricalOrderInstrument,
}

export interface HistoricalOrderFill {
  id: number,
  quantity: number,
  price: number,
  type: string,
  tradingMethod: string,
  filledAt: string,
  walletImpact: {
    currency: string,
    netValue: number,
    fxRate: number,
    taxes: unknown[],
  },
}

export interface HistoricalOrder {
  order: HistoricalOrderDetails,
  fill: HistoricalOrderFill,
}

export interface PaginatedResponse<T> {
  items: T[],
  nextPagePath: string | null,
}
