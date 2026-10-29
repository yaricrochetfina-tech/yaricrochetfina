import { Resend } from 'https://esm.sh/resend@2.0.0';
import { BRAND_NAME, DEFAULT_FROM_EMAIL } from '../_shared/brand.ts';
import { escapeHtml } from '../_shared/cors.ts';

export interface OrderEmailData {
  orderId: string;
  accessToken: string | null;
  siteUrl: string;
  language: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingName: string | null;
  shippingAddress: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  shippingCountry: string;
  items: Array<{ name: string; quantity: number; unit_price: number }>;
  shippingCost: number;
  totalAmount: number;
  currency: string;
}

export interface ShippingEmailData {
  orderId: string;
  siteUrl: string;
  language: string;
  customerName: string;
  customerEmail: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string | null;
}

type Lang = 'es' | 'fr' | 'en';

const TEXTS: Record<Lang, Record<string, string>> = {
  es: {
    subject: `Confirmación de tu pedido #{n} - ${BRAND_NAME}`,
    title: '¡Gracias por tu compra, {name}!',
    intro: 'Hemos recibido tu pago.',
    thanks: 'Estamos preparando tu pedido con mucho cariño desde Montreal',
    order: 'Pedido',
    item: 'Producto',
    qty: 'Cant.',
    amount: 'Importe',
    shipping: 'Envío',
    total: 'Total',
    shipTo: 'Dirección de envío',
    delivery: 'Plazo estimado de entrega: 7 a 14 días hábiles, con número de seguimiento.',
    view: 'Ver mi pedido',
    footer: `Con cariño,<br>El equipo de ${BRAND_NAME}`,
    friend: 'amiga',
  },
  fr: {
    subject: `Confirmation de votre commande #{n} - ${BRAND_NAME}`,
    title: 'Merci pour votre achat, {name} !',
    intro: 'Nous avons bien reçu votre paiement.',
    thanks: 'Nous préparons votre commande avec beaucoup d\'amour depuis Montréal',
    order: 'Commande',
    item: 'Produit',
    qty: 'Qté',
    amount: 'Montant',
    shipping: 'Livraison',
    total: 'Total',
    shipTo: 'Adresse de livraison',
    delivery: 'Délai de livraison estimé : 7 à 14 jours ouvrables, avec numéro de suivi.',
    view: 'Voir ma commande',
    footer: `Avec amour,<br>L'équipe ${BRAND_NAME}`,
    friend: 'chère cliente',
  },
  en: {
    subject: `Your order #{n} is confirmed - ${BRAND_NAME}`,
    title: 'Thank you for your purchase, {name}!',
    intro: 'We have received your payment.',
    thanks: 'We are preparing your order with great care from Montreal',
    order: 'Order',
    item: 'Item',
    qty: 'Qty',
    amount: 'Amount',
    shipping: 'Shipping',
    total: 'Total',
    shipTo: 'Shipping address',
    delivery: 'Estimated delivery: 7 to 14 business days, with a tracking number.',
    view: 'View my order',
    footer: `With love,<br>The ${BRAND_NAME} Team`,
    friend: 'friend',
  },
};

const SHIPPED_TEXTS: Record<Lang, Record<string, string>> = {
  es: {
    subject: `Tu pedido #{n} ha sido enviado - ${BRAND_NAME}`,
    title: '¡Tu pedido va en camino, {name}!',
    intro: 'Hemos enviado tu pedido con mucho cariño desde Montreal.',
    order: 'Número de pedido',
    carrier: 'Empresa de transporte',
    tracking: 'Código de seguimiento',
    trackLink: 'Rastrear envío',
    footer: `Con cariño,<br>El equipo de ${BRAND_NAME}`,
    friend: 'amiga',
  },
  fr: {
    subject: `Votre commande #{n} a été expédiée - ${BRAND_NAME}`,
    title: 'Votre commande est en route, {name} !',
    intro: 'Nous avons expédié votre commande avec amour depuis Montréal.',
    order: 'Numéro de commande',
    carrier: 'Transporteur',
    tracking: 'Numéro de suivi',
    trackLink: 'Suivre l\'envoi',
    footer: `Avec amour,<br>L'équipe ${BRAND_NAME}`,
    friend: 'chère cliente',
  },
  en: {
    subject: `Your order #{n} has shipped - ${BRAND_NAME}`,
    title: 'Your order is on its way, {name}!',
    intro: 'We have shipped your order with care from Montreal.',
    order: 'Order number',
    carrier: 'Carrier',
    tracking: 'Tracking number',
    trackLink: 'Track shipment',
    footer: `With love,<br>The ${BRAND_NAME} Team`,
    friend: 'friend',
  },
};

