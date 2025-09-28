import { Product, Testimonial, ArtisanProcess } from '@/types';
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
import product5Image from '@/assets/product-5-traditional-poncho.jpg';
import product6Image from '@/assets/product-6-boho-dress.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Blusa Boho Multicolor',
    price: 35.00,
    style: 'Boho Chic',
    image: blusaBohoMulticolor,
    description: 'Chaleco boho tejido a mano con hermosa mezcla de colores terrosos. Combina tonos marrones, azules y naranjas en un diseño único.',
    materials: ['Hilo multicolor', 'Fibras naturales'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Blusa Rosa Encaje',
    price: 35.00,
    style: 'Shabby Chic',
    image: blusaRosaEncaje,
    description: 'Delicada blusa rosa con intrincados patrones de encaje. Perfecta para un look romántico y femenino.',
    materials: ['Hilo de algodón rosa', 'Encaje artesanal'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Blusa Flores y Franjas',
    price: 35.00,
    style: 'Hippie',
    image: blusaFloresFranjas,
    description: 'Top bohemio con motivos florales en rosa y verde. Incluye franjas decorativas que le dan un toque especial.',
    materials: ['Hilo de flores', 'Fibras de colores'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Blusa Granny con Franjas',
    price: 40.00,
    style: 'Vintage',
    image: blusaGrannyFranjas,
    description: 'Blusa colorida con técnica granny square. Combina colores vibrantes con franjas colgantes para un look único.',
    materials: ['Hilo multicolor', 'Algodón orgánico'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Blusa con Fajón Matizado',
    price: 45.00,
    style: 'Boho Chic',
    image: blusaFajonMatizado,
    description: 'Elegante blusa con diseño de rayas horizontales en colores rojo, azul y crema. Con fajón incorporado.',
    materials: ['Hilo matizado', 'Lana suave'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Blusa con Fajón Azul',
    price: 45.00,
    style: 'Traditional',
    image: blusaFajonAzul,
    description: 'Blusa clásica con rayas en tonos azul, blanco y crema. Diseño tradicional con acabado moderno.',
    materials: ['Hilo de algodón', 'Fibras naturales'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Blusa Citron Verde',
    price: 35.00,
    style: 'Hippie',
    image: blusaCitronVerde,
    description: 'Vibrante blusa verde lima con patrones de encaje abierto. Perfecta para los días de verano.',
    materials: ['Hilo verde citron', 'Algodón orgánico'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Blusa Crema Cruzada',
    price: 35.00,
    style: 'Shabby Chic',
    image: blusaCreemaCruzada,
    description: 'Delicada blusa corta color crema con diseño cruzado. Ideal para combinar con faldas altas.',
    materials: ['Hilo de algodón crema', 'Encaje fino'],
    inStock: true,
  },
  {
    id: '9',
    name: 'Blusa Granny Azul',
    price: 45.00,
    style: 'Vintage',
    image: blusaGrannyAzul,
    description: 'Hermosa blusa azul marino con técnica granny y detalles en amarillo. Patrón tradicional con toque moderno.',
    materials: ['Hilo azul marino', 'Detalles dorados'],
    inStock: true,
  },
  {
    id: '10',
    name: 'Blusa Marina a Rayas',
    price: 40.00,
    style: 'Traditional',
    image: blusaMarinaRayas,
    description: 'Blusa estilo marinero con rayas azules y blancas. Incluye encaje en el cuello y cordón de ajuste.',
    materials: ['Hilo marina', 'Encaje blanco'],
    inStock: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María González',
    message: 'Las piezas de Yaritza son simplemente extraordinarias. La calidad del tejido y la atención al detalle son incomparables.',
    rating: 5,
    style: 'Boho Chic',
  },
  {
    id: '2',
    name: 'Ana Rodríguez',
    message: 'Me encanta el estilo vintage de sus creaciones. Cada vez que uso una pieza de YariCrochetFina, recibo muchos cumplidos.',
    rating: 5,
    style: 'Vintage',
  },
  {
    id: '3',
    name: 'Carmen López',
    message: 'La pasión por las técnicas ancestrales se nota en cada puntada. Productos únicos que cuentan una historia.',
    rating: 5,
    style: 'Traditional',
  },
];

export const artisanProcess: ArtisanProcess[] = [
  {
    step: 1,
    title: 'Selección de Materiales',
    description: 'Elegimos cuidadosamente fibras naturales y hilos de la más alta calidad para cada creación.',
    icon: '🧶',
  },
  {
    step: 2,
    title: 'Técnicas Ancestrales',
    description: 'Aplicamos métodos tradicionales de crochet y tricot transmitidos de generación en generación.',
    icon: '🧵',
  },
  {
    step: 3,
    title: 'Creación Artística',
    description: 'Cada pieza es tejida a mano con amor, creatividad y la experiencia de años de dedicación.',
    icon: '🎨',
  },
];