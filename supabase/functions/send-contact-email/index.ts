import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from 'https://esm.sh/zod@3.22.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// Escape HTML to prevent XSS in email templates
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const getEmailContent = (name: string, message: string, language: typeof SUPPORTED_LANGUAGES[number] = 'es') => {
  // Escape user inputs for safe HTML rendering
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);

  const translations = {
    es: {
      confirmSubject: "Hemos recibido tu mensaje - YariCrochetFina",
      confirmTitle: `¡Gracias por contactarnos, ${safeName}!`,
      confirmBody: "Hemos recibido tu mensaje y te responderemos lo antes posible.",
      confirmFooter: "Con cariño,<br>El equipo de YariCrochetFina",
      notifySubject: `Nuevo mensaje de contacto de ${safeName}`,
      notifyTitle: "Nuevo Mensaje de Contacto",
      safeMessage,
    },
    fr: {
      confirmSubject: "Nous avons reçu votre message - YariCrochetFina",
      confirmTitle: `Merci de nous avoir contactés, ${safeName}!`,
      confirmBody: "Nous avons reçu votre message et vous répondrons dès que possible.",
      confirmFooter: "Avec amour,<br>L'équipe YariCrochetFina",
      notifySubject: `Nouveau message de contact de ${safeName}`,
      notifyTitle: "Nouveau Message de Contact",
      safeMessage,
    },
    en: {
      confirmSubject: "We received your message - YariCrochetFina",
      confirmTitle: `Thank you for contacting us, ${safeName}!`,
      confirmBody: "We have received your message and will respond as soon as possible.",
      confirmFooter: "With love,<br>The YariCrochetFina Team",
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const rawBody = await req.json();
    const validatedInput = contactEmailSchema.parse(rawBody);
    const { name, email, message, language } = validatedInput;
    
    console.log("Sending contact emails for:", { name, email, language });

    const content = getEmailContent(name, message, language);

    // Send confirmation email to the visitor
    const confirmationEmail = await resend.emails.send({
      from: "YariCrochetFina <onboarding@resend.dev>",
      to: [email],
      subject: content.confirmSubject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B4513; font-size: 24px;">${content.confirmTitle}</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">${content.confirmBody}</p>
          <div style="background-color: #f5f5dc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; font-style: italic; margin: 0;">"${content.safeMessage}"</p>
          </div>
          <p style="color: #8B4513; font-size: 14px;">${content.confirmFooter}</p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    // Send notification email to YariCrochetFina
    const notificationEmail = await resend.emails.send({
      from: "YariCrochetFina Contact <onboarding@resend.dev>",
      to: ["yaricrochetfina@gmail.com"],
      subject: content.notifySubject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B4513; font-size: 24px;">${content.notifyTitle}</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p style="margin: 10px 0;"><strong>Mensaje:</strong></p>
            <p style="color: #333; white-space: pre-wrap;">${content.safeMessage}</p>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error);
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        status: error instanceof z.ZodError ? 400 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);