const money = (amount: number, currency: string) => `$${amount.toFixed(2)} ${currency}`;

const addressLines = (data: OrderEmailData): string[] => {
  const a = data.shippingAddress;
  return [
    data.shippingName,
    a?.line1,
    a?.line2,
    [a?.postal_code, a?.city].filter(Boolean).join(' '),
    a?.state,
    a?.country || data.shippingCountry,
  ]
    .filter((line): line is string => Boolean(line && String(line).trim()))
    .map((line) => escapeHtml(line));
};

const itemsTable = (data: OrderEmailData, t: Record<string, string>) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
    <thead>
      <tr style="text-align:left;border-bottom:2px solid #e5d9c3;">
        <th style="padding:8px 4px;">${t.item}</th>
        <th style="padding:8px 4px;text-align:center;">${t.qty}</th>
        <th style="padding:8px 4px;text-align:right;">${t.amount}</th>
      </tr>
    </thead>
    <tbody>
      ${data.items
        .map(
          (item) => `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 4px;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 4px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 4px;text-align:right;">${money(item.unit_price * item.quantity, data.currency)}</td>
        </tr>`
        )
        .join('')}
      <tr>
        <td colspan="2" style="padding:8px 4px;">${t.shipping}</td>
        <td style="padding:8px 4px;text-align:right;">${money(data.shippingCost, data.currency)}</td>
      </tr>
      <tr style="font-weight:bold;">
        <td colspan="2" style="padding:8px 4px;border-top:2px solid #e5d9c3;">${t.total}</td>
        <td style="padding:8px 4px;text-align:right;border-top:2px solid #e5d9c3;">${money(data.totalAmount, data.currency)}</td>
      </tr>
    </tbody>
  </table>`;

export type EmailStatus = 'sent' | 'skipped' | `failed: ${string}`;
export interface OrderEmailResult {
  owner: EmailStatus;
  customer: EmailStatus;
}

const errorText = (err: unknown): string =>
  err instanceof Error ? err.message : typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err);

export const sendOrderEmails = async (data: OrderEmailData): Promise<OrderEmailResult> => {
  const result: OrderEmailResult = { owner: 'skipped', customer: 'skipped' };
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured: order emails skipped');
    return result;
  }

  const resend = new Resend(apiKey);
  const from = Deno.env.get('RESEND_FROM_EMAIL') || DEFAULT_FROM_EMAIL;
  const ownerEmail = Deno.env.get('OWNER_EMAIL') || 'yaricrochetfina@gmail.com';
  const lang: Lang = (['es', 'fr', 'en'] as const).includes(data.language as Lang)
    ? (data.language as Lang)
    : 'es';
  const t = TEXTS[lang];
  const orderNumber = data.orderId.slice(0, 8).toUpperCase();
  const safeName = escapeHtml(data.customerName || t.friend);
  const address = addressLines(data).join('<br>');
  const orderLink = data.accessToken
    ? `${data.siteUrl}/payment/success?token=${encodeURIComponent(data.accessToken)}`
    : null;

  // 1) Aviso a la dueña de la tienda (lo más importante: contiene la dirección para enviar el pedido).
  try {
    const ownerResult = await resend.emails.send({
      from,
      to: [ownerEmail],
      reply_to: data.customerEmail || undefined,
      subject: `Nuevo pedido #${orderNumber} - ${money(data.totalAmount, data.currency)} - ${BRAND_NAME}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:20px;">
          <p style="color:#8B4513;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 8px;">${BRAND_NAME}</p>
          <h1 style="color:#8B4513;font-size:22px;">Nuevo pedido pagado #${orderNumber}</h1>
          <p><strong>Cliente:</strong> ${escapeHtml(data.customerName)}<br>
          <strong>Email:</strong> ${escapeHtml(data.customerEmail)}<br>
          ${data.customerPhone ? `<strong>Teléfono:</strong> ${escapeHtml(data.customerPhone)}<br>` : ''}
          <strong>Idioma:</strong> ${lang}</p>
          <p><strong>Dirección de envío:</strong><br>${address}</p>
          ${itemsTable(data, TEXTS.es)}
        </div>`,
    });
    if (ownerResult.error) {
      console.error('Owner email error:', ownerResult.error);
      result.owner = `failed: ${errorText(ownerResult.error)}`;
    } else {
      result.owner = 'sent';
    }
  } catch (err) {
    console.error('Owner email exception:', err);
    result.owner = `failed: ${errorText(err)}`;
  }

  // 2) Confirmación al cliente.
  if (!data.customerEmail) return result;
  try {
    const customerResult = await resend.emails.send({
      from,
      to: [data.customerEmail],
      subject: t.subject.replace('{n}', orderNumber),
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:20px;">
          <p style="color:#8B4513;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 8px;">${BRAND_NAME}</p>
          <h1 style="color:#8B4513;font-size:24px;">${t.title.replace('{name}', safeName)}</h1>
          <p style="color:#333;font-size:16px;line-height:1.6;">${t.intro}</p>
          <p style="color:#8B4513;font-size:17px;line-height:1.6;font-style:italic;">${t.thanks}</p>
          <p style="color:#666;">${t.order} <strong>#${orderNumber}</strong></p>
          ${itemsTable(data, t)}
          <p style="color:#333;"><strong>${t.shipTo}</strong><br>${address}</p>
          <p style="color:#666;font-size:14px;">${t.delivery}</p>
          ${
            orderLink
              ? `<p style="margin:24px 0;"><a href="${escapeHtml(orderLink)}" style="background:#d97706;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-family:Arial,sans-serif;">${t.view}</a></p>`
              : ''
          }
          <p style="color:#8B4513;font-size:14px;">${t.footer}</p>
        </div>`,
    });
    if (customerResult.error) {
      console.error('Customer email error:', customerResult.error);
      result.customer = `failed: ${errorText(customerResult.error)}`;
    } else {
      result.customer = 'sent';
    }
  } catch (err) {
    console.error('Customer email exception:', err);
    result.customer = `failed: ${errorText(err)}`;
  }
  return result;
};

