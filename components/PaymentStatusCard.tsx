import Link from 'next/link';
import {
    CheckCircle2,
    Clock3,
    XCircle,
} from 'lucide-react';

interface PaymentStatusCardProps {
    title: string;
    description: string;
    type: 'success' | 'pending' | 'failure';
    details: Record<string, string | null | undefined>;
    backHref?: string;
}

export function PaymentStatusCard({
    title,
    description,
    type,
    details,
    backHref = '/',
}: PaymentStatusCardProps) {

    const icon =
        type === 'success'
            ? (
                <CheckCircle2
                    className="
                        h-12 w-12
                        text-green-400
                    "
                />
            )
            : type === 'pending'
                ? (
                    <Clock3
                        className="
                            h-12 w-12
                            text-yellow-400
                        "
                    />
                )
                : (
                    <XCircle
                        className="
                            h-12 w-12
                            text-red-400
                        "
                    />
                );

    return (
        <main
            className="
                flex min-h-screen
                items-center justify-center
                bg-background
                p-4
            "
        >
            <div
                className="
                    industrial-card
                    w-full max-w-3xl
                    rounded-2xl
                    p-5
                "
            >

                {/* Header */}

                <div
                    className="
                        mb-5 flex items-start
                        gap-4
                    "
                >
                    {icon}

                    <div>
                        <h1
                            className="
                                text-3xl font-black
                                text-primary
                            "
                        >
                            {title}
                        </h1>

                        <p
                            className="
                                mt-2 text-lg
                                text-on-surface-variant
                            "
                        >
                            {description}
                        </p>
                    </div>
                </div>

                {/* Details */}

                <div
                    className="
                        rounded-2xl border
                        border-outline-variant
                        bg-surface-container-high
                        p-4
                    "
                >
                    <h2
                        className="
                            mb-6 text-xl
                            font-bold
                            text-on-surface
                        "
                    >
                        Payment Details
                    </h2>

                    <div className="space-y-3">

                        {Object.entries(details)
                            .map(([key, value]) => (

                                <div
                                    key={key}
                                    className="
                                        grid gap-2
                                        border-b
                                        border-outline-variant
                                        pb-2
                                        md:grid-cols-[160px_1fr]
                                    "
                                >

                                    <span
                                        className="
                                            text-sm
                                            font-medium
                                            text-on-surface-variant
                                        "
                                    >
                                        {key}
                                    </span>

                                    <span
                                        className="
                                            break-all
                                            font-semibold
                                            text-on-surface
                                        "
                                    >
                                        {value ??
                                            'No disponible'}
                                    </span>

                                </div>
                            ))}
                    </div>
                </div>

                <Link
                    href={backHref}
                    className="
                        mt-8 inline-flex
                        rounded-xl
                        bg-primary-container
                        px-5 py-3
                        font-semibold text-white
                        transition-opacity
                        hover:opacity-90
                    "
                >
                    Ver seguimiento del pedido →
                </Link>

            </div>
        </main>
    );
}