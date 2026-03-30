export interface PositionInstrument {
  ticker: string,
  name: string,
  isin: string,
  currency: string,
}

export interface PositionWalletImpact {
  currency: string,
  totalCost: number,
  currentValue: number,
  unrealizedProfitLoss: number,
  fxImpact: number | null,
}

export interface Position {
  instrument: PositionInstrument,
  createdAt: string,
  quantity: number,
  quantityAvailableForTrading: number,
  quantityInPies: number,
  currentPrice: number,
  averagePricePaid: number,
  walletImpact: PositionWalletImpact,
}
