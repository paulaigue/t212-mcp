export interface Dividend {
  ticker: string,
  instrument: {
    ticker: string,
    name: string,
    isin: string,
    currency: string,
  },
  reference: string,
  quantity: number,
  amount: number,
  currency: string,
  grossAmountPerShare: number,
  amountInEuro: number,
  paidOn: string,
  type: string,
}
