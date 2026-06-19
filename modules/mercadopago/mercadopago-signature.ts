
import crypto from 'crypto';

export function validateMercadoPagoSignature(
    request: Request,
    dataId: string
): boolean {

    const secret = process.env.MP_WEBHOOK_SECRET;

    if (!secret) {
        console.error(
            '[MP SIGNATURE][ERROR] Missing MP_WEBHOOK_SECRET'
        );

        throw new Error(
            'MP_WEBHOOK_SECRET not configured'
        );
    }

    const xSignature =
        request.headers.get('x-signature');

    const xRequestId =
        request.headers.get('x-request-id');

    if (!xSignature || !xRequestId) {

        console.warn(
            '[MP SIGNATURE][WARN] Missing required headers',
            {
                hasSignature: !!xSignature,
                hasRequestId: !!xRequestId,
            }
        );

        return false;
    }

    let ts = '';
    let receivedHash = '';

    for (const part of xSignature.split(',')) {

        const [key, value] = part.split('=');

        if (key?.trim() === 'ts') {
            ts = value?.trim();
        }

        if (key?.trim() === 'v1') {
            receivedHash = value?.trim();
        }
    }

    const manifest =
        `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const generatedHash = crypto
        .createHmac('sha256', secret)
        .update(manifest)
        .digest('hex');

    const isValid =
        generatedHash === receivedHash;

    if (!isValid) {

        console.warn(
            '[MP SIGNATURE][WARN] Signature mismatch',
            {
                dataId,
                requestId: xRequestId,
            }
        );
    }

    return isValid;
}