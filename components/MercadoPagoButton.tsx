"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago(
    process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!
);

export default function MercadoPagoButton() {

    const [preferenceId, setPreferenceId] = useState("");

    useEffect(() => {

        fetch("/api/mercadopago/preference", {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                setPreferenceId(data.id);
            });

    }, []);

    return (
        <>
            {preferenceId && (
                <Wallet
                    initialization={{
                        preferenceId,
                    }}
                />
            )}
        </>
    );
}