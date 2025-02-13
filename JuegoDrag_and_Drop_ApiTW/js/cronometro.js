// Variable para almacenar el intervalo del cronómetro
let intervalo;
let tiempoInicial = 0; // Tiempo inicial en segundos

// Función para obtener el mejor tiempo almacenado en localStorage
function obtenerMejorTiempo() {
    let bestTime = localStorage.getItem('bestTime');
    return bestTime ? parseInt(bestTime, 10) : 0;
}

function reiniciar() {
    localStorage.setItem('bestTime', 0);
}

// Función para iniciar el cronómetro
function iniciarCronometro() {
    let contador = document.getElementById('cronometro');
    contador.style.position = 'absolute';
    contador.style.top = '20px'; // Ajusta la posición vertical del cronómetro
    contador.style.right = '450px'; // Ajusta la posición horizontal del cronómetro para que esté a la derecha
    contador.style.fontSize = '18px'; // Ajusta el tamaño de la fuente del cronómetro
    contador.style.color = 'white'; // Cambia el color del texto a blanco
    contador.style.background = '#0047ab'; // Cambia el fondo a un azul fuerte
    contador.style.padding = '10px'; // Añade relleno alrededor del texto
    contador.style.borderRadius = '10px'; // Añade bordes redondeados
    contador.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)'; // Agrega sombra al texto para mejorar la legibilidad

    // Obtener el tiempo inicial desde localStorage
    tiempoInicial = obtenerMejorTiempo();

    // Función que actualiza el cronómetro cada segundo
    intervalo = setInterval(() => {
        let horas = Math.floor(tiempoInicial / 3600);
        let minutos = Math.floor((tiempoInicial % 3600) / 60);
        let segundos = tiempoInicial % 60;

        // Formatear los valores de tiempo como cadenas de dos dígitos
        horas = horas.toString().padStart(2, '0');
        minutos = minutos.toString().padStart(2, '0');
        segundos = segundos.toString().padStart(2, '0');

         // Actualizar el texto del cronómetro
 contador.textContent = `${horas}:${minutos}:${segundos}`;

        // Incrementar el tiempo en un segundo
        tiempoInicial++;
    }, 1000); // Actualizar cada segundo (1000 milisegundos)
}




// Llamar a la función iniciarCronometro() cuando la página haya cargado completamente
window.onload = function() {
    iniciarCronometro();
}


