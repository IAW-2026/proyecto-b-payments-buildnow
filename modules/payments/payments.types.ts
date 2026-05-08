export type PaymentStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: PaymentStatus;
    createdAt: string;
}