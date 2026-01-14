// Helper to resolve image paths from database to actual asset URLs
// Images in src/assets/ need to be imported as ES6 modules in Vite

// Import all product images explicitly
import blusaBohoMulticolor from '@/assets/blusa-boho-multicolor.png';
import blusaCitronVerde from '@/assets/blusa-citron-verde.png';
import blusaCremaCruzada from '@/assets/blusa-crema-cruzada.png';
import blusaFajonAzul from '@/assets/blusa-fajon-azul.jpg';
import blusaFajonMatizado from '@/assets/blusa-fajon-matizado.jpg';
import blusaFloresFranjas from '@/assets/blusa-flores-franjas.png';
import blusaGrannyAzul from '@/assets/blusa-granny-azul.jpg';
import blusaGrannyFranjas from '@/assets/blusa-granny-franjas.png';
import blusaMarinaRayas from '@/assets/blusa-marina-rayas.png';
import blusaRosaEncaje from '@/assets/blusa-rosa-encaje.png';
import chalecoBoho from '@/assets/chaleco-boho.jpg';
import chalecoBrilloDoradoNegro from '@/assets/chaleco-brillo-dorado-negro.jpg';
import chalecoBrilloDorado from '@/assets/chaleco-brillo-dorado.jpg';
import chalecoBrilloNegro from '@/assets/chaleco-brillo-negro.jpg';
import chalecoCortoVintage from '@/assets/chaleco-corto-vintage.jpg';
import chalecoGrannyVintage from '@/assets/chaleco-granny-vintage.jpg';
import chalecoVintageFlecos from '@/assets/chaleco-vintage-flecos.jpg';
import chalecoVintageMulticolor from '@/assets/chaleco-vintage-multicolor.jpg';
import chalecoVintageRosa from '@/assets/chaleco-vintage-rosa.jpg';
import giletGrannyFranjasCafe from '@/assets/gilet-granny-franjas-cafe.png';
import giletGrannyFranjasNegroB from '@/assets/gilet-granny-franjas-negro-b.png';
import giletGrannyFranjasNegro from '@/assets/gilet-granny-franjas-negro.png';
import giletMandalaConMangas from '@/assets/gilet-mandala-con-mangas.png';
import giletMandalaRosa from '@/assets/gilet-mandala-rosa.png';
import giletMandalaSansManches from '@/assets/gilet-mandala-sans-manches.png';
import giletMandalaVerdeCitronB from '@/assets/gilet-mandala-verde-citron-b.png';
import giletMandalaVerdeCitron from '@/assets/gilet-mandala-verde-citron.png';
import giletMariposa from '@/assets/gilet-mariposa.png';
import giletMulticolorEspecial from '@/assets/gilet-multicolor-especial.png';
import giletMulticolorFranjas from '@/assets/gilet-multicolor-franjas.png';
import tunicaAzulCieloEspalda from '@/assets/tunica-azul-cielo-espalda.png';
import tunicaAzulCieloFrente from '@/assets/tunica-azul-cielo-frente.png';
import tunicaCremaMangas from '@/assets/tunica-crema-mangas-espalda.png';
import tunicaCremaMangasFrente from '@/assets/tunica-crema-mangas-frente.png';
import tunicaMandalaMulticolorEspalda from '@/assets/tunica-mandala-multicolor-espalda.png';
import tunicaMandalaMulticolorFrente from '@/assets/tunica-mandala-multicolor-frente.png';
import tunicaPuntaNegraRojaEspalda from '@/assets/tunica-punta-negra-roja-espalda.png';
import tunicaPuntaNegraRojaFrente from '@/assets/tunica-punta-negra-roja-frente.png';
import tunicaRosaEspalda from '@/assets/tunica-rosa-espalda.png';
import tunicaRosaFrente from '@/assets/tunica-rosa-frente.png';
import vestidoBlancoEspalda from '@/assets/vestido-blanco-espalda.png';
import vestidoBlancoFrente from '@/assets/vestido-blanco-frente.png';
import vestidoChocolateEspalda from '@/assets/vestido-chocolate-espalda.jpg';
import vestidoChocolateFrente from '@/assets/vestido-chocolate-frente.jpg';
import vestidoCremaLargoEspalda from '@/assets/vestido-crema-largo-espalda.png';
import vestidoCremaLargoFrente from '@/assets/vestido-crema-largo-frente.png';
import vestidoFranjasEspalda from '@/assets/vestido-franjas-espalda.png';
import vestidoFranjasFrente from '@/assets/vestido-franjas-frente.png';
import vestidoMangasMulticolorEspalda from '@/assets/vestido-mangas-multicolor-espalda.png';
import vestidoMangasMulticolorFrente from '@/assets/vestido-mangas-multicolor-frente.png';
import abrigoOversizeEspalda from '@/assets/abrigo-oversize-espalda.jpg';
import abrigoOversizeFrente from '@/assets/abrigo-oversize-frente.jpg';
import abrigoOversizeLateral from '@/assets/abrigo-oversize-lateral.jpg';
import chalecoVintageMandalasFrente from '@/assets/chaleco-vintage-mandalas-frente.jpg';
import chalecoVintageMandalasEspalda from '@/assets/chaleco-vintage-mandalas-espalda.jpg';
import chalecoVintageMandalasLateralA from '@/assets/chaleco-vintage-mandalas-lateral-a.jpg';
import chalecoVintageMandalasLateralB from '@/assets/chaleco-vintage-mandalas-lateral-b.jpg';
import blusaGrannyFranjasFrente from '@/assets/blusa-granny-franjas-frente.png';
import blusaGrannyFranjasEspalda from '@/assets/blusa-granny-franjas-espalda.png';
import blusaCortaCruzadaFrente from '@/assets/blusa-corta-cruzada-frente.png';
import blusaCortaCruzadaEspalda from '@/assets/blusa-corta-cruzada-espalda.png';
import blusaCortaCruzadaLateralA from '@/assets/blusa-corta-cruzada-lateral-a.png';
import blusaCortaCruzadaLateralB from '@/assets/blusa-corta-cruzada-lateral-b.png';
import blusaCortaCruzadaLateralC from '@/assets/blusa-corta-cruzada-lateral-c.png';
import blusaMangasBeigeFrente from '@/assets/blusa-mangas-beige-frente.jpg';
import blusaMangasBeigeLateral from '@/assets/blusa-mangas-beige-lateral.jpg';
import blusaMangasBeigeEspalda from '@/assets/blusa-mangas-beige-espalda.jpg';
import ponchoBlancoFlecosFrente from '@/assets/poncho-blanco-flecos-frente.png';
import ponchoBlancoFlecosDetalle from '@/assets/poncho-blanco-flecos-detalle.png';
import ponchoBlancoFlecosEspalda from '@/assets/poncho-blanco-flecos-espalda.png';
import ponchoBlancoFlecosLateral from '@/assets/poncho-blanco-flecos-lateral.png';