export type ShippingEmailStatus = 'sent' | 'skipped' | `failed: ${string}`;

/** Correo al cliente cuando el pedido se marca como enviado. */
export const sendShippingEmail = async (data: ShippingEmailData): Promise<ShippingEmailStatus> => {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured: shipping email skipped');
    return 'skipped';
  }
  if (!data.customerEmail) return 'skipped';

  const resend = new Resend(apiKey);
  const from = Deno.env.get('RESEND_FROM_EMAIL') || DEFAULT_FROM_EMAIL;
  const lang: Lang = (['es', 'fr', 'en'] as const).includes(data.language as Lang)
    ? (data.language as Lang)
    : 'es';
  const t = SHIPPED_TEXTS[lang];
  const orderNumber = data.orderId.slice(0, 8).toUpperCase();
  const safeName = escapeHtml(data.customerName || t.friend);
  const safeCarrier = escapeHtml(data.carrier);
  const safeTracking = escapeHtml(data.trackingNumber);
  const trackingHref = data.trackingUrl?.trim() || null;

  try {
    const result = await resend.emails.send({
      from,
      to: [data.customerEmail],
      subject: t.subject.replace('{n}', orderNumber),
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:20px;">
          <p style="color:#8B4513;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 8px;">${BRAND_NAME}</p>
          <h1 style="color:#8B4513;font-size:24px;">${t.title.replace('{name}', safeName)}</h1>
          <p style="color:#333;font-size:16px;line-height:1.6;">${t.intro}</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:15px;">
            <tr>
              <td style="padding:8px 4px;color:#666;">${t.order}</td>
              <td style="padding:8px 4px;text-align:right;font-weight:bold;">#${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:8px 4px;color:#666;">${t.carrier}</td>
              <td style="padding:8px 4px;text-align:right;font-weight:bold;">${safeCarrier}</td>
            </tr>
            <tr>
              <td style="padding:8px 4px;color:#666;">${t.tracking}</td>
              <td style="padding:8px 4px;text-align:right;font-weight:bold;font-family:Arial,sans-serif;">${safeTracking}</td>
            </tr>
          </table>
          ${
            trackingHref
              ? `<p style="margin:24px 0;"><a href="${escapeHtml(trackingHref)}" style="background:#d97706;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-family:Arial,sans-serif;">${t.trackLink}</a></p>`
              : `<p style="color:#666;font-size:14px;">${t.tracking}: <strong>${safeTracking}</strong></p>`
          }
          <p style="color:#8B4513;font-size:14px;">${t.footer}</p>
        </div>`,
    });
    if (result.error) {
      console.error('Shipping email error:', result.error);
      return `failed: ${errorText(result.error)}`;
    }
    return 'sent';
  } catch (err) {
    console.error('Shipping email exception:', err);
    return `failed: ${errorText(err)}`;
  }
};
