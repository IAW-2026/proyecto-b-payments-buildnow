import { MercadoPagoConfig } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
    throw new Error(
        "[MercadoPago] MP_ACCESS_TOKEN is not defined. " +
        "Make sure it is set in your .env file."
    );
}

export const mpClient = new MercadoPagoConfig({
    accessToken,
});