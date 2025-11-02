-- Fix 1: Add Admin RLS Policies for Operational Data

-- Contact Messages Policies
CREATE POLICY "Admins can view contact messages"
ON contact_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact message status"
ON contact_messages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Newsletter Policies
CREATE POLICY "Admins can view newsletter subscribers"
ON newsletter_subscribers FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newsletter subscribers"
ON newsletter_subscribers FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Products Management Policies
CREATE POLICY "Admins can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products"
ON products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products"
ON products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Add video_url column for products
ALTER TABLE products ADD COLUMN video_url text;

-- Fix 3: Migrate products from mockData to database (database will auto-generate UUIDs)
INSERT INTO products (name, price, style, category, image, description, materials, in_stock, video_url) VALUES
('Blusa Boho Multicolor', 35.00, 'Boho Chic', 'Blusas', '/src/assets/blusa-boho-multicolor.png', 'Chaleco boho tejido a mano con hermosa mezcla de colores terrosos. Combina tonos marrones, azules y naranjas en un diseño único.', ARRAY['Hilo multicolor', 'Fibras naturales'], true, 'https://www.youtube.com/embed/vPoZClfWfpA'),
('Blusa Rosa Encaje', 35.00, 'Shabby Chic', 'Blusas', '/src/assets/blusa-rosa-encaje.png', 'Delicada blusa rosa con intrincados patrones de encaje. Perfecta para un look romántico y femenino.', ARRAY['Hilo de algodón rosa', 'Encaje artesanal'], true, 'https://www.youtube.com/embed/ToCRJFbC-fY'),
('Blusa Flores y Franjas', 35.00, 'Hippie', 'Blusas', '/src/assets/blusa-flores-franjas.png', 'Top bohemio con motivos florales en rosa y verde. Incluye franjas decorativas que le dan un toque especial.', ARRAY['Hilo de flores', 'Fibras de colores'], true, null),
('Blusa Granny con Franjas', 40.00, 'Vintage', 'Blusas', '/src/assets/blusa-granny-franjas.png', 'Blusa colorida con técnica granny square. Combina colores vibrantes con franjas colgantes para un look único.', ARRAY['Hilo multicolor', 'Algodón orgánico'], true, 'https://www.youtube.com/embed/3OFOEB8UVoA'),
('Blusa con Fajón Matizado', 45.00, 'Boho Chic', 'Blusas', '/src/assets/blusa-fajon-matizado.jpg', 'Elegante blusa con diseño de rayas horizontales en colores rojo, azul y crema. Con fajón incorporado.', ARRAY['Hilo matizado', 'Lana suave'], true, 'https://www.youtube.com/embed/A8cyqsli_Ps'),
('Blusa con Fajón Azul', 45.00, 'Traditional', 'Blusas', '/src/assets/blusa-fajon-azul.jpg', 'Blusa clásica con rayas en tonos azul, blanco y crema. Diseño tradicional con acabado moderno.', ARRAY['Hilo de algodón', 'Fibras naturales'], true, 'https://www.youtube.com/embed/jzzblSdaf5s'),
('Blusa Citron Verde', 35.00, 'Hippie', 'Blusas', '/src/assets/blusa-citron-verde.png', 'Vibrante blusa verde lima con patrones de encaje abierto. Perfecta para los días de verano.', ARRAY['Hilo verde citron', 'Algodón orgánico'], true, 'https://www.youtube.com/embed/MvX46FCODkk'),
('Blusa Crema Cruzada', 35.00, 'Shabby Chic', 'Blusas', '/src/assets/blusa-crema-cruzada.png', 'Delicada blusa corta color crema con diseño cruzado. Ideal para combinar con faldas altas.', ARRAY['Hilo de algodón crema', 'Encaje fino'], true, 'https://www.youtube.com/embed/AlcDlQigR4I'),
('Blusa Granny Azul', 45.00, 'Vintage', 'Blusas', '/src/assets/blusa-granny-azul.jpg', 'Hermosa blusa azul marino con técnica granny y detalles en amarillo. Patrón tradicional con toque moderno.', ARRAY['Hilo azul marino', 'Detalles dorados'], true, 'https://www.youtube.com/embed/UEPbqO5TWY4'),
('Blusa Marina a Rayas', 40.00, 'Traditional', 'Blusas', '/src/assets/blusa-marina-rayas.png', 'Blusa estilo marinero con rayas azules y blancas. Incluye encaje en el cuello y cordón de ajuste.', ARRAY['Hilo marina', 'Encaje blanco'], true, 'https://www.youtube.com/embed/rV0Fppnp5Fk'),
('Gilet Mandala Sin Mangas', 45.00, 'Boho Chic', 'Gilets', '/src/assets/gilet-mandala-sans-manches.png', 'Elegante gilet con diseño mandala tejido a mano. Colores terrosos que crean un patrón hipnótico y bohemio.', ARRAY['Hilo de algodón', 'Fibras naturales'], true, null),
('Gilet Granny Negro con Franjas', 45.00, 'Vintage', 'Gilets', '/src/assets/gilet-granny-franjas-negro.png', 'Gilet negro con técnica granny square y franjas decorativas. Perfecto para un look elegante y atemporal.', ARRAY['Hilo negro', 'Fibras recicladas'], true, null),
('Gilet Multicolor con Franjas', 45.00, 'Hippie', 'Gilets', '/src/assets/gilet-multicolor-franjas.png', 'Vibrante gilet multicolor con franjas colgantes. Combina múltiples tonos para un look bohemio y juvenil.', ARRAY['Hilos multicolores', 'Algodón orgánico'], true, null),
('Gilet Estilo Mariposa', 45.00, 'Shabby Chic', 'Gilets', '/src/assets/gilet-mariposa.png', 'Delicado gilet con forma de mariposa en tonos suaves. Diseño romántico perfecto para ocasiones especiales.', ARRAY['Hilo de seda', 'Encaje artesanal'], true, null),
('Gilet Mandala con Mangas', 45.00, 'Boho Chic', 'Gilets', '/src/assets/gilet-mandala-con-mangas.png', 'Gilet mandala con mangas incorporadas. Diseño complejo que combina tradición y modernidad en cada puntada.', ARRAY['Hilo premium', 'Fibras naturales'], true, null),
('Gilet Mandala Verde Citron', 45.00, 'Hippie', 'Gilets', '/src/assets/gilet-mandala-verde-citron.png', 'Refrescante gilet verde citron con patrón mandala. Perfecto para primavera y verano con su color vibrante.', ARRAY['Hilo verde citron', 'Algodón orgánico'], true, null),
('Gilet Granny Café con Franjas', 45.00, 'Traditional', 'Gilets', '/src/assets/gilet-granny-franjas-cafe.png', 'Gilet en tonos café con técnica granny y franjas. Diseño clásico que evoca la calidez de los tejidos tradicionales.', ARRAY['Hilo café', 'Lana natural'], true, null),
('Gilet Mandala Rosa', 45.00, 'Shabby Chic', 'Gilets', '/src/assets/gilet-mandala-rosa.png', 'Romántico gilet rosa con diseño mandala delicado. Combina feminidad con la fuerza del tejido artesanal.', ARRAY['Hilo rosa suave', 'Encaje fino'], true, null),
('Gilet Multicolor Especial', 35.00, 'Hippie', 'Gilets', '/src/assets/gilet-multicolor-especial.png', 'Vibrante gilet multicolor con texturas florales en azul, naranja, amarillo y rosa. Diseño único que combina múltiples colores en perfecta armonía.', ARRAY['Hilos multicolores', 'Fibras texturizadas'], true, null),
('Gilet Granny Negro Elegante', 45.00, 'Vintage', 'Gilets', '/src/assets/gilet-granny-franjas-negro-b.png', 'Elegante gilet negro con patrón granny sofisticado. Perfecto para looks urbanos con toque artesanal.', ARRAY['Hilo negro premium', 'Fibras de alta calidad'], true, null),
('Chaleco de Brillo Dorado', 35.00, 'Boho Chic', 'Chalecos', '/src/assets/chaleco-brillo-dorado.jpg', 'Elegante chaleco largo con hilos brillantes dorados. Textura suave y esponjosa perfecta para looks sofisticados.', ARRAY['Hilo dorado brillante', 'Fibras sintéticas suaves'], true, null),
('Chaleco de Brillo con Borde Negro', 35.00, 'Vintage', 'Chalecos', '/src/assets/chaleco-brillo-dorado-negro.jpg', 'Chaleco largo de textura esponjosa con elegantes bordes negros. Combina sofisticación con comodidad.', ARRAY['Hilo texturizado', 'Bordes de hilo negro'], true, null),
('Chaleco Corto Vintage Azul', 30.00, 'Vintage', 'Chalecos', '/src/assets/chaleco-corto-vintage.jpg', 'Chaleco corto azul con detalles florales multicolores. Diseño clásico con cordón de ajuste frontal.', ARRAY['Hilo azul turquesa', 'Detalles multicolores'], true, null),
('Chaleco Vintage Rosa', 30.00, 'Shabby Chic', 'Chalecos', '/src/assets/chaleco-vintage-rosa.jpg', 'Hermoso chaleco en tonos rosa y morado con técnica granny square. Diseño romántico y versátil.', ARRAY['Hilos en tonos rosa', 'Técnica granny square'], true, null),
('Chaleco Vintage con Flecos', 30.00, 'Traditional', 'Chalecos', '/src/assets/chaleco-vintage-flecos.jpg', 'Chaleco tradicional con motivos granny square y flecos decorativos. Colores vibrantes en diseño atemporal.', ARRAY['Hilos multicolores', 'Flecos artesanales'], true, null),
('Chaleco de Brillo Negro', 35.00, 'Vintage', 'Chalecos', '/src/assets/chaleco-brillo-negro.jpg', 'Elegante chaleco negro con textura brillante y esponjosa. Perfecto para looks sofisticados y modernos.', ARRAY['Hilo negro brillante', 'Fibras texturizadas'], true, null),
('Chaleco Granny Vintage Floral', 30.00, 'Shabby Chic', 'Chalecos', '/src/assets/chaleco-granny-vintage.jpg', 'Chaleco sin mangas con hermosos motivos florales en técnica granny. Base blanca con detalles coloridos.', ARRAY['Hilo blanco base', 'Detalles florales multicolores'], true, null),
('Chaleco Boho Mandala', 35.00, 'Boho Chic', 'Chalecos', '/src/assets/chaleco-boho.jpg', 'Chaleco bohemio con círculos mandala coloridos sobre base negra. Diseño único con cordón de ajuste.', ARRAY['Base negra calada', 'Mandalas multicolores'], true, null),
('Chaleco Vintage Multicolor', 45.00, 'Hippie', 'Chalecos', '/src/assets/chaleco-vintage-multicolor.jpg', 'Espectacular chaleco largo con mangas y diseños geométricos multicolores. Pieza única de arte textil.', ARRAY['Hilos multicolores premium', 'Técnica geométrica'], true, null),
('Túnica Larga Crema con Mangas', 50.00, 'Boho Chic', 'Túnicas', '/src/assets/tunica-crema-mangas-frente.png', 'Elegante túnica larga tejida a mano en tono crema natural. Presenta un hermoso diseño de red calada con detalles de flores en los bordes y mangas acampanadas. Esta pieza única es perfecta como vestido de playa o sobre un vestido básico. El trabajo artesanal incluye un medallón central en la espalda y terminaciones onduladas en el bajo. Solo disponible la pieza mostrada, hecha a mano por Yaritza Salgado Fina.', ARRAY['Hilo de algodón crema', 'Punto calado', 'Flores de crochet'], true, null),
('Túnica Larga Rosa Delicada', 50.00, 'Shabby Chic', 'Túnicas', '/src/assets/tunica-rosa-frente.png', 'Romántica túnica larga en suave tono rosa degradado. El diseño calado permite ver delicados patrones de red y flores, con un hermoso medallón circular en la espalda. Las mangas cortas tipo mariposa añaden un toque femenino. Ideal para eventos especiales o como salida de playa elegante. Pieza única e irrepetible, tejida completamente a mano por Yaritza Salgado Fina.', ARRAY['Hilo de algodón rosa', 'Punto calado degradado', 'Medallón central'], true, null),
('Túnica Larga Azul Cielo', 50.00, 'Boho Chic', 'Túnicas', '/src/assets/tunica-azul-cielo-frente.png', 'Hermosa túnica larga en vibrante azul cielo con diseño de red muy abierta. El medallón superior y la red calada crean un efecto visual impresionante. Las mangas cortas y el bajo con ondas decorativas completan este diseño bohemio. Perfecta para la playa o eventos casuales de verano. Cada pieza es única, disponible solo la mostrada, creada a mano por Yaritza Salgado Fina.', ARRAY['Hilo de algodón azul cielo', 'Red calada', 'Medallón superior'], true, null),
('Túnica de Punta Negra y Roja', 50.00, 'Hippie', 'Túnicas', '/src/assets/tunica-punta-negra-roja-frente.png', 'Impactante túnica asimétrica tipo poncho en negro y rojo. El diseño geométrico en zigzag combina red calada con franjas contrastantes. Los laterales caen en punta creando una silueta dramática y moderna. Las mangas cortas presentan el mismo patrón decorativo. Una pieza de arte textil única, perfecta para destacar en cualquier ocasión. Solo disponible la pieza mostrada, tejida a mano por Yaritza Salgado Fina.', ARRAY['Hilo negro y rojo', 'Diseño geométrico', 'Corte asimétrico'], true, null),
('Túnica Mandala Multicolor', 70.00, 'Hippie', 'Túnicas', '/src/assets/tunica-mandala-multicolor-frente.png', 'Extraordinaria túnica sin mangas con diseño de mandala y círculos de colores vibrantes. La espalda presenta un gran mandala circular multicolor, mientras que la parte inferior combina círculos en turquesa con detalles en naranja, rosa, amarillo y verde. La base termina con un patrón en zigzag azul y amarillo. Una verdadera obra de arte textil que requiere horas de trabajo artesanal. Pieza única e irrepetible, completamente tejida a mano por Yaritza Salgado Fina.', ARRAY['Hilos multicolores premium', 'Técnica mandala', 'Círculos de crochet', 'Patrón zigzag'], true, null),
('Vestido Blanco Mandala Corto', 60.00, 'Boho Chic', 'Vestidos', '/src/assets/vestido-blanco-frente.png', 'Hermoso vestido corto blanco con diseño de mandalas circulares en el corpiño. El escote presenta detalles de cordón decorativo y mangas cortas delicadas. La falda en punto calado crea un efecto ligero y elegante. Perfecto para eventos especiales o salidas de verano. Pieza única tejida completamente a mano.', ARRAY['Hilo de algodón blanco', 'Punto mandala', 'Encaje calado'], true, null),
('Vestido Extra Largo Crema', 80.00, 'Shabby Chic', 'Vestidos', '/src/assets/vestido-crema-largo-frente.png', 'Espectacular vestido largo en tono crema con diseño sofisticado. El corpiño presenta un tejido de red con cuello decorativo y mangas cortas. La parte media incorpora franjas colgantes que añaden movimiento, seguido de una falda larga con patrón en zigzag. Una pieza elegante perfecta para ocasiones especiales o como vestido de playa de lujo.', ARRAY['Hilo de algodón crema premium', 'Franjas tejidas', 'Patrón zigzag'], true, null),
('Vestido con Franjas Multicolor', 50.00, 'Hippie', 'Vestidos', '/src/assets/vestido-franjas-frente.png', 'Vibrante vestido halter con diseño de franjas en colores rosa, verde y blanco. El corpiño en punto calado crema contrasta hermosamente con la falda a rayas. La espalda presenta un cierre de cordón decorativo que permite ajuste personalizado. Perfecto para looks bohemios y festivales de verano.', ARRAY['Hilos multicolores', 'Punto calado', 'Patrón de franjas'], true, null),
('Vestido Chocolate Elegante', 40.00, 'Vintage', 'Vestidos', '/src/assets/vestido-chocolate-frente.jpg', 'Elegante vestido corto en tono chocolate intenso con diseño de mandalas calados en el corpiño. Las mangas cortas presentan el mismo patrón circular delicado. La cintura está definida por un tejido acanalado, seguido de una falda con más patrones calados. Un vestido sofisticado perfecto para eventos de día o noche.', ARRAY['Hilo chocolate premium', 'Mandalas calados', 'Tejido acanalado'], true, null),
('Vestido Multicolor con Mangas', 65.00, 'Hippie', 'Vestidos', '/src/assets/vestido-mangas-multicolor-frente.png', 'Espectacular vestido con mangas largas y diseño geométrico multicolor. El corpiño combina crema con detalles en rojo, negro y turquesa, creando un hermoso patrón tribal. La falda presenta franjas onduladas en colores variados: rosa, verde, negro y crema. Una verdadera obra de arte textil que destaca por su complejidad y belleza.', ARRAY['Hilos multicolores premium', 'Diseño geométrico', 'Patrón tribal'], true, null);