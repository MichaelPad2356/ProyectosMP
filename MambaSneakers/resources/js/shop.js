document.addEventListener('DOMContentLoaded', function () {
    switch (escenario) {
        case 'errorSesion':
            mostrarMensaje({
                tipo: 'error',
                titulo: 'Error de sesión',
                texto: 'Inicia sesión para agregar al carrito',
            });
            break;
        case 'agregarCarrito':
            mostrarMensaje({
                tipo: 'success',
                titulo: 'Éxito',
                texto: 'Agregado al carrito correctamente',
            });
            break;
        case 'agregarError':
            mostrarMensaje({
                tipo: 'error',
                titulo: 'Error desconocido',
                texto: 'Intente de nuevo',
            });
            break;
        default:

            break;
    }
});

function mostrarMensaje(opciones) {
    Swal.fire({
        icon: opciones.tipo || 'info',
        title: opciones.titulo || 'Mensaje',
        text: opciones.texto || 'Mensaje por defecto',
    });
}

