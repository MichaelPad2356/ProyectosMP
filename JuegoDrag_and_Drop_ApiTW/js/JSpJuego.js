// Objeto que mapea las imágenes de las casas con la información de los personajes asociados a cada una
const mapeoCasasPersonajes = {
    '../media/Casas/Cuphead9.png': {
        personaje: '../media/Personajes/Cuphead.png', // Ruta de la imagen del personaje
        sonido: '../media/audios/sonido_personajes/Cuphead.wav', // Ruta del sonido asociado
        voz: '../media/audios/voz_personajes/cuphead.wav',// Ruta de la voz asociada 
        nombre: 'Cuphead'// Nombre del personaje
    },
    '../media/Casas/Donkey4.png': {
        personaje: '../media/Personajes/DonkeyKong.png',
        sonido: '../media/audios/sonido_personajes/Donkeykong.wav',
        voz: '../media/audios/voz_personajes/donkeykong.wav',
        nombre: 'Donkey Kong'
    },
    '../media/Casas/KirbyDL2.png': {
        personaje: '../media/Personajes/Kirby.png',
        sonido: '../media/audios/sonido_personajes/Kirby.wav',
        voz: '../media/audios/voz_personajes/kirby.wav',
        nombre: 'Kirby'
    },
    '../media/Casas/MarioB1.png': {
        personaje: '../media/Personajes/MarioBros.png',
        sonido: '../media/audios/sonido_personajes/Mario.wav',
        voz: '../media/audios/voz_personajes/mariobros.wav',
        nombre: 'Mario Bros'
    },
    '../media/Casas/Minecraft6.png': {
        personaje: '../media/Personajes/Minecraft.png',
        sonido: '../media/audios/sonido_personajes/Minecraft.wav',
        voz: '../media/audios/voz_personajes/minecraft.wav',
        nombre: 'Minecraft'
    },
    '../media/Casas/Packman7.png': {
        personaje: '../media/Personajes/Pacman.png',
        sonido: '../media/audios/sonido_personajes/Pacman.wav',
        voz: '../media/audios/voz_personajes/pacman.wav',
        nombre: 'Pacman'
    },
    '../media/Casas/Pokemon8.png': {
        personaje: '../media/Personajes/Pokemon.png',
        sonido: '../media/audios/sonido_personajes/Pokemon.wav',
        voz: '../media/audios/voz_personajes/pokemon.wav',
        nombre: 'Pokemon'
    },
    '../media/Casas/Sonic3.png': {
        personaje: '../media/Personajes/Sonic.png',
        sonido: '../media/audios/sonido_personajes/Sonic.wav',
        voz: '../media/audios/voz_personajes/sonic.wav',
        nombre: 'Sonic'
    },
    '../media/Casas/Zelda5.png': {
        personaje: '../media/Personajes/Zelda.png',
        sonido: '../media/audios/sonido_personajes/Zelda.wav',
        voz: '../media/audios/voz_personajes/zelda.wav',
        nombre: 'Zelda'
    }
};

let imagenesSeleccionadas = [];
let mensajeTimeout;
let puntaje = 0;

