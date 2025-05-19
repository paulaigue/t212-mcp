export interface AccountCash {
  free: number;
  blocked: number;
  invested: number;
  ppl: number;
  total: number;
}

export interface AccountMetadata {
  currency: string;
  id: number;
  name: string;
  type: string;
} 