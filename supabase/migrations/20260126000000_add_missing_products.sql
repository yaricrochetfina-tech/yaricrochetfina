-- Añade al catálogo los 4 productos que existían en la tienda anterior y no estaban en la
-- base de datos nueva, con sus traducciones al inglés y al francés. Los precios están en CAD.
-- Es idempotente: no duplica productos si ya existen (se identifican por su nombre).

INSERT INTO public.products
  (name, price, style, category, image, images, description, materials, in_stock, stock_quantity)
SELECT v.name, v.price, v.style, v.category, v.image, v.images, v.description, v.materials, true, 1
FROM (VALUES
  (
    'Top Blanco y Café', 35.00, 'Boho Chic', 'Tops',
    '/src/assets/top-blanco-cafe-frente.png',
    ARRAY['/src/assets/top-blanco-cafe-frente.png', '/src/assets/top-blanco-cafe-lateral.png', '/src/assets/top-blanco-cafe-espalda.png'],
    'Elegante top halter tejido a mano en blanco y café, con encaje decorativo y cordones ajustables.',
    ARRAY['Hilo 100% algodón', 'Tejido a mano']
  ),
  (
    'Poncho Blanc à Franges', 35.00, 'Boho Chic', 'Ponchos',
    '/src/assets/poncho-blanco-flecos-frente.png',
    ARRAY['/src/assets/poncho-blanco-flecos-frente.png', '/src/assets/poncho-blanco-flecos-detalle.png', '/src/assets/poncho-blanco-flecos-lateral.png', '/src/assets/poncho-blanco-flecos-espalda.png'],
    'Elegante poncho blanco hecho a mano, con flores en técnica granny y flecos decorativos.',
    ARRAY['Hilo 100% algodón', 'Tejido a mano']
  ),
  (
    'Blusa con Mangas Beige', 45.00, 'Vintage', 'Blusas',
    '/src/assets/blusa-mangas-beige-frente.jpg',
    ARRAY['/src/assets/blusa-mangas-beige-frente.jpg', '/src/assets/blusa-mangas-beige-lateral.jpg', '/src/assets/blusa-mangas-beige-espalda.jpg'],
    'Blusa elegante de manga corta en tono beige con patrones calados. Corte recto con remate acanalado.',
    ARRAY['Hilo 100% algodón', 'Tejido a mano']
  ),
  (
    'Blusa Corta Cruzada Flores', 35.00, 'Shabby Chic', 'Blusas',
    '/src/assets/blusa-corta-cruzada-frente.png',
    ARRAY['/src/assets/blusa-corta-cruzada-frente.png', '/src/assets/blusa-corta-cruzada-lateral-a.png', '/src/assets/blusa-corta-cruzada-lateral-b.png', '/src/assets/blusa-corta-cruzada-lateral-c.png', '/src/assets/blusa-corta-cruzada-espalda.png'],
    'Delicada blusa corta cruzada en blanco, de tejido calado y con flores de crochet en rosa y amarillo en los hombros.',
    ARRAY['Hilo 100% algodón', 'Tejido a mano']
  )
) AS v(name, price, style, category, image, images, description, materials)
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.name = v.name);

-- Precio real de la Blusa Granny con Franjas: 40 CAD.
UPDATE public.products SET price = 40.00 WHERE name = 'Blusa Granny con Franjas';

-- Traducciones (en / fr) de los productos nuevos.
INSERT INTO public.product_translations (product_id, language, name, description, materials)
SELECT p.id, v.language, v.name, v.description, v.materials
FROM (VALUES
  ('Top Blanco y Café', 'en', 'White and Brown Top',
   'Elegant hand-knit halter top in white and brown, with decorative lace and adjustable ties.',
   ARRAY['100% cotton yarn', 'Handmade']),
  ('Top Blanco y Café', 'fr', 'Haut Blanc et Marron',
   'Élégant haut dos-nu tricoté à la main en blanc et marron, avec dentelle décorative et cordons réglables.',
   ARRAY['Fil 100 % coton', 'Fait main']),
  ('Poncho Blanc à Franges', 'en', 'White Poncho with Fringes',
   'Elegant handmade white poncho with granny-technique flowers and decorative fringes.',
   ARRAY['100% cotton yarn', 'Handmade']),
  ('Poncho Blanc à Franges', 'fr', 'Poncho Blanc à Franges',
   'Élégant poncho blanc fait à la main, avec des fleurs en technique granny et des franges décoratives.',
   ARRAY['Fil 100 % coton', 'Fait main']),
  ('Blusa con Mangas Beige', 'en', 'Beige Blouse with Sleeves',
   'Elegant short-sleeved blouse in a beige shade with openwork patterns. Straight cut with a ribbed finish.',
   ARRAY['100% cotton yarn', 'Handmade']),
  ('Blusa con Mangas Beige', 'fr', 'Blouse Beige avec Manches',
   'Élégante blouse à manches courtes de ton beige, aux motifs ajourés. Coupe droite avec finition côtelée.',
   ARRAY['Fil 100 % coton', 'Fait main']),
  ('Blusa Corta Cruzada Flores', 'en', 'Short Wrap Blouse with Flowers',
   'Delicate short white wrap blouse in openwork, with pink and yellow crochet flowers on the shoulders.',
   ARRAY['100% cotton yarn', 'Handmade']),
  ('Blusa Corta Cruzada Flores', 'fr', 'Blouse Courte Croisée à Fleurs',
   'Délicate blouse courte croisée blanche au point ajouré, avec des fleurs au crochet roses et jaunes sur les épaules.',
   ARRAY['Fil 100 % coton', 'Fait main'])
) AS v(es_name, language, name, description, materials)
JOIN public.products p ON p.name = v.es_name
ON CONFLICT (product_id, language) DO NOTHING;
