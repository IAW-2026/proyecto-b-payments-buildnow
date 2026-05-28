import * as paymentService
    from '@/modules/payments/payment.service';

interface SuccessPageProps {

    searchParams: Promise<{
        external_reference?: string;
    }>;
}

export default async function SuccessPage({
    searchParams,
}: SuccessPageProps) {

    const params =
        await searchParams;

    const externalReference =
        params.external_reference;

    if (!externalReference) {

        return (
            <main
                style={{
                    padding: '2rem',
                    fontFamily: 'sans-serif',
                }}
            >
                <h1>
                    ❌ Pago no encontrado
                </h1>

                <p>
                    Missing external reference
                </p>
            </main>
        );
    }

    /**
     * Buscar payment real
     * desde la DB
     */
    const payment =
        await paymentService
            .getPaymentByOrderId(
                externalReference
            );

    if (!payment) {

        return (
            <main
                style={{
                    padding: '2rem',
                    fontFamily: 'sans-serif',
                }}
            >
                <h1>
                    ❌ Pago no encontrado
                </h1>

                <p>
                    No existe el payment
                    en la base de datos.
                </p>
            </main>
        );
    }

    return (
        <main
            style={{
                padding: '2rem',
                fontFamily: 'sans-serif',
            }}
        >
            <h1>
                ✅ Pago exitoso
            </h1>

            <p>
                Tu pago fue procesado
                correctamente.
            </p>

            <h2>
                Detalles del pago:
            </h2>

            <ul>

                <li>
                    <strong>
                        Estado:
                    </strong>{' '}

                    {payment.status}
                </li>

                <li>
                    <strong>
                        MercadoPago ID:
                    </strong>{' '}

                    {payment.mercadopagoId ??
                        'No disponible'}
                </li>

                <li>
                    <strong>
                        Preference ID:
                    </strong>{' '}

                    {payment.preferenceId ??
                        'No disponible'}
                </li>

                <li>
                    <strong>
                        Email:
                    </strong>{' '}

                    {payment.payerEmail ??
                        'No disponible'}
                </li>

                <li>
                    <strong>
                        Status detail:
                    </strong>{' '}

                    {payment.statusDetail ??
                        'No disponible'}
                </li>

                <li>
                    <strong>
                        Paid at:
                    </strong>{' '}

                    {payment.paidAt
                        ?.toLocaleString()
                        ?? 'No disponible'}
                </li>

                <li>
                    <strong>
                        Amount:
                    </strong>{' '}

                    ${payment.amount.toString()}
                </li>
            </ul>

            <a
                href="/"
                style={{
                    color: '#0070f3',
                }}
            >
                ← Volver al inicio
            </a>
        </main>
    );
}