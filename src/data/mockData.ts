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
import giletMandalaSinMangas from '@/assets/gilet-mandala-sans-manches.png';
import giletGrannyNegro from '@/assets/gilet-granny-franjas-negro.png';
import giletMulticolorFranjas from '@/assets/gilet-multicolor-franjas.png';
import giletMariposa from '@/assets/gilet-mariposa.png';
import giletMandalaConMangas from '@/assets/gilet-mandala-con-mangas.png';
import giletMandalaVerdeCitron from '@/assets/gilet-mandala-verde-citron.png';
import giletGrannyCafe from '@/assets/gilet-granny-franjas-cafe.png';
import giletMandalaRosa from '@/assets/gilet-mandala-rosa.png';
import giletMulticolorEspecial from '@/assets/gilet-multicolor-especial.png';
import giletGrannyNegroB from '@/assets/gilet-granny-franjas-negro-b.png';

export const products: Product[] = [
  // Blusas
  {
    id: '1',
    name: 'Blusa Boho Multicolor',
    price: 35.00,
    style: 'Boho Chic',
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
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
    category: 'Blusas',
    image: blusaMarinaRayas,
    description: 'Blusa estilo marinero con rayas azules y blancas. Incluye encaje en el cuello y cordón de ajuste.',
    materials: ['Hilo marina', 'Encaje blanco'],
    inStock: true,
  },
  // Gilets
  {
    id: '11',
    name: 'Gilet Mandala Sin Mangas',
    price: 45.00,
    style: 'Boho Chic',
    category: 'Gilets',
    image: giletMandalaSinMangas,
    description: 'Elegante gilet con diseño mandala tejido a mano. Colores terrosos que crean un patrón hipnótico y bohemio.',
    materials: ['Hilo de algodón', 'Fibras naturales'],
    inStock: true,
  },
  {
    id: '12',
    name: 'Gilet Granny Negro con Franjas',
    price: 45.00,
    style: 'Vintage',
    category: 'Gilets',
    image: giletGrannyNegro,
    description: 'Gilet negro con técnica granny square y franjas decorativas. Perfecto para un look elegante y atemporal.',
    materials: ['Hilo negro', 'Fibras recicladas'],
    inStock: true,
  },
  {
    id: '13',
    name: 'Gilet Multicolor con Franjas',
    price: 45.00,
    style: 'Hippie',
    category: 'Gilets',
    image: giletMulticolorFranjas,
    description: 'Vibrante gilet multicolor con franjas colgantes. Combina múltiples tonos para un look bohemio y juvenil.',
    materials: ['Hilos multicolores', 'Algodón orgánico'],
    inStock: true,
  },
  {
    id: '14',
    name: 'Gilet Estilo Mariposa',
    price: 45.00,
    style: 'Shabby Chic',
    category: 'Gilets',
    image: giletMariposa,
    description: 'Delicado gilet con forma de mariposa en tonos suaves. Diseño romántico perfecto para ocasiones especiales.',
    materials: ['Hilo de seda', 'Encaje artesanal'],
    inStock: true,
  },
  {
    id: '15',
    name: 'Gilet Mandala con Mangas',
    price: 45.00,
    style: 'Boho Chic',
    category: 'Gilets',
    image: giletMandalaConMangas,
    description: 'Gilet mandala con mangas incorporadas. Diseño complejo que combina tradición y modernidad en cada puntada.',
    materials: ['Hilo premium', 'Fibras naturales'],
    inStock: true,
  },
  {
    id: '16',
    name: 'Gilet Mandala Verde Citron',
    price: 45.00,
    style: 'Hippie',
    category: 'Gilets',
    image: giletMandalaVerdeCitron,
    description: 'Refrescante gilet verde citron con patrón mandala. Perfecto para primavera y verano con su color vibrante.',
    materials: ['Hilo verde citron', 'Algodón orgánico'],
    inStock: true,
  },
  {
    id: '17',
    name: 'Gilet Granny Café con Franjas',
    price: 45.00,
    style: 'Traditional',
    category: 'Gilets',
    image: giletGrannyCafe,
    description: 'Gilet en tonos café con técnica granny y franjas. Diseño clásico que evoca la calidez de los tejidos tradicionales.',
    materials: ['Hilo café', 'Lana natural'],
    inStock: true,
  },
  {
    id: '18',
    name: 'Gilet Mandala Rosa',
    price: 45.00,
    style: 'Shabby Chic',
    category: 'Gilets',
    image: giletMandalaRosa,
    description: 'Romántico gilet rosa con diseño mandala delicado. Combina feminidad con la fuerza del tejido artesanal.',
    materials: ['Hilo rosa suave', 'Encaje fino'],
    inStock: true,
  },
  {
    id: '19',
    name: 'Gilet Multicolor Especial',
    price: 35.00,
    style: 'Hippie',
    category: 'Gilets',
    image: giletMulticolorEspecial,
    description: 'Vibrante gilet multicolor con texturas florales en azul, naranja, amarillo y rosa. Diseño único que combina múltiples colores en perfecta armonía.',
    materials: ['Hilos multicolores', 'Fibras texturizadas'],
    inStock: true,
  },
  {
    id: '20',
    name: 'Gilet Granny Negro Elegante',
    price: 45.00,
    style: 'Vintage',
    category: 'Gilets',
    image: giletGrannyNegroB,
    description: 'Elegante gilet negro con patrón granny sofisticado. Perfecto para looks urbanos con toque artesanal.',
    materials: ['Hilo negro premium', 'Fibras de alta calidad'],
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