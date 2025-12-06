import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
  language?: string;
}

const getEmailContent = (name: string, message: string, language: string = 'es') => {
  const translations = {
    es: {
      confirmSubject: "Hemos recibido tu mensaje - YariCrochetFina",
      confirmTitle: `¡Gracias por contactarnos, ${name}!`,
      confirmBody: "Hemos recibido tu mensaje y te responderemos lo antes posible.",
      confirmFooter: "Con cariño,<br>El equipo de YariCrochetFina",
      notifySubject: `Nuevo mensaje de contacto de ${name}`,
      notifyTitle: "Nuevo Mensaje de Contacto",
    },
    fr: {
      confirmSubject: "Nous avons reçu votre message - YariCrochetFina",
      confirmTitle: `Merci de nous avoir contactés, ${name}!`,
      confirmBody: "Nous avons reçu votre message et vous répondrons dès que possible.",
      confirmFooter: "Avec amour,<br>L'équipe YariCrochetFina",
      notifySubject: `Nouveau message de contact de ${name}`,
      notifyTitle: "Nouveau Message de Contact",
    },
    en: {
      confirmSubject: "We received your message - YariCrochetFina",
      confirmTitle: `Thank you for contacting us, ${name}!`,
      confirmBody: "We have received your message and will respond as soon as possible.",
      confirmFooter: "With love,<br>The YariCrochetFina Team",
      notifySubject: `New contact message from ${name}`,
      notifyTitle: "New Contact Message",
    },
  };

  return translations[language as keyof typeof translations] || translations.es;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, language = 'es' }: ContactEmailRequest = await req.json();
    
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
            <p style="color: #666; font-style: italic; margin: 0;">"${message}"</p>
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
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Mensaje:</strong></p>
            <p style="color: #333; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    return new Response(
      JSON.stringify({ success: true, confirmationEmail, notificationEmail }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
