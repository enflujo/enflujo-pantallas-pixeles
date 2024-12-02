import algoritmos from './algoritmos';

export default function menuAlgoritmos(procesarImagen: (algoritmo: keyof typeof algoritmos) => void) {
  const opcionesAlgoritmos = document.getElementById('opcionesAlgoritmos');
  let opcionSeleccionada: HTMLLIElement | null = null;

  if (!opcionesAlgoritmos) return;

  const opciones = opcionesAlgoritmos.querySelectorAll('li');

  if (opciones.length > 0) {
    opciones.forEach((opcion) => {
      if (opcion.classList.contains('seleccionado')) opcionSeleccionada = opcion;

      opcion.addEventListener('click', () => {
        const algoritmo = opcion.dataset.llave as keyof typeof algoritmos | null;
        if (opcionSeleccionada) opcionSeleccionada.classList.remove('seleccionado');

        if (algoritmo) {
          procesarImagen(algoritmo);
          opcion.classList.add('seleccionado');
          opcionSeleccionada = opcion;
        }
      });
    });
  }
}
