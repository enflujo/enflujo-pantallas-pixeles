import './scss/estilos.scss';
import 'prismjs/themes/prism-tomorrow.css';
import { highlight, languages } from 'prismjs';
import algoritmos from './algoritmos';
import { configuracion, configuracionOled } from './constantes';
import { valorVariableCSS } from './ayudas';
import menuAlgoritmos from './menuAlgortimos';

console.log('..:: EnFlujo ::..');

const columnas = 128;
const filas = 64;
const bitsX = columnas / 8;
const totalBytes = bitsX * filas;
const bytes: number[] = Array(totalBytes).fill(0);
const lienzo = document.getElementById('lienzo') as HTMLCanvasElement;
const ctx = lienzo.getContext('2d') as CanvasRenderingContext2D;
const contenedorPantalla = document.querySelector('.pantalla') as HTMLDivElement;
const codigo = document.getElementById('codigo') as HTMLElement;
const entradaImg = document.getElementById('entredaImg') as HTMLInputElement;
const lienzoProcesador = new OffscreenCanvas(columnas, filas);
const amarillo = valorVariableCSS('--amarillo');
const azul = valorVariableCSS('--azul');
const colorFondo = valorVariableCSS('--fondoOled');
const ctxProcesador = lienzoProcesador.getContext('2d', {
  willReadFrequently: true,
}) as OffscreenCanvasRenderingContext2D;
const nila = document.getElementById('nila') as HTMLImageElement;
let imagen: HTMLImageElement;
let paso = 0;
const rutaNila = `${import.meta.env.BASE_URL}/Nila.jpg`;

function inicio() {
  nila.click();
  // pruebaRendimiento(rutaNila, columnas, filas, 100);
  escalar();
  menuAlgoritmos(procesarImagen);
}

nila.onclick = () => {
  if (!imagen) {
    cargarImagen(rutaNila);
  } else {
    procesarImagen();
  }
};

function imprimirCodigo(imagenEnBytes: string) {
  const codigoArduino = `${configuracionOled} \n${imagenEnBytes} \n${configuracion}\nvoid loop() {}`;

  codigo.innerHTML = highlight(codigoArduino, languages.cpp, 'cpp');
}

function escalar() {
  const { width, paddingLeft, paddingRight } = window.getComputedStyle(contenedorPantalla);
  const espacioX = +paddingLeft.replace('px', '') + +paddingRight.replace('px', '');
  const ancho = +width.replace('px', '') - espacioX;

  paso = ancho / columnas;
  const alto = paso * filas;

  lienzo.width = ancho;
  lienzo.height = alto;
  procesarImagen();
}

function cuadricula() {
  ctx.strokeStyle = '#333';

  ctx.lineWidth = 0.1;
  ctx.beginPath();
  for (let x = 0; x < columnas; x++) {
    ctx.moveTo(x * paso, 0);
    ctx.lineTo(x * paso, lienzo.height);
  }

  for (let y = 0; y < filas; y++) {
    ctx.moveTo(0, y * paso);
    ctx.lineTo(lienzo.width, y * paso);
  }
  ctx.stroke();
}

inicio();
window.addEventListener('resize', escalar);
codigo.addEventListener('click', () => {
  navigator.clipboard.writeText(codigo.innerText);
});

// Convierte la matriz de 1s y 0s a un arreglo de bytes formateado para OLED
function convertirADatosOled(matriz: number[][]): string {
  const ancho = matriz[0].length; // Ancho de la matriz

  bytes.length = 0; // Reiniciar el arreglo de bytes

  if (ancho % 8 !== 0) {
    throw new Error('El ancho debe ser múltiplo de 8 para una conversión válida.');
  }

  const bytesPorFila = ancho / 8;

  for (const fila of matriz) {
    for (let i = 0; i < bytesPorFila; i++) {
      let byte = 0;

      for (let bit = 0; bit < 8; bit++) {
        byte |= fila[i * 8 + bit] << (7 - bit); // Comprimir 8 bits en 1 byte
      }
      bytes.push(byte);
    }
  }

  return construirImagenParaArduino();
}

function construirImagenParaArduino() {
  // Convertir el arreglo a una representación en C++
  const arregloBytes = bytes
    .map((byte, index) => {
      const hex = `0x${byte.toString(16).padStart(2, '0')}`;
      return (index + 1) % 16 === 0 ? `${hex},\n` : `${hex}, `;
    })
    .join('')
    .trimEnd()
    .replace(/,\s*$/, ''); // Eliminar la última coma innecesaria

  return `const unsigned char imagen[] PROGMEM = {\n${arregloBytes}\n};`;
}

function procesarImagen(algoritmo: keyof typeof algoritmos = 'atkinson') {
  if (!imagen) return;
  const escala = Math.min(columnas / imagen.naturalWidth, filas / imagen.naturalHeight);
  const ancho = imagen.naturalWidth * escala;
  const alto = imagen.naturalHeight * escala;
  const offsetX = (columnas - ancho) / 2;
  const offsetY = (filas - alto) / 2;
  ctxProcesador.clearRect(0, 0, columnas, filas);
  ctxProcesador.drawImage(imagen, offsetX, offsetY, ancho, alto);
  const datos = algoritmos[algoritmo](ctxProcesador, columnas, filas);
  const matriz: number[][] = [];

  ctx.clearRect(0, 0, lienzo.width, lienzo.height);

  for (let y = 0; y < filas; y++) {
    const fila: number[] = [];
    for (let x = 0; x < columnas; x++) {
      const i = (y * columnas + x) * 4;
      const pixel = datos[i];
      const color = pixel > 0 ? (y < 16 ? amarillo : azul) : colorFondo;
      if (pixel > 0) {
        fila.push(1);
      } else {
        fila.push(0);
      }

      ctx.fillStyle = color;
      ctx.fillRect(x * paso, y * paso, paso, paso);
    }
    matriz.push(fila);
  }

  cuadricula();

  const imagenEnBytes = convertirADatosOled(matriz);
  imprimirCodigo(imagenEnBytes);
}

entradaImg.addEventListener('change', () => {
  const file = entradaImg.files?.[0];
  if (!file) return;

  const lector = new FileReader();
  lector.onload = (evento) => {
    if (evento.target && evento.target.result) {
      cargarImagen(evento.target.result as string);
    }
  };

  lector.readAsDataURL(file);
});

function cargarImagen(fuente: string) {
  const img = new Image();
  img.onload = () => {
    imagen = img;
    procesarImagen();
    nila.src = img.src;
  };
  img.src = fuente;
}
