import { PaymentStatusCard } from '@/components/PaymentStatusCard';

interface FailurePageProps {
    searchParams: Promise<{
        payment_id?: string;
        status?: string;
        merchant_order_id?: string;
        preference_id?: string;
    }>;
}

export default async function FailurePage({
    searchParams,
}: FailurePageProps) {

    const params = await searchParams;

    return (
        <PaymentStatusCard
            type="failure"
            title="Pago rechazado"
            description="El pago no pudo ser procesado."
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