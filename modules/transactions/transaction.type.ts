export interface Transaction {
    id: string;
    paymentId: string;
    orderId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    externalReference: string;
    createdAt: string;
}