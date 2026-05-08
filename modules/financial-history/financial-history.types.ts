export interface FinancialHistoryRecord {
    id: string;
    orderId: string;
    paymentId: string;
    recipientId: string;
    recipientType: 'SELLER' | 'DELIVERY';
    amount: number;
    currency: string;
    movementType: 'PAYOUT' | 'COMMISSION' | 'REFUND';
    status: 'PENDING' | 'COMPLETED';
    createdAt: string;
}