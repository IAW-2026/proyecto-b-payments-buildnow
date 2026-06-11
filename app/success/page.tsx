import * as paymentService from '@/modules/payments/payment.service';
import { PaymentStatusCard } from '@/components/PaymentStatusCard';

interface SuccessPageProps {
    searchParams: Promise<{
        external_reference?: string;
    }>;
}

export default async function SuccessPage({
    searchParams,
}: SuccessPageProps) {

    const params = await searchParams;

    const externalReference =
        params.external_reference;

    if (!externalReference) {
        return (
            <PaymentStatusCard
                type="failure"
                title="Pago no encontrado"
                description="Missing external reference."
                details={{}}
                backHref={`https://proyecto-b-buyer-buildnow.vercel.app/orders/${externalReference}/tracking`}
            />
        );
    }

    const payment =
        await paymentService
            .getPaymentByOrderId(
                externalReference
            );

    if (!payment) {
        return (
            <PaymentStatusCard
                type="failure"
                title="Pago no encontrado"
                description="No existe el payment en la base de datos."
                details={{}}
                backHref={`https://proyecto-b-buyer-buildnow.vercel.app/orders/${externalReference}/tracking`}
            />
        );
    }

    return (
        <PaymentStatusCard
            type="success"
            title="Pago exitoso"
            description="Tu pago fue procesado correctamente."
            details={{
                Status: payment.status,
                'MercadoPago ID': payment.mercadopagoId,
                'Preference ID': payment.preferenceId,
                Email: payment.payerEmail,
                'Status Detail': payment.statusDetail,
                'Paid At':
                    payment.paidAt?.toLocaleString(),
                Amount:
                    `$${payment.amount.toString()}`,
            }}
            backHref={`https://proyecto-b-buyer-buildnow.vercel.app/orders/${externalReference}/tracking`}
        />
    );
}