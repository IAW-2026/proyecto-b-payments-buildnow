interface PendingPageProps {
    searchParams: Promise<{
        payment_id?: string;
        status?: string;
        merchant_order_id?: string;
        preference_id?: string;
    }>;
}

export default async function PendingPage({ searchParams }: PendingPageProps) {
    const params = await searchParams;

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>⏳ Pago pendiente</h1>
            <p>Tu pago está siendo procesado. Recibirás una confirmación pronto.</p>

            <h2>Detalles:</h2>
            <ul>
                <li>
                    <strong>Payment ID:</strong>{" "}
                    {params.payment_id || "No disponible"}
                </li>
                <li>
                    <strong>Status:</strong>{" "}
                    {params.status || "No disponible"}
                </li>
                <li>
                    <strong>Merchant Order ID:</strong>{" "}
                    {params.merchant_order_id || "No disponible"}
                </li>
                <li>
                    <strong>Preference ID:</strong>{" "}
                    {params.preference_id || "No disponible"}
                </li>
            </ul>

            <a href="/" style={{ color: "#0070f3" }}>
                ← Volver al inicio
            </a>
        </main>
    );
}
