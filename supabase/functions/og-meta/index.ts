import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("product");
    const siteUrl = url.searchParams.get("site") || "https://yaricrochetfina.lovable.app";

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch product data
    const { data: product, error } = await supabase
      .from("products")
      .select("id, name, description, price, image, images")
      .eq("id", productId)
      .single();

    if (error || !product) {
      console.error("Product not found:", error);
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve image URL - try images array first, then single image
    let imageUrl = product.image;
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
    }

    // Construct absolute image URL for OG meta tags
    // Priority: 1) Already absolute URL, 2) OG-images bucket, 3) Default fallback
    let absoluteImageUrl = `${siteUrl}/placeholder.svg`;
    
    if (imageUrl?.startsWith('http')) {
      // Already an absolute URL (e.g., from storage or external CDN)
      absoluteImageUrl = imageUrl;
    } else if (imageUrl) {
      // Extract filename and check for OG image in storage bucket
      const filename = imageUrl.split('/').pop()?.trim();
      if (filename) {
        // Use Supabase Storage public URL for OG images
        absoluteImageUrl = `${supabaseUrl}/storage/v1/object/public/og-images/${filename}`;
      }
    }

    // Prepare meta content
    const title = `${product.name} - YariCrochetFina`;
    const description = product.description?.substring(0, 160) || `Pieza única de crochet: ${product.name}. €${product.price}`;
    const productUrl = `${siteUrl}/?product=${product.id}`;

    // Return meta tags as JSON for the frontend to use
    // Or return HTML for crawlers
    const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
    const isCrawler = /bot|crawl|spider|facebookexternalhit|whatsapp|telegram|twitter|linkedin|pinterest|slack|discord/i.test(userAgent);

    if (isCrawler || url.searchParams.get("html") === "true") {
      // Return full HTML page with OG meta tags for crawlers
      const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${escapeHtml(productUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(absoluteImageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="YariCrochetFina">
  <meta property="product:price:amount" content="${product.price}">
  <meta property="product:price:currency" content="EUR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(productUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(absoluteImageUrl)}">
  
  <!-- Redirect to actual page after meta tags are parsed -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(productUrl)}">
  <link rel="canonical" href="${escapeHtml(productUrl)}">
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(productUrl)}">${escapeHtml(product.name)}</a>...</p>
</body>
</html>`;

      return new Response(html, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Return JSON for non-crawler requests
    return new Response(
      JSON.stringify({
        title,
        description,
        image: absoluteImageUrl,
        url: productUrl,
        price: product.price,
        currency: "EUR",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Error in og-meta function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
