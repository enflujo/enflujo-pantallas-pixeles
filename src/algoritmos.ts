export default {
  floyd(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    // Obtener los datos de la imagen
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    // Recorrer los píxeles y aplicar el algoritmo
    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;

        // Convertir el píxel actual a escala de grises
        const pixelActual = data[i];
        const nuevoColor = pixelActual < 128 ? 0 : 255; // Convertir a blanco o negro
        const quantError = pixelActual - nuevoColor;

        // Asignar el nuevo valor al píxel actual
        data[i] = data[i + 1] = data[i + 2] = nuevoColor;

        // Distribuir el error a los vecinos
        if (x + 1 < ancho) {
          data[i + 4] += (7 / 16) * quantError;
        }
        if (x - 1 >= 0 && y + 1 < alto) {
          data[i + ancho * 4 - 4] += (3 / 16) * quantError;
        }
        if (y + 1 < alto) {
          data[i + ancho * 4] += (5 / 16) * quantError;
        }
        if (x + 1 < ancho && y + 1 < alto) {
          data[i + ancho * 4 + 4] += (1 / 16) * quantError;
        }
      }
    }

    return data;
  },

  atkinson(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;

        const oldPixel = data[i];
        const newPixel = oldPixel < 128 ? 0 : 255;
        const quantError = oldPixel - newPixel;

        data[i] = data[i + 1] = data[i + 2] = newPixel;

        // Distribuir el error
        if (x + 1 < ancho) data[i + 4] += (1 / 8) * quantError;
        if (x + 2 < ancho) data[i + 8] += (1 / 8) * quantError;
        if (y + 1 < alto) {
          if (x - 1 >= 0) data[i + ancho * 4 - 4] += (1 / 8) * quantError;
          data[i + ancho * 4] += (1 / 8) * quantError;
          if (x + 1 < ancho) data[i + ancho * 4 + 4] += (1 / 8) * quantError;
        }
        if (y + 2 < alto) {
          data[i + ancho * 8] += (1 / 8) * quantError;
        }
      }
    }

    return data;
  },

  jarvisJudiceNinke(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;
        const oldPixel = data[i];
        const newPixel = oldPixel < 128 ? 0 : 255;
        const quantError = oldPixel - newPixel;

        data[i] = data[i + 1] = data[i + 2] = newPixel;

        const distribute = (dx: number, dy: number, factor: number) => {
          if (x + dx < 0 || x + dx >= ancho || y + dy < 0 || y + dy >= alto) return;
          data[(y + dy) * ancho * 4 + (x + dx) * 4] += quantError * factor;
        };

        distribute(1, 0, 7 / 48);
        distribute(2, 0, 5 / 48);
        distribute(-2, 1, 3 / 48);
        distribute(-1, 1, 5 / 48);
        distribute(0, 1, 7 / 48);
        distribute(1, 1, 5 / 48);
        distribute(2, 1, 3 / 48);
        distribute(-2, 2, 1 / 48);
        distribute(-1, 2, 3 / 48);
        distribute(0, 2, 5 / 48);
        distribute(1, 2, 3 / 48);
        distribute(2, 2, 1 / 48);
      }
    }

    return data;
  },

  stucki(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;
        const oldPixel = data[i];
        const newPixel = oldPixel < 128 ? 0 : 255;
        const quantError = oldPixel - newPixel;

        data[i] = data[i + 1] = data[i + 2] = newPixel;

        const distribute = (dx: number, dy: number, factor: number) => {
          if (x + dx < 0 || x + dx >= ancho || y + dy < 0 || y + dy >= alto) return;
          data[(y + dy) * ancho * 4 + (x + dx) * 4] += quantError * factor;
        };

        distribute(1, 0, 8 / 42);
        distribute(2, 0, 4 / 42);
        distribute(-2, 1, 2 / 42);
        distribute(-1, 1, 4 / 42);
        distribute(0, 1, 8 / 42);
        distribute(1, 1, 4 / 42);
        distribute(2, 1, 2 / 42);
        distribute(-2, 2, 1 / 42);
        distribute(-1, 2, 2 / 42);
        distribute(0, 2, 4 / 42);
        distribute(1, 2, 2 / 42);
        distribute(2, 2, 1 / 42);
      }
    }

    return data;
  },

  burkes(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;
        const oldPixel = data[i];
        const newPixel = oldPixel < 128 ? 0 : 255;
        const quantError = oldPixel - newPixel;

        data[i] = data[i + 1] = data[i + 2] = newPixel;

        const distribute = (dx: number, dy: number, factor: number) => {
          if (x + dx < 0 || x + dx >= ancho || y + dy < 0 || y + dy >= alto) return;
          data[(y + dy) * ancho * 4 + (x + dx) * 4] += quantError * factor;
        };

        distribute(1, 0, 8 / 32);
        distribute(2, 0, 4 / 32);
        distribute(-2, 1, 2 / 32);
        distribute(-1, 1, 4 / 32);
        distribute(0, 1, 8 / 32);
        distribute(1, 1, 4 / 32);
        distribute(2, 1, 2 / 32);
      }
    }

    return data;
  },

  ordenado(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    // Matriz Bayer 2x2
    const matrizBayer = [
      [0, 128],
      [192, 64],
    ];

    const dims = 2; // Dimensión de la matriz

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;
        const pixelValue = data[i];

        // Determinar el índice de la matriz Bayer
        const umbral = matrizBayer[y % dims][x % dims];
        const color = pixelValue > umbral ? 255 : 0;

        data[i] = data[i + 1] = data[i + 2] = color;
      }
    }

    return data;
  },

  sierra(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;
        const oldPixel = data[i];
        const newPixel = oldPixel < 128 ? 0 : 255;
        const quantError = oldPixel - newPixel;

        data[i] = data[i + 1] = data[i + 2] = newPixel;

        const distribute = (dx: number, dy: number, factor: number) => {
          if (x + dx < 0 || x + dx >= ancho || y + dy < 0 || y + dy >= alto) return;
          data[(y + dy) * ancho * 4 + (x + dx) * 4] += quantError * factor;
        };

        distribute(1, 0, 5 / 32);
        distribute(2, 0, 3 / 32);
        distribute(-2, 1, 2 / 32);
        distribute(-1, 1, 4 / 32);
        distribute(0, 1, 5 / 32);
        distribute(1, 1, 4 / 32);
        distribute(2, 1, 2 / 32);
        distribute(-1, 2, 2 / 32);
        distribute(0, 2, 3 / 32);
        distribute(1, 2, 2 / 32);
      }
    }

    return data;
  },

  stevensonArce(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;
        const oldPixel = data[i];
        const newPixel = oldPixel < 128 ? 0 : 255;
        const quantError = oldPixel - newPixel;

        data[i] = data[i + 1] = data[i + 2] = newPixel;

        const distribute = (dx: number, dy: number, factor: number) => {
          if (x + dx < 0 || x + dx >= ancho || y + dy < 0 || y + dy >= alto) return;
          data[(y + dy) * ancho * 4 + (x + dx) * 4] += quantError * factor;
        };

        distribute(2, 0, 32 / 200);
        distribute(-3, 1, 12 / 200);
        distribute(-1, 1, 26 / 200);
        distribute(1, 1, 30 / 200);
        distribute(3, 1, 16 / 200);
        distribute(-2, 2, 12 / 200);
        distribute(0, 2, 26 / 200);
        distribute(2, 2, 12 / 200);
      }
    }

    return data;
  },

  ordenadoMedioTono(ctx: OffscreenCanvasRenderingContext2D, ancho: number, alto: number) {
    const { data } = ctx.getImageData(0, 0, ancho, alto);

    const thresholdMatrix = [
      [1, 9, 3, 11],
      [13, 5, 15, 7],
      [4, 12, 2, 10],
      [16, 8, 14, 6],
    ].map((row) => row.map((val) => ((val - 1) / 16) * 255)); // Normalizar a escala 0-255

    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = (y * ancho + x) * 4;

        const gray = data[i];
        const threshold = thresholdMatrix[y % 4][x % 4];

        const newPixel = gray < threshold ? 0 : 255;
        data[i] = data[i + 1] = data[i + 2] = newPixel;
      }
    }

    return data;
  },
};
