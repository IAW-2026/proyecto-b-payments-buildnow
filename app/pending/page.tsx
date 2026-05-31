import { PaymentStatusCard } from '@/components/PaymentStatusCard';

interface PendingPageProps {
    searchParams: Promise<{
        payment_id?: string;
        status?: string;
        merchant_order_id?: string;
        preference_id?: string;
    }>;
}

export default async function PendingPage({
    searchParams,
}: PendingPageProps) {

    const params = await searchParams;

    return (
        <PaymentStatusCard
            type="pending"
            title="Pago pendiente"
            description="Tu pago está siendo procesado."
            details={{
                'Payment ID':
                    params.payment_id,
                Status:
                    params.status,
                'Merchant Order ID':
                    params.merchant_order_id,
                'Preference ID':
                    params.preference_id,
            }}
        />
    );
}