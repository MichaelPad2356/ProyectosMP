// popup.js
document.addEventListener("DOMContentLoaded", function() {
  // Verificar si la cookie 'popupShown' existe en el lado del cliente
  var popupShown = getCookie('popupShown');
  document.getElementById('popup').style.display = 'none';
  // Si la cookie no existe en el lado del cliente, realizar una solicitud al servidor
  if (!popupShown) {
    
    // Realizar una solicitud al servidor para verificar la cookie 'popupShown' del lado del servidor
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../resources/php/check-cookie.php', true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Obtener la respuesta del servidor
        var response = xhr.responseText;
        
        // Si la respuesta indica que la cookie no existe en el lado del servidor, mostrar la ventana emergente
        if (response.trim() != 'true') {
          setTimeout(function() {
            document.getElementById('popup').style.display = 'block';
          }, 10000);
        }else{
          document.getElementById('popup').style.display = 'none';
        }
      }
    };

    xhr.send();
  }
});

// Función para cerrar la ventana emergente y establecer la cookie en el lado del cliente con duración de 2 horas
function closePopup() {
  document.getElementById('popup').style.display = 'none';
  // Establecer la cookie 'popupShown' con un valor de 'true' y una duración de 2 horas
  setCookie('popupShown', 'true', 0.0833); // Duración en horas (5 minutos = 5 / 60 = 0.0833 horas)
}

// Función para obtener el valor de una cookie del lado del cliente
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// Función para establecer una cookie del lado del cliente
function setCookie(name, value, hours) {
  var expires = "";
  if (hours) {
    var date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function ocultar(){ //Cuando exista un error al enviar, que se oculte por un tiempo hasta que se recarge la página
  document.getElementById('popup').style.display = 'none';
}