function iniciar() {
    // Eliminar los elementos guardados en localStorage
    localStorage.removeItem('elementosPantalla1');
    // localStorage.removeItem('puntaje');

    // puntaje = 0;
    // actualizarPuntaje();

    // Seleccionar nuevas imágenes de casas aleatorias
    imagenesSeleccionadas = seleccionarImagenesAleatorias(Object.keys(mapeoCasasPersonajes), 3);
    // Convertir el conjunto de imágenes seleccionadas en formato JSON y almacenarlo en el almacenamiento local del navegador bajo la clave 'elementosPantalla1'
    localStorage.setItem('elementosPantalla1', JSON.stringify(imagenesSeleccionadas));

    // Mostrar las imágenes de los personajes y asignandoles sus diferentes propiedades 
    const imagenes = document.querySelectorAll('#cajasimagenes > div');
    for (var i = 0; i < imagenes.length; i++) {
        imagenes[i].addEventListener('dragstart', arrastrar, false);
        imagenes[i].addEventListener('dragend', finalizado, false);
        imagenes[i].style.position = 'absolute';
        imagenes[i].style.left = '-1000px';
        imagenes[i].style.top = '-1000px';
    }

    // Mostrar las imágenes de las casas y asignandoles sus diferentes propiedades
    const lienzos = document.querySelectorAll('.lienzo');//  selecciona todos los elementos HTML que tienen la clase CSS 'lienzo' y los almacena en la variable lienzos 
    for (var i = 0; i < lienzos.length; i++) {
        lienzos[i].addEventListener('dragenter', eventoEnter, false);
        lienzos[i].addEventListener('dragover', eventoSobre, false);
        lienzos[i].addEventListener('drop', eventoDrop, false);
    }


    // Mostrar las imágenes de las casas en los lienzos
    for (var i = 0; i < lienzos.length; i++) {
        const lienzo = lienzos[i];
        const imagenCasa = imagenesSeleccionadas[i];

        lienzo.style.backgroundImage = 'url(' + imagenCasa + ')';
        lienzo.style.backgroundSize = '100% 100%';
        lienzo.style.backgroundRepeat = 'no-repeat';
        lienzo.style.backgroundPosition = 'center';
    }

    const imagenesPersonajesFiltradas = Object.values(mapeoCasasPersonajes).filter(personaje => imagenesSeleccionadas.includes(Object.keys(mapeoCasasPersonajes).find(casa => mapeoCasasPersonajes[casa].personaje === personaje.personaje)));
    // Filtra los objetos del objeto 'mapeoCasasPersonajes' basados en si sus rutas de imagen de personaje están incluidas en las imágenes seleccionadas
    //const imagenesPersonajesFiltradas = Object.values(mapeoCasasPersonajes).filter(personaje => 
    // Busca la casa asociada al personaje y verifica si su ruta de imagen está incluida en las imágenes seleccionadas
    //imagenesSeleccionadas.includes(
        // Encuentra la clave de la casa que corresponde al personaje actual y verifica si su ruta de imagen está incluida en las imágenes seleccionadas
      //  Object.keys(mapeoCasasPersonajes).find(casa => mapeoCasasPersonajes[casa].personaje === personaje.personaje)
  //  )
//  );

    // Limpia el contenido del elemento HTML con el ID 'cajasimagenes'
    document.getElementById('cajasimagenes').innerHTML = '';

    for (var i = 0; i < imagenesPersonajesFiltradas.length; i++) {
        const divPersonaje = document.createElement('div');
        divPersonaje.style.width = '190px';
        divPersonaje.style.height = '190px';
        divPersonaje.style.marginRight = '60px';
        divPersonaje.style.marginTop = '60px';
        divPersonaje.style.backgroundImage = 'url(' + imagenesPersonajesFiltradas[i].personaje + ')';
        divPersonaje.id = 'div' + i;
        divPersonaje.draggable = true;
        divPersonaje.addEventListener('dragstart', arrastrar, false);
        divPersonaje.addEventListener('dragend', finalizado, false);

        const imgPersonaje = document.createElement('img');
        imgPersonaje.src = imagenesPersonajesFiltradas[i].personaje;
        imgPersonaje.draggable = false;
        divPersonaje.appendChild(imgPersonaje);

        document.getElementById('cajasimagenes').appendChild(divPersonaje);
    }
}

function finalizado(e) {
    var elemento = e.target;
    // No es necesario ocultar la imagen en esta función
}

function arrastrar(e) {
    var elemento = e.target;
    e.dataTransfer.setData('Text', elemento.getAttribute('id'));
    e.dataTransfer.setDragImage(elemento, elemento.clientWidth / 2, elemento.clientHeight / 2);
}

function eventoEnter(e) {
    e.preventDefault();
}

function eventoSobre(e) {
    e.preventDefault();
}

function eventoDrop(e) {
    e.preventDefault();
    var id = e.dataTransfer.getData('Text');
    var divPersonaje = document.getElementById(id);
    var lienzo = e.target;

    if (lienzo.classList.contains('lienzo')) {
        var imagenCasaActual = lienzo.style.backgroundImage.replace('url("', '').replace('")', '');
        var imagenPersonajeActual = divPersonaje.style.backgroundImage.replace('url("', '').replace('")', '');

        // Verificar si el lienzo ya tiene una imagen
        if (lienzo.querySelector('.imagen-personaje')) {
            mostrarMensaje("Ya no puedes colocar aquí", "rojo");

            // Restar puntaje por intento fallido
            puntaje = Math.max(0, puntaje - 50); // Cambia el valor según tu preferencia
            actualizarPuntaje();

            // Reproducir sonido de perder
            reproducirSonido('../media/audios/sonido_personajes/perder.wav');

            return;
        }

        // Verificar si la imagen del personaje coincide con la casa correspondiente
        if (mapeoCasasPersonajes[imagenCasaActual].personaje === imagenPersonajeActual) {
            var imgPersonaje = divPersonaje.querySelector('img');

            // Crear un nuevo elemento img con la misma fuente
            var imgNueva = document.createElement('img');
            imgNueva.src = imgPersonaje.src;
            imgNueva.classList.add('imagen-personaje');

            // Posicionar y ajustar el tamaño de la imagen
            imgNueva.style.position = 'absolute';
            imgNueva.style.top = '50%';
            imgNueva.style.left = '50%';
            imgNueva.style.transform = 'translate(-50%, -50%)';
            imgNueva.style.maxWidth = '40%';
            imgNueva.style.maxHeight = '40%';

             lienzo.appendChild(imgNueva);

            lienzo.appendChild(imgNueva);
            // Crear un contenedor para el nombre del personaje
            var nombrePersonaje = document.createElement('div');
            nombrePersonaje.textContent = mapeoCasasPersonajes[imagenCasaActual].nombre;
            nombrePersonaje.style.position = 'absolute';
            nombrePersonaje.style.width = '100%';
            nombrePersonaje.style.bottom = '5px';
            nombrePersonaje.style.textAlign = 'center';
            nombrePersonaje.style.color = 'white';
            nombrePersonaje.style.fontSize = '20px';
            nombrePersonaje.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)'; // Agregar sombra al texto para mayor legibilidad
            nombrePersonaje.style.fontWeight = 'bold'; // Hacer el texto en negrita para destacarlo mejor
            nombrePersonaje.style.backgroundColor = 'black'; // Cambiar el color de fondo del contenedor del nombre
            // Añadir el nombre del personaje al lienzo
            lienzo.appendChild(nombrePersonaje);
                // Ocultar el div que contiene la imagen arrastrada
            divPersonaje.style.visibility = 'hidden';

            // Reproducir sonido del personaje y luego la voz
            reproducirSonidoYVoz(mapeoCasasPersonajes[imagenCasaActual].sonido, mapeoCasasPersonajes[imagenCasaActual].voz);

            mostrarMensaje("¡Felicidades! ¡Acertaste!", "verde");

            // Actualizar puntaje por imagen correcta
            puntaje += 135;
            actualizarPuntaje();

            // Verificar si todas las imágenes están colocadas correctamente
            var imagenesEnLienzos = document.querySelectorAll('.lienzo .imagen-personaje');
            if (imagenesEnLienzos.length === 3) {
                // Todas las imágenes están colocadas correctamente, realizar la redirección con efecto de animación
                setTimeout(function () {
                    anime({
                        targets: 'body',
                        opacity: 0,
                        duration: 1000, // Duración de la animación (en milisegundos)
                        easing: 'easeInOutQuad', // Tipo de animación
                        complete: function () {
                            // Guardar el puntaje en localStorage antes de redirigir
                            localStorage.setItem('bestTime', tiempoInicial);
                            localStorage.setItem('puntaje', puntaje);
                            window.location.href = "PantallaJuego2.html";
                        }
                    });
                }, 6000); // Cambié el tiempo a 4 segundos
            }
        } else {
            // Restar puntaje por error
            puntaje = Math.max(0, puntaje - 65);
            actualizarPuntaje();

            mostrarMensaje("Inténtalo de nuevo", "rojo");

            // Reproducir sonido de perder
            reproducirSonido('../media/audios/sonido_personajes/perder.wav');
        }
    }
}


