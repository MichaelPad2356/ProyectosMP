let hamburger=document.querySelector('.hamburger');
let navLinks=document.getElementById('nav-links');
let links=document.querySelectorAll('.links');

hamburger.addEventListener('click',()=>{
    navLinks.classList.toggle('hide');
    hamburger.classList.toggle('lines-rotate');
});

for(let i=0; i<links.length; i++){
    links[i].addEventListener('click',()=>{
        navLinks.classList.toggle('hide');
    });
}


// JS REGISTRO
function mostrarCampoRespuesta() {
    var select = document.getElementById("pregunta");
    var respuesta = document.getElementById("campoRespuesta");

    //Esta parte verifica la selección y muestra el campo de respuesta si se selecciona una pregunta
    if (select.value != "") {
        respuesta.classList.remove("oculto");
    } else {
        respuesta.classList.add("oculto");
    }
}


function validarContrasenas() {
    var password = document.getElementById("password").value; //Obtiene el contenido actual del campo
    var confirmPassword = document.getElementById("confirmPassword").value; //Obtiene el contenido actual del campo
    var submitButton = document.getElementById("submitButton");

    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("confirmPassword");

    if(password == "" || confirmPassword==""){
        document.getElementById("mensajeError").innerHTML = ""; //Coloca el mensaje de error en vacio
        passwordField.style.borderColor = "orange";
        confirmPasswordField.style.borderColor = "orange";
        submitButton.disabled = true; //Se deshabilita el boton
    }else{
        if (password != confirmPassword) {
            document.getElementById("mensajeError").innerHTML = "Las contraseñas no coinciden.";
            passwordField.style.borderColor = "red";
            confirmPasswordField.style.borderColor = "red";
            submitButton.disabled = true;//Se deshabilita el boton
        } else {
            document.getElementById("mensajeError").innerHTML = ""; //Coloca el mensaje de error en vacio
            passwordField.style.borderColor = "green";
            confirmPasswordField.style.borderColor = "green";
            submitButton.disabled = false;//Se habilita el boton
        }
    }
}

