window.onload = function() {
    // Obtener referencias a elementos
    const verPuntuacionesBtn = document.getElementById('verPuntuaciones');
    const tablaPuntuaciones = document.getElementById('tablaPuntuaciones');
  
    // Agregar evento click al botón "Ver Puntuaciones"
    verPuntuacionesBtn.addEventListener('click', mostrarPuntuaciones);
  
    function mostrarPuntuaciones() {
      // Obtener jugadores del localStorage
      const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
  
      // Ordenar jugadores por tiempo de mejor a peor
      jugadores.sort((a, b) => a.mejorTiempo - b.mejorTiempo);
  
      // Limpiar contenido previo de la tabla
      const tablaBody = tablaPuntuaciones.getElementsByTagName('tbody')[0];
      tablaBody.innerHTML = '';
  
      // Recorrer jugadores e insertar filas en la tabla
      jugadores.forEach(jugador => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${jugador.alias}</td>
          <td>${jugador.puntos}</td>
          <td>${jugador.mejorTiempo}</td>
        `;
        tablaBody.appendChild(fila);
      });
  
      // Mostrar la tabla
      tablaPuntuaciones.style.display = 'table';
    }
  };