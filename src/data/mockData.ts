import { Product, Testimonial, ArtisanProcess } from '@/types';
import product1Image from '@/assets/product-1-boho-vest.jpg';
import product2Image from '@/assets/product-2-hippie-top.jpg';
import product3Image from '@/assets/product-3-vintage-cardigan.jpg';
import product4Image from '@/assets/product-4-shabby-blouse.jpg';
import product5Image from '@/assets/product-5-traditional-poncho.jpg';
import product6Image from '@/assets/product-6-boho-dress.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Chaleco Boho Sunset',
    price: 45.99,
    style: 'Boho Chic',
    image: product1Image,
    description: 'Chaleco tejido a mano con patrones únicos inspirados en los atardeceres del desierto. Perfecto para looks bohemios.',
    materials: ['Algodón orgánico', 'Hilo de seda'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Top Hippie Flores',
    price: 38.50,
    style: 'Hippie',
    image: product2Image,
    description: 'Top con motivos florales tejido en técnica de crochet ancestral. Colores vibrantes y naturales.',
    materials: ['Lana merino', 'Fibras naturales'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Cardigan Vintage Rose',
    price: 62.00,
    style: 'Vintage',
    image: product3Image,
    description: 'Cardigan clásico con detalles de rosas en relieve. Elegancia atemporal para ocasiones especiales.',
    materials: ['Lana premium', 'Hilo de bambú'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Blusa Shabby Dreams',
    price: 42.75,
    style: 'Shabby Chic',
    image: product4Image,
    description: 'Blusa romántica con encajes delicados y tonos pastel. Perfecta para un estilo shabby chic.',
    materials: ['Algodón suave', 'Encaje artesanal'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Poncho Tradicional',
    price: 55.25,
    style: 'Traditional',
    image: product5Image,
    description: 'Poncho tejido con técnicas ancestrales transmitidas de generación en generación.',
    materials: ['Lana alpaca', 'Fibras naturales'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Vestido Boho Spirit',
    price: 78.90,
    style: 'Boho Chic',
    image: product6Image,
    description: 'Vestido largo con patrones geométricos y flecos. Libertad y estilo en una sola pieza.',
    materials: ['Algodón orgánico', 'Hilo metálico'],
    inStock: false,
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