// Map filenames to imported URLs
const imageMap: Record<string, string> = {
  'blusa-boho-multicolor.png': blusaBohoMulticolor,
  'blusa-citron-verde.png': blusaCitronVerde,
  'blusa-crema-cruzada.png': blusaCremaCruzada,
  'blusa-fajon-azul.jpg': blusaFajonAzul,
  'blusa-fajon-matizado.jpg': blusaFajonMatizado,
  'blusa-flores-franjas.png': blusaFloresFranjas,
  'blusa-granny-azul.jpg': blusaGrannyAzul,
  'blusa-granny-franjas.png': blusaGrannyFranjas,
  'blusa-marina-rayas.png': blusaMarinaRayas,
  'blusa-rosa-encaje.png': blusaRosaEncaje,
  'chaleco-boho.jpg': chalecoBoho,
  'chaleco-brillo-dorado-negro.jpg': chalecoBrilloDoradoNegro,
  'chaleco-brillo-dorado.jpg': chalecoBrilloDorado,
  'chaleco-brillo-negro.jpg': chalecoBrilloNegro,
  'chaleco-corto-vintage.jpg': chalecoCortoVintage,
  'chaleco-granny-vintage.jpg': chalecoGrannyVintage,
  'chaleco-vintage-flecos.jpg': chalecoVintageFlecos,
  'chaleco-vintage-multicolor.jpg': chalecoVintageMulticolor,
  'chaleco-vintage-rosa.jpg': chalecoVintageRosa,
  'gilet-granny-franjas-cafe.png': giletGrannyFranjasCafe,
  'gilet-granny-franjas-negro-b.png': giletGrannyFranjasNegroB,
  'gilet-granny-franjas-negro.png': giletGrannyFranjasNegro,
  'gilet-mandala-con-mangas.png': giletMandalaConMangas,
  'gilet-mandala-rosa.png': giletMandalaRosa,
  'gilet-mandala-sans-manches.png': giletMandalaSansManches,
  'gilet-mandala-verde-citron-b.png': giletMandalaVerdeCitronB,
  'gilet-mandala-verde-citron.png': giletMandalaVerdeCitron,
  'gilet-mariposa.png': giletMariposa,
  'gilet-multicolor-especial.png': giletMulticolorEspecial,
  'gilet-multicolor-franjas.png': giletMulticolorFranjas,
  'tunica-azul-cielo-espalda.png': tunicaAzulCieloEspalda,
  'tunica-azul-cielo-frente.png': tunicaAzulCieloFrente,
  'tunica-crema-mangas-espalda.png': tunicaCremaMangas,
  'tunica-crema-mangas-frente.png': tunicaCremaMangasFrente,
  'tunica-mandala-multicolor-espalda.png': tunicaMandalaMulticolorEspalda,
  'tunica-mandala-multicolor-frente.png': tunicaMandalaMulticolorFrente,
  'tunica-punta-negra-roja-espalda.png': tunicaPuntaNegraRojaEspalda,
  'tunica-punta-negra-roja-frente.png': tunicaPuntaNegraRojaFrente,
  'tunica-rosa-espalda.png': tunicaRosaEspalda,
  'tunica-rosa-frente.png': tunicaRosaFrente,
  'vestido-blanco-espalda.png': vestidoBlancoEspalda,
  'vestido-blanco-frente.png': vestidoBlancoFrente,
  'vestido-chocolate-espalda.jpg': vestidoChocolateEspalda,
  'vestido-chocolate-frente.jpg': vestidoChocolateFrente,
  'vestido-crema-largo-espalda.png': vestidoCremaLargoEspalda,
  'vestido-crema-largo-frente.png': vestidoCremaLargoFrente,
  'vestido-franjas-espalda.png': vestidoFranjasEspalda,
  'vestido-franjas-frente.png': vestidoFranjasFrente,
  'vestido-mangas-multicolor-espalda.png': vestidoMangasMulticolorEspalda,
  'vestido-mangas-multicolor-frente.png': vestidoMangasMulticolorFrente,
  'abrigo-oversize-espalda.jpg': abrigoOversizeEspalda,
  'abrigo-oversize-frente.jpg': abrigoOversizeFrente,
  'abrigo-oversize-lateral.jpg': abrigoOversizeLateral,
  'chaleco-vintage-mandalas-frente.jpg': chalecoVintageMandalasFrente,
  'chaleco-vintage-mandalas-espalda.jpg': chalecoVintageMandalasEspalda,
  'chaleco-vintage-mandalas-lateral-a.jpg': chalecoVintageMandalasLateralA,
  'chaleco-vintage-mandalas-lateral-b.jpg': chalecoVintageMandalasLateralB,
  'blusa-granny-franjas-frente.png': blusaGrannyFranjasFrente,
  'blusa-granny-franjas-espalda.png': blusaGrannyFranjasEspalda,
  'blusa-corta-cruzada-frente.png': blusaCortaCruzadaFrente,
  'blusa-corta-cruzada-espalda.png': blusaCortaCruzadaEspalda,
  'blusa-corta-cruzada-lateral-a.png': blusaCortaCruzadaLateralA,
  'blusa-corta-cruzada-lateral-b.png': blusaCortaCruzadaLateralB,
  'blusa-corta-cruzada-lateral-c.png': blusaCortaCruzadaLateralC,
  'blusa-mangas-beige-frente.jpg': blusaMangasBeigeFrente,
  'blusa-mangas-beige-lateral.jpg': blusaMangasBeigeLateral,
  'blusa-mangas-beige-espalda.jpg': blusaMangasBeigeEspalda,
  'poncho-blanco-flecos-frente.png': ponchoBlancoFlecosFrente,
  'poncho-blanco-flecos-detalle.png': ponchoBlancoFlecosDetalle,
  'poncho-blanco-flecos-espalda.png': ponchoBlancoFlecosEspalda,
  'poncho-blanco-flecos-lateral.png': ponchoBlancoFlecosLateral,
};

/**
 * Resolves a database image path to an actual URL that works in the browser
 * Database stores paths like: /src/assets/blusa-boho-multicolor.png
 * This function returns the correct bundled asset URL
 */
export function resolveProductImage(dbPath: string): string {
  if (!dbPath) return '/placeholder.svg';
  
  // If it's already a full URL (http/https), return as-is
  if (dbPath.startsWith('http://') || dbPath.startsWith('https://')) {
    return dbPath;
  }
  
  // If it starts with data: (base64), return as-is
  if (dbPath.startsWith('data:')) {
    return dbPath;
  }
  
  // Extract just the filename from the path
  // Handle paths like: src/assets/file.jpg, /src/assets/file.jpg, @/assets/file.jpg
  const filename = dbPath.split('/').pop()?.trim();
  
  if (filename && imageMap[filename]) {
    return imageMap[filename];
  }
  
  // Try lowercase match as fallback
  if (filename) {
    const lowerFilename = filename.toLowerCase();
    const matchKey = Object.keys(imageMap).find(key => key.toLowerCase() === lowerFilename);
    if (matchKey) {
      return imageMap[matchKey];
    }
  }
  
  // Return placeholder as absolute last resort
  return '/placeholder.svg';
}
