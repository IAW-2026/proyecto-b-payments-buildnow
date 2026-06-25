export type TransactionType = 
  | 'PAYMENT' 
  | 'PAYOUT_SELLER' 
  | 'PAYOUT_DELIVERY' 
  | 'COMMISSION';

export type TransactionStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED';


export type DashboardTransactionFilter =
  | 'ALL'
  | 'PAYMENT'
  | 'PAYOUT'
  | 'COMMISSION';