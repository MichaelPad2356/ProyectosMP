const mapeoCasasPersonajes = {
    '../media/Casas/Cuphead9.png': {
        personaje: '../media/Personajes/Cuphead.png',
        sonido: '../media/audios/sonido_personajes/Cuphead.wav',
        voz: '../media/audios/voz_personajes/cuphead.wav',
        nombre: 'Cuphead'
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
let puntajeInicial = 0;

function iniciar() {
    var imagenes = document.querySelectorAll('#cajasimagenes > div');


    // Recuperar el puntaje y el tiempo almacenados en localStorage
    const puntajeAlmacenado = localStorage.getItem('puntaje');
    const tiempoAlmacenado = localStorage.getItem('bestTime');

    // Haz lo que necesites con el puntaje y el tiempo
    console.log('Puntaje almacenado:', puntajeAlmacenado);
    console.log('Tiempo almacenado:', tiempoAlmacenado);


    // Obtener el tiempo inicial del localStorage o un valor predeterminado si no está almacenado
    const tiempoInicial = tiempoAlmacenado ? parseInt(tiempoAlmacenado) : 0;

    // Obtener el puntaje inicial del localStorage o un valor predeterminado si no está almacenado
    const puntajeInicial = puntajeAlmacenado ? parseInt(puntajeAlmacenado) : 0;

    // Actualizar el puntaje global con el valor almacenado
    puntaje = puntajeInicial;
    actualizarPuntaje();

    for (var i = 0; i < imagenes.length; i++) {
        imagenes[i].addEventListener('dragstart', arrastrar, false);
        imagenes[i].addEventListener('dragend', finalizado, false);
        imagenes[i].style.position = 'absolute';
        imagenes[i].style.left = '-1000px';
        imagenes[i].style.top = '-1000px';
    }

    var lienzos = document.querySelectorAll('.lienzo');
    for (var i = 0; lienzos && i < lienzos.length; i++) {
        lienzos[i].addEventListener('dragenter', eventoEnter, false);
        lienzos[i].addEventListener('dragover', eventoSobre, false);
        lienzos[i].addEventListener('drop', eventoDrop, false);
    }

    // Recuperar imágenes almacenadas en el localStorage de la primera pantalla
    const imagenesLocalStorage = JSON.parse(localStorage.getItem('elementosPantalla1'));

    // Filtrar las imágenes para la segunda pantalla
    imagenesSeleccionadas = seleccionarImagenesAleatorias(
        // Filtra las claves del objeto 'mapeoCasasPersonajes' para obtener solo aquellas que no están incluidas en el almacenamiento local
        Object.keys(mapeoCasasPersonajes).filter(img => !imagenesLocalStorage.includes(img)),
        3  // Selecciona 3 imágenes aleatorias entre las claves filtradas
    );

    for (var i = 0; i < lienzos.length; i++) {
        var lienzo = lienzos[i];
        var imagenCasa = imagenesSeleccionadas[i];

        lienzo.style.backgroundImage = 'url(' + imagenCasa + ')';
        lienzo.style.backgroundSize = '100% 100%';
        lienzo.style.backgroundRepeat = 'no-repeat';
        lienzo.style.backgroundPosition = 'center'; 
    }

    var imagenesPersonajesFiltradas = Object.values(mapeoCasasPersonajes)
        .filter(personaje => imagenesSeleccionadas.includes(Object.keys(mapeoCasasPersonajes)
        .find(casa => mapeoCasasPersonajes[casa].personaje === personaje.personaje)));

        // Filtrar las imágenes de personajes basadas en las imágenes seleccionadas
       // var imagenesPersonajesFiltradas = Object.values(mapeoCasasPersonajes)
        // Filtra los objetos del objeto 'mapeoCasasPersonajes' basados en si sus rutas de imagen de personaje están incluidas en las imágenes seleccionadas
        //.filter(personaje => 
            // Verifica si la ruta de imagen del personaje está incluida en las imágenes seleccionadas
           // imagenesSeleccionadas.includes(
                // Encuentra la clave de la casa que corresponde al personaje actual y verifica si su ruta de imagen está incluida en las imágenes seleccionadas
             //   Object.keys(mapeoCasasPersonajes).find(casa => mapeoCasasPersonajes[casa].personaje === personaje.personaje)
    


    document.getElementById('cajasimagenes').innerHTML = '';

  
    // Iterar sobre todas las imágenes de personajes filtradas
for (var i = 0; i < imagenesPersonajesFiltradas.length; i++) {
    // Crear un nuevo div para el personaje
    var divPersonaje = document.createElement('div');
    
    // Establecer el estilo del div del personaje
    divPersonaje.style.width = '190px';
    divPersonaje.style.height = '190px';
    divPersonaje.style.marginRight = '60px';
    divPersonaje.style.marginTop = '60px';
    divPersonaje.style.backgroundImage = 'url(' + imagenesPersonajesFiltradas[i].personaje + ')';
    divPersonaje.id = 'div' + i;
    divPersonaje.draggable = true;
    
    // Agregar eventos de arrastrar y soltar al div del personaje
    divPersonaje.addEventListener('dragstart', arrastrar, false);
    divPersonaje.addEventListener('dragend', finalizado, false);

    // Crear una imagen dentro del div del personaje
    var imgPersonaje = document.createElement('img');
    imgPersonaje.src = imagenesPersonajesFiltradas[i].personaje;
    imgPersonaje.draggable = false;
    
    // Agregar la imagen al div del personaje
    divPersonaje.appendChild(imgPersonaje);

    // Agregar el div del personaje al contenedor 'cajasimagenes'
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



function reproducirSonidoYVozPorOrden(sonido, voz) {
    var audioSonido = new Audio(sonido);
    var audioVoz = new Audio(voz);

    // Reproducir sonido primero
    audioSonido.play();

    // Cuando el sonido haya terminado, reproducir la voz
    audioSonido.addEventListener('ended', function () {
        audioVoz.play();
    });
}

function eventoDrop(e) {
    // Prevenir el comportamiento predeterminado del evento de arrastrar y soltar
    e.preventDefault();
    
    // Obtener el ID de la imagen arrastrada
    var id = e.dataTransfer.getData('Text');
    
    // Obtener el elemento del div del personaje arrastrado
    var divPersonaje = document.getElementById(id);
    
    // Obtener el elemento del lienzo de destino
    var lienzo = e.target;

    // Verificar si el lienzo de destino tiene la clase 'lienzo'
    if (lienzo.classList.contains('lienzo')) {
        // Obtener la imagen de la casa actual y del personaje actual del estilo de los elementos
        var imagenCasaActual = lienzo.style.backgroundImage.replace('url("', '').replace('")', '');
        var imagenPersonajeActual = divPersonaje.style.backgroundImage.replace('url("', '').replace('")', '');

        // Verificar si el lienzo ya tiene una imagen de personaje
        if (lienzo.querySelector('.imagen-personaje')) {
            // Mostrar un mensaje indicando que ya no se puede colocar aquí
            mostrarMensaje("Ya no puedes colocar aquí", "rojo");
            // Reproducir sonido de perder
            var audio = new Audio('../media/audios/sonido_personajes/perder.wav');
            audio.play();
            // Restar puntaje por intento fallido
            puntaje = Math.max(puntajeInicial, puntaje - 50); // Asegurar que el puntaje no sea menor que el valor inicial
            actualizarPuntaje();
            return;
        }

        // Verificar si la imagen del personaje coincide con la casa correspondiente
        if (mapeoCasasPersonajes[imagenCasaActual].personaje === imagenPersonajeActual) {
            // Obtener la imagen del personaje del div del personaje arrastrado
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

            // Agregar la imagen del personaje al lienzo
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
            reproducirSonidoYVozPorOrden(mapeoCasasPersonajes[imagenCasaActual].sonido, mapeoCasasPersonajes[imagenCasaActual].voz);

            // Mostrar mensaje de éxito
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
                            window.location.href = "FinalScore.html"; // Redirigir a la página de puntuación final
                        }
                    });
                }, 6000); // Cambié el tiempo a 4 segundos
            }
        } else {
            // La imagen del personaje no coincide con la casa correspondiente, mostrar mensaje de error
            mostrarMensaje("Inténtalo de nuevo", "rojo");
            // Reproducir sonido de perder
            var audio = new Audio('../media/audios/sonido_personajes/perder.wav');
            audio.play();
            // Restar puntaje por error
            puntaje = Math.max(puntajeInicial, puntaje - 65); // Asegurar que el puntaje no sea menor que el valor inicial
            actualizarPuntaje();
        }
    }
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

window.addEventListener('load', iniciar, false);