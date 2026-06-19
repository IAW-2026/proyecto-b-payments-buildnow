export interface Earnings {
    recipientId: string;
    recipientType: 'SELLER' | 'DELIVERY';
    totalEarnings: number;
    currency: string;
}