export interface AccountCash {
  availableToTrade: number,
  reservedForOrders: number,
  inPies: number,
}

export interface AccountInvestments {
  currentValue: number,
  totalCost: number,
  realizedProfitLoss: number,
  unrealizedProfitLoss: number,
}

export interface AccountSummary {
  id: number,
  currency: string,
  totalValue: number,
  cash: AccountCash,
  investments: AccountInvestments,
}
