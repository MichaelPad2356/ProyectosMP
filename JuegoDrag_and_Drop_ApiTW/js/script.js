// Arreglo para almacenar los jugadores
let jugadores = [];

// Obtener los datos de localStorage si existen
const datosJugadoresGuardados = JSON.parse(localStorage.getItem('jugadores')) || [];
jugadores = datosJugadoresGuardados;

// Función para guardar los datos en localStorage
function guardarDatos() {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
}

// Función para buscar un jugador por su alias
function buscarJugador(alias) {
    return jugadores.find(jugador => jugador.alias === alias);
}

// Función para agregar un nuevo jugador
function agregarJugador(alias) {
    const nuevoJugador = {
        alias,
        puntos: 0,
        mejorTiempo: 0
    };
    jugadores.push(nuevoJugador);
    guardarDatos();
    console.log(alias)
}

// Función para mostrar las estadísticas del jugador
function mostrarEstadisticas(jugador) {
    const estadisticasDiv = document.getElementById('estadisticas');
    estadisticasDiv.innerHTML = `
        <h2>Estadísticas de ${jugador.alias}</h2>
        <p>Puntos: ${jugador.puntos}</p>
        <p>Mejor Tiempo: ${jugador.mejorTiempo}</p>
    `;
}

// Evento click en el botón "Ingresar"
document.getElementById('ingresar').addEventListener('click', () => {
    const alias = document.getElementById('alias').value.trim();
    if (alias) {
        const jugador = buscarJugador(alias);
        if (jugador) {
            mostrarEstadisticas(jugador);
        } else {
            agregarJugador(alias);
            alert(`El jugador ${alias} ha sido agregado.`);
        }
    } else {
        alert('Por favor, ingrese un alias.');
    }
});