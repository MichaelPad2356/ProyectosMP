function validarContrasenas1() {
    var password = document.getElementById("password1").value; //Obtiene el contenido actual del campo
    var confirmPassword = document.getElementById("confirmPassword1").value; //Obtiene el contenido actual del campo
    var submitButton = document.getElementById("submitButton1");

    var passwordField = document.getElementById("password1");
    var confirmPasswordField = document.getElementById("confirmPassword1");

    if(password == "" || confirmPassword==""){
        document.getElementById("mensajeError1").innerHTML = ""; //Coloca el mensaje de error en vacio
        passwordField.style.borderColor = "orange";
        confirmPasswordField.style.borderColor = "orange";
        submitButton.disabled = true; //Se deshabilita el boton
    }else{
        if (password != confirmPassword) {
            document.getElementById("mensajeError1").innerHTML = "Las contraseñas no coinciden.";
            passwordField.style.borderColor = "red";
            confirmPasswordField.style.borderColor = "red";
            submitButton.disabled = true;//Se deshabilita el boton
        } else {
            document.getElementById("mensajeError1").innerHTML = ""; //Coloca el mensaje de error en vacio
            passwordField.style.borderColor = "green";
            confirmPasswordField.style.borderColor = "green";
            submitButton.disabled = false;//Se habilita el boton
        }
    }
}