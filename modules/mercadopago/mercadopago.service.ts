import { Preference } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface CreatePreferenceInput {
  items: PreferenceItem[];
  externalReference: string;
}

export interface CreatePreferenceResult {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

/** Crear una Preference de MercadoPago */
export async function createPreference(
  data: CreatePreferenceInput
): Promise<CreatePreferenceResult> {

  const preference = new Preference(mpClient);

  const result = await preference.create({
    body: {
      items: data.items,

      external_reference: data.externalReference,

      notification_url:
        `${SITE_URL}/api/mercadopago/webhook`,

      back_urls: {
        success: `${SITE_URL}/success`,
        failure: `${SITE_URL}/failure`,
        pending: `${SITE_URL}/pending`,
      },

      auto_return: 'approved',
    },
  });

  console.info(
    '[MercadoPago Preference] Created successfully:',
    result.id
  );

  return {
    preferenceId: result.id!,
    initPoint: result.init_point!,
    sandboxInitPoint: result.sandbox_init_point!,
  };
}
