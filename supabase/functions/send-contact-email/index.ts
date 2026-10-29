import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from 'https://esm.sh/zod@3.22.4';
import { BRAND_NAME, DEFAULT_FROM_EMAIL } from '../_shared/brand.ts';
import { escapeHtml, getCorsHeaders, jsonResponse } from '../_shared/cors.ts';
import { checkRateLimit, getClientIp } from '../_shared/rateLimit.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Remitente y destinatario configurables (secretos RESEND_FROM_EMAIL y OWNER_EMAIL).
// Con "onboarding@resend.dev" Resend solo entrega correos al titular de la cuenta:
// para escribir a cualquier cliente hay que verificar un dominio propio en Resend.
const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || DEFAULT_FROM_EMAIL;
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') || 'yaricrochetfina@gmail.com';

// Rate limiting configuration
const RATE_LIMIT_ACTION = 'send_contact_email';
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 contact emails per minute per IP
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute window

// Supported languages
const SUPPORTED_LANGUAGES = ['es', 'fr', 'en'] as const;

// Input validation schema
const contactEmailSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z.string()
    .trim()
    .min(1, 'Message is required')
    .max(5000, 'Message must be less than 5000 characters'),
  language: z.enum(SUPPORTED_LANGUAGES).optional().default('es'),
});

type ContactEmailRequest = z.infer<typeof contactEmailSchema>;

const getEmailContent = (name: string, message: string, language: typeof SUPPORTED_LANGUAGES[number] = 'es') => {
  // Escape user inputs for safe HTML rendering
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);

  const translations = {
    es: {
      confirmSubject: `Hemos recibido tu mensaje - ${BRAND_NAME}`,
      confirmTitle: `¡Gracias por contactarnos, ${safeName}!`,
      confirmBody: "Hemos recibido tu mensaje y te responderemos lo antes posible.",
      confirmFooter: `Con cariño,<br>El equipo de ${BRAND_NAME}`,
      notifySubject: `Nuevo mensaje de contacto de ${safeName}`,
      notifyTitle: "Nuevo Mensaje de Contacto",
      safeMessage,
    },
    fr: {
      confirmSubject: `Nous avons reçu votre message - ${BRAND_NAME}`,
      confirmTitle: `Merci de nous avoir contactés, ${safeName}!`,
      confirmBody: "Nous avons reçu votre message et vous répondrons dès que possible.",
      confirmFooter: `Avec amour,<br>L'équipe ${BRAND_NAME}`,
      notifySubject: `Nouveau message de contact de ${safeName}`,
      notifyTitle: "Nouveau Message de Contact",
      safeMessage,
    },
    en: {
      confirmSubject: `We received your message - ${BRAND_NAME}`,
      confirmTitle: `Thank you for contacting us, ${safeName}!`,
      confirmBody: "We have received your message and will respond as soon as possible.",
      confirmFooter: `With love,<br>The ${BRAND_NAME} Team`,
      notifySubject: `New contact message from ${safeName}`,
      notifyTitle: "New Contact Message",
      safeMessage,
    },
  };

  return translations[language];
};

// Map internal errors to safe user-facing messages
const getSafeErrorMessage = (error: unknown): string => {
  console.error('Contact email error:', error);
  
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid request data';
  }
  
  return 'Unable to send your message. Please try again.';
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Reject requests with invalid or missing origin
  if (!corsHeaders) {
    return jsonResponse({ error: 'Invalid origin' }, 403, null);
  }

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(
    supabaseUrl,
    supabaseKey,
    clientIp,
    RATE_LIMIT_ACTION,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_SECONDS
  );
  if (!rateLimit.allowed) {
    console.warn('Rate limit exceeded for IP:', clientIp);
    const retryAfter = rateLimit.resetAt
      ? Math.max(1, Math.ceil(rateLimit.resetAt - Date.now() / 1000))
      : 60;
    return jsonResponse(
      { error: 'Too many requests. Please try again in a minute.' },
      429,
      corsHeaders,
      { 'Retry-After': String(retryAfter) }
    );
  }

  try {
    const { name, email, message, language } = contactEmailSchema.parse(await req.json());

    console.log("Sending contact emails for:", { language });

    const content = getEmailContent(name, message, language);

    // 1) Aviso a Yari Crochet (lo importante: el mensaje no debe perderse aunque falle la confirmación).
    const notificationEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      reply_to: email,
      subject: content.notifySubject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B4513; font-size: 24px;">${content.notifyTitle}</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong>Correo electrónico:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p style="margin: 10px 0;"><strong>Idioma:</strong> ${language}</p>
            <p style="margin: 10px 0;"><strong>Mensaje:</strong></p>
            <p style="color: #333; white-space: pre-wrap;">${content.safeMessage}</p>
          </div>
        </div>
      `,
    });

    if (notificationEmail.error) {
      console.error("Notification email error:", notificationEmail.error);
      throw new Error('notification_failed');
    }

    // 2) Confirmación a la persona que escribe (best-effort).
    try {
      const confirmationEmail = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: content.confirmSubject,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B4513; font-size: 24px;">${content.confirmTitle}</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">${content.confirmBody}</p>
            <div style="background-color: #f5f5dc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; font-style: italic; margin: 0; white-space: pre-wrap;">"${content.safeMessage}"</p>
            </div>
            <p style="color: #8B4513; font-size: 14px;">${content.confirmFooter}</p>
          </div>
        `,
      });
      if (confirmationEmail.error) {
        console.error("Confirmation email error:", confirmationEmail.error);
      }
    } catch (confirmError) {
      console.error("Confirmation email exception:", confirmError);
    }

    return jsonResponse({ success: true }, 200, corsHeaders);
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error);
    return jsonResponse({ error: safeMessage }, error instanceof z.ZodError ? 400 : 500, corsHeaders);
  }
};

serve(handler);
