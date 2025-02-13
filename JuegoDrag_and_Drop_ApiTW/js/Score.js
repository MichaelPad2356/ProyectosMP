document.getElementById('restartGame').addEventListener('click', startGame);

function startGame() {
    // Oculta la pantalla de felicitación y muestra el canvas
    document.getElementById('congratulationsScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'flex';
    // Aquí iría la inicialización de tu juego
}

function PlayAudio() {
    var audio = document.getElementById('musicaFondo');
    audio.volume = 0.1; // Establece el volumen al 50%
    audio.play();
}

function endGame(alias, score, time) {
    // Mostrar la pantalla de felicitación
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('congratulationsScreen').style.display = 'flex';
    document.getElementById('playerAlias').textContent = alias;
    document.getElementById('finalScore').textContent = `Puntuación Final: ${score}`;

    // Obtener los jugadores almacenados en localStorage o inicializar un arreglo vacío
    let players = JSON.parse(localStorage.getItem('jugadores') || '[]');

    // Buscar al jugador actual por su alias
    let currentPlayerIndex = players.findIndex(player => player.alias === alias);

    // Si el jugador existe, actualizar su puntuación y tiempo
    if (currentPlayerIndex !== -1) {
        let currentPlayer = players[currentPlayerIndex];

        // Actualizar la puntuación si la nueva es mayor
        currentPlayer.puntos = Math.max(currentPlayer.puntos, score);

        // Actualizar el mejor tiempo si el nuevo tiempo es menor
        currentPlayer.mejorTiempo = Math.min(currentPlayer.mejorTiempo || Infinity, time);

        players[currentPlayerIndex] = currentPlayer;
    } else {
        // Si el jugador no existe, agregar un nuevo objeto
        players.push({ alias, puntos: score, mejorTiempo: time });
    }

    // Guardar los jugadores actualizados en localStorage
    localStorage.setItem('jugadores', JSON.stringify(players));

    // Obtener el mejor tiempo de todos los jugadores
    const bestTime = Math.min(
        ...players
            .filter(player => typeof player.mejorTiempo === 'number')
            .map(player => player.mejorTiempo)
    );

    // Mostrar el mejor tiempo en el HTML
    document.getElementById('bestTime').textContent = `Mejor tiempo: ${bestTime !== Infinity ? `${time} segundos` : 'N/A'}`;
}

function mostrarPantallaFelicitaciones() {
    // Recuperar datos del usuario
    var aliasUsuario = localStorage.getItem("aliasUsuario");
    var puntajeFinal = localStorage.getItem("puntajeFinal");

    // Encontrar el tbody de la tabla por su ID
    var tbody = document.getElementById("tablaPuntuaciones");

    // Crear una nueva fila y celdas para el alias y el puntaje
    var fila = document.createElement("tr");
    var celdaAlias = document.createElement("td");
    var celdaPuntaje = document.createElement("td");

    // Asignar el alias y el puntaje a las celdas
    celdaAlias.textContent = aliasUsuario;
    celdaPuntaje.textContent = puntajeFinal;

    // Añadir las celdas a la fila, y la fila al tbody de la tabla
    fila.appendChild(celdaAlias);
    fila.appendChild(celdaPuntaje);
    tbody.appendChild(fila);

    // Mostrar la pantalla de felicitaciones
    document.getElementById('congratulationsScreen').style.display = 'flex';
}

function mainEndGame() {
    let currentAlias = localStorage.getItem('currentAlias') || ''
    let currentMaxPoints = parseInt(localStorage.getItem('puntaje') || 0)
    let currentMaxTime = parseInt(localStorage.getItem('bestTime') || 0)

    console.log(currentAlias, currentMaxPoints, currentMaxTime)
    endGame(currentAlias, currentMaxPoints, currentMaxTime);
    // Esto es solo un ejemplo; deberás integrarlo con la lógica de fin de juego de tu aplicación
    mostrarPantallaFelicitaciones();

}

// esta función se llama cuando el juego termina
mainEndGame();
