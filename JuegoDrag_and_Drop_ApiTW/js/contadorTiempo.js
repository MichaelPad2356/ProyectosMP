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
  localStorage.setItem('currentAlias',alias)

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

// // Evento click en el botón "Ingresar"
// document.getElementById('ingresar').addEventListener('click', () => {
//   const alias = document.getElementById('alias').value.trim();
//   if (alias) {
//       const jugador = buscarJugador(alias);
//       if (jugador) {
//           mostrarEstadisticas(jugador);
//           setTimeout(() => {
//               window.location.href = 'PantallaJuego.html';
//           }, 3000); // Redirige a PantallaJuego.html después de 3 segundos (3000 milisegundos)
//       } else {
//           agregarJugador(alias);
//           alert(`El jugador ${alias} ha sido agregado.`);
//           setTimeout(() => {
//               window.location.href = 'PantallaJuego.html';
//           }, 3000); // Redirige a PantallaJuego.html después de 3 segundos (3000 milisegundos)
//       }
//   } else {
//       alert('Por favor, ingrese un alias.');
//   }
// });

// Evento click en el botón "Ingresar"
document.getElementById('ingresar').addEventListener('click', () => {
    const alias = document.getElementById('alias').value.trim();
  
    if (alias) {
      const jugador = buscarJugador(alias);
  
      if (jugador) {
        mostrarEstadisticas(jugador);
        setTimeout(() => {
          window.location.href = 'PantallaJuego.html';
        }, 3000); // Redirige a PantallaJuego.html después de 3 segundos (3000 milisegundos)
      } else {
        agregarJugador(alias);
        mostrarMensajeAnimado(`El jugador ${alias} ha sido agregado.`);
        setTimeout(() => {
          window.location.href = 'PantallaJuego.html';
        }, 3000); // Redirige a PantallaJuego.html después de 3 segundos (3000 milisegundos)
      }
    } else {
      mostrarMensajeAnimado('Por favor, ingrese un alias.');
    }
  });
  
  // Función para mostrar un mensaje animado
  function mostrarMensajeAnimado(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.top = '50%';
    mensajeDiv.style.left = '50%';
    mensajeDiv.style.transform = 'translate(-50%, -50%)';
    mensajeDiv.style.backgroundColor = '#FF0000';
    mensajeDiv.style.color = '#fff';
    mensajeDiv.style.padding = '20px';
    mensajeDiv.style.borderRadius = '5px';
    mensajeDiv.style.fontFamily = 'monospace';
    mensajeDiv.style.fontSize = '16px';
    mensajeDiv.style.textAlign = 'center';
    mensajeDiv.style.opacity = '0';
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
  
    // Animación de aparición
    let opacidad = 0;
    const animacionAparicion = setInterval(() => {
      opacidad += 0.1;
      mensajeDiv.style.opacity = opacidad;
      if (opacidad >= 1) {
        clearInterval(animacionAparicion);
      }
    }, 50);
  
    // Animación de desaparición después de 2 segundos
    setTimeout(() => {
      let opacidad = 1;
      const animacionDesaparicion = setInterval(() => {
        opacidad -= 0.1;
        mensajeDiv.style.opacity = opacidad;
        if (opacidad <= 0) {
          clearInterval(animacionDesaparicion);
          mensajeDiv.remove();
        }
      }, 50);
    }, 2000);
  }