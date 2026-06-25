export interface Payout {
    id: string;
    orderId: string;
    recipientId: string;
    recipientType: 'SELLER' | 'DELIVERY';
    amount: number;
    status: 'PENDING' | 'COMPLETED';
    createdAt: string;
}