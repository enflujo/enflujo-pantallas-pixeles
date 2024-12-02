import algoritmos from './algoritmos';

export const escaparSimbolosHTML = (codigo: string) => codigo.replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function valorVariableCSS(nombre: string) {
  const estilosGlobales = getComputedStyle(document.documentElement);
  return estilosGlobales.getPropertyValue(nombre).trim();
}

export async function pruebaRendimiento(urlImg: string, ancho: number, alto: number, iteraciones = 10) {
  // Cargar la imagen en un OffscreenCanvas
  const img = new Image();
  img.src = urlImg;
  await img.decode();

  const lienzo = new OffscreenCanvas(ancho, alto);
  const ctx = lienzo.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.drawImage(img, 0, 0, ancho, alto);

  // Preparar resultados
  const resultados: { algoritmo: string; tiempoPromedio: number; tiempoMin: number; tiempoMax: number }[] = [];

  // Ejecutar cada algoritmo y medir el tiempo
  for (const [nombre, algoritmo] of Object.entries(algoritmos)) {
    const tiempos: number[] = [];

    for (let i = 0; i < iteraciones; i++) {
      const copia = lienzo.getContext('2d') as OffscreenCanvasRenderingContext2D;
      copia.drawImage(lienzo, 0, 0); // Crear un clon para mantener los datos originales.
      const tiempoInicial = performance.now();
      algoritmo(copia, ancho, alto);
      const tiempoFinal = performance.now();

      tiempos.push(tiempoFinal - tiempoInicial);
    }

    // Calcular estadísticas
    const tiempoPromedio = tiempos.reduce((suma, valor) => suma + valor, 0) / iteraciones;
    const tiempoMin = Math.min(...tiempos);
    const tiempoMax = Math.max(...tiempos);
    resultados.push({ algoritmo: nombre, tiempoPromedio, tiempoMin, tiempoMax });
  }

  resultados.sort((a, b) => a.tiempoPromedio - b.tiempoPromedio);

  console.table(resultados);
}

/**
 * 0x00: 00000000
 * 0xFF: 11111111
 * 0xAA: 10101010
 * 0x55: 01010101
 * 0x80: 10000000
 * 0x40: 01000000
 * 0x20: 00100000
 * 0x10: 00010000
 * 0x08: 00001000
 * 0x04: 00000100
 * 0x02: 00000010
 * 0x01: 00000001
 * 
 * 0xC0: 11000000
 * 0xE0: 11100000
 * 0xF0: 11110000
 * 0xF8: 11111000
 * 0xFC: 11111100
 * 0xFE: 11111110
 * 0x7F: 01111111
 * 0x3F: 00111111
 * 0x1F: 00011111
 * 0x0F: 00001111
 * 0x07: 00000111
 * 0x03: 00000011
 * 
 * 0x81: 10000001
 * 0x82: 10000010
 * 0x84: 10000100
 * 0x88: 10001000
 * 0x90: 10010000
 * 0xA0: 10100000
 * 0xC0: 11000000
 * 0x90: 10010000
 * 0xA0: 10100000

 * 0x7E: 01111110
 * 0x3E: 00111110
 * 0x1E: 00011110
 * 0x0E: 00001110
 * 0x06: 00000110
 */
