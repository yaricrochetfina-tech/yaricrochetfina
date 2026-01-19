import { Product } from '@/types';
import blusaBohoMulticolor from '@/assets/blusa-boho-multicolor.png';
import blusaRosaEncaje from '@/assets/blusa-rosa-encaje.png';
import blusaFloresFranjas from '@/assets/blusa-flores-franjas.png';
import blusaGrannyFranjas from '@/assets/blusa-granny-franjas.png';
import blusaFajonMatizado from '@/assets/blusa-fajon-matizado.jpg';
import blusaFajonAzul from '@/assets/blusa-fajon-azul.jpg';
import blusaCitronVerde from '@/assets/blusa-citron-verde.png';
import blusaCreemaCruzada from '@/assets/blusa-crema-cruzada.png';
import blusaGrannyAzul from '@/assets/blusa-granny-azul.jpg';
import blusaMarinaRayas from '@/assets/blusa-marina-rayas.png';
import giletMandalaSinMangas from '@/assets/gilet-mandala-sans-manches.png';
import giletGrannyNegro from '@/assets/gilet-granny-franjas-negro.png';
import giletMulticolorFranjas from '@/assets/gilet-multicolor-franjas.png';
import giletMariposa from '@/assets/gilet-mariposa.png';
import blusaMangasBeige from '@/assets/blusa-mangas-beige-frente.jpg';
import ponchoBlancoFlecos from '@/assets/poncho-blanco-flecos-frente.png';
import topBlancoCafe from '@/assets/top-blanco-cafe-frente.png';

// Productos (solo se listan los más relevantes y necesarios para la app)
export const products: Product[] = [
  {
    id: '1',
    name: 'Blusa Boho Multicolor',
    price: 35.0,
    style: 'Boho Chic',
    category: 'Blusas',
    image: blusaBohoMulticolor,
    description: 'Chaleco boho tejido a mano con hermosa mezcla de colores terrosos. Combina tonos marrones, azules y naranjas en un diseño único.',
    materials: ['Hilo multicolor', 'Fibras naturales'],
    inStock: true,
    videoUrl: 'https://www.youtube.com/embed/vPoZClfWfpA',
  },
  {
    id: '2',
    name: 'Blusa Rosa Encaje',
    price: 35.0,
    style: 'Shabby Chic',
    category: 'Blusas',
    image: blusaRosaEncaje,
    description: 'Delicada blusa rosa con intrincados patrones de encaje. Perfecta para un look romántico y femenino.',
    materials: ['Hilo de algodón rosa', 'Encaje artesanal'],
    inStock: true,
    videoUrl: 'https://www.youtube.com/embed/ToCRJFbC-fY',
  },
  {
    id: '3',
    name: 'Blusa Flores y Franjas',
    price: 35.0,
    style: 'Hippie',
    category: 'Blusas',
    image: blusaFloresFranjas,
    description: 'Top bohemio con motivos florales en rosa y verde. Incluye franjas decorativas que le dan un toque especial.',
    materials: ['Hilo de flores', 'Fibras de colores'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Blusa Granny con Franjas',
    price: 40.0,
    style: 'Vintage',
    category: 'Blusas',
    image: blusaGrannyFranjas,
    description: 'Blusa colorida con técnica granny square. Combina colores vibrantes con franjas colgantes para un look único.',
    materials: ['Hilo multicolor', 'Algodón orgánico'],
    inStock: true,
    videoUrl: 'https://www.youtube.com/embed/3OFOEB8UVoA',
  },
  {
    id: '5',
    name: 'Blusa con Fajón Matizado',
    price: 45.0,
    style: 'Boho Chic',
    category: 'Blusas',
    image: blusaFajonMatizado,
    description: 'Elegante blusa con diseño de rayas horizontales en colores rojo, azul y crema. Con fajón incorporado.',
    materials: ['Hilo matizado', 'Lana suave'],
    inStock: true,
    videoUrl: 'https://www.youtube.com/embed/A8cyqsli_Ps',
  },
  // Entradas actualizadas/añadidas según tu solicitud
  {
    id: 'TOP-001',
    name: 'Top Blanco y Café',
    price: 35.0,
    style: 'Boho',
    category: 'Tops',
    image: topBlancoCafe,
    description: 'Elegante top halter tejido a mano en blanco y café con encaje decorativo y cordones ajustables.',
    materials: ['Hilo 100% algodón', 'Tejido a mano'],
    inStock: true,
  },
  {
    id: 'PON-001',
    name: 'Poncho Blanc à Franges',
    price: 35.0,
    style: 'Boho',
    category: 'Ponchos',
    image: ponchoBlancoFlecos,
    description: 'Élégant poncho blanc fait à la main con detalles granny y franges decorativas.',
    materials: ['Fil 100% coton', 'Tissé à la main'],
    inStock: true,
  },
  {
    id: 'BLM-001',
    name: 'Blusa con Mangas Beige',
    price: 45.0,
    style: 'Vintage',
    category: 'Blusas',
    image: blusaMangasBeige,
    description: 'Blusa elegante de manga corta en tono beige con patrones calados. Corte recto con remate acanalado.',
    materials: ['Hilo 100% algodón', 'Tejido a mano'],
    inStock: true,
  },
  {
    id: 'BCC-001',
    name: 'Blusa Corta Cruzada',
    price: 35.0,
    style: 'Romantic',
    category: 'Blusas',
    image: blusaCreemaCruzada,
    description: 'Blusa corta cruzada en blanco con detalles decorativos y tejido calado.',
    materials: ['Hilo 100% algodón', 'Tejido a mano'],
    inStock: true,
  },
  // Mantener otras entradas existentes si las hay
];