function reproducirSonidoYVoz(nombreSonido, nombreVoz) {
    reproducirSonido(nombreSonido)
        .then(() => reproducirVoz(nombreVoz))
        .catch((error) => console.error(error));
}

function reproducirSonido(nombreSonido) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(nombreSonido);
        audio.addEventListener('ended', () => resolve());
        audio.addEventListener('error', (error) => reject(error));
        audio.play();
    });
}

function reproducirVoz(nombreVoz) {
    return new Promise((resolve, reject) => {
        const voz = new Audio(nombreVoz);
        voz.addEventListener('ended', () => resolve());
        voz.addEventListener('error', (error) => reject(error));
        voz.play();
    });
}

function mostrarNombrePersonaje(nombre) {
    const nombrePersonaje = document.getElementById("nombrePersonaje");
    nombrePersonaje.textContent = 'Personaje: ' + nombre;
}

function seleccionarImagenesAleatorias(imagenes, cantidad) {
    const imagenesAleatorias = [];
    const copiaImagenes = [...imagenes];

    for (let i = 0; i < cantidad; i++) {
        const indiceAleatorio = Math.floor(Math.random() * copiaImagenes.length);
        const imagenSeleccionada = copiaImagenes.splice(indiceAleatorio, 1)[0];
        imagenesAleatorias.push(imagenSeleccionada);
    }

    return imagenesAleatorias;
}

function mostrarMensaje(mensaje, color) {
    var mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add('mensaje');

    if (color === "verde") {
        mensajeDiv.classList.add('mensaje-verde');
    } else if (color === "rojo") {
        mensajeDiv.classList.add('mensaje-rojo');
    }

    document.body.appendChild(mensajeDiv);

    setTimeout(function() {
        mensajeDiv.remove();
    }, 2000); // Eliminar el mensaje después de 5 segundos (5000 milisegundos)
}
function actualizarPuntaje() {
    //document.getElementById('puntaje').textContent = 'Puntaje: ' + puntaje;
    var puntajeElemento = document.getElementById('puntaje');
    puntajeElemento.textContent = 'Puntaje: ' + puntaje;
    puntajeElemento.style.position = 'absolute';
    puntajeElemento.style.top = '20px'; // Ajusta la posición vertical del puntaje
    puntajeElemento.style.left = '400px'; // Ajusta la posición horizontal del puntaje
    puntajeElemento.style.fontSize = '18px'; // Ajusta el tamaño de la fuente del puntaje
    puntajeElemento.style.color = 'white'; // Cambia el color del texto a blanco
    puntajeElemento.style.background = '#0047ab'; // Cambia el fondo a un azul fuerte
    puntajeElemento.style.padding = '10px'; // Añade relleno alrededor del texto
    puntajeElemento.style.borderRadius = '10px'; // Añade bordes redondeados
    puntajeElemento.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)'; // Agrega sombra al texto para mejorar la legibilidad
}
window.addEventListener('load', iniciar, false);