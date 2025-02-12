
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <!-- <link rel="stylesheet" href="../resources/css/header.css"> -->
        <script src="https://kit.fontawesome.com/0d4c0ee316.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="../resources/css/header.css">
        <link rel="icon" href="../resources/img/fav.ico" type="image/x-icon">
    </head>
    <body id="body">
        <nav class="nav-container">
            <div id="logoImg">
                <img src="../resources/img/logoMAMBA.png" alt="logo de la marca" width="60px" style="float: left; margin-right: 10px;">
                <h1 id="textLogo" style="float: left; margin-right: 10px;">MAMBA Sneakers</h1>
            </div>
            <!-- LINES -->
            <div class="hamburger">
                <!-- <i class="fa-solid fa-bars"></i> -->
                <span class="lines"></span>
                <span class="lines"></span>
                <span class="lines"></span>
            </div>
            
            <ul id="nav-links">
                <li class="navL"><a href="homee.php" class="links">Home</a></li>
                <li class="navL"><a href="shop.php" class="links">Shop</a></li>
                <li class="navL"><a href="about.php" class="links">About</a></li>
                <li class="navL"><a href="help.php" class="links">Help</a></li>
                <li class="navL"><a href="contact.php" class="links">Contact</a></li>
                <?php
                    if(isset($_SESSION['Nombre_Usr'])){
                ?>
                
                <?php
                    }
                if(isset($_SESSION["usuario"]) && $_SESSION["usuario"]=='admin'){
                    echo '<li class="navL"><a href="admin.php" class="links">Admin</a></li>';
                }
                ?>
                
                <?php
                    if(isset($_SESSION['Nombre_Usr'])){
                        echo '<li class="navL">Hola '.$_SESSION["Nombre_Usr"].'!</li>';
                ?>
                        <button type="button" class="custom-button"><a class="loginA" href="../resources/php/logout.php">Logout</a></button>   
                               
                <?php
                            
                    }else{
                ?>
                        <li class="links" class="navL"><button type="button" id="dropdownMenu1" data-toggle="dropdown" class="custom-button dropdown-toggle">Login <span class="caret"></span></button>
                        
                            <ul class="dropdown-menu dropdown-menu-right mt-2">
                                <li class="px-3 py-2">
                                    <form class="form" role="form" action="../resources/php/login.php" method="post">
                                        <div class="form-group">
                                            <input name="email" id="emailInput" <?php if(isset($_COOKIE["email"])){echo "value=".$_COOKIE["email"];}?> placeholder="Email" class="form-control form-control-sm" type="email" required="">
                                        </div>
                                        <div class="form-group">
                                            <input name="palabra_secreta" <?php if(isset($_COOKIE["email"])){echo "value=".$_COOKIE["password"];}?> id="passwordInput" placeholder="Password" class="form-control form-control-sm" type="password" required="">
                                        </div>
                                            
                                        <div class="form-group">
                                        <button type="submit" name="enviar2" class="btn btn-primary btn-block" style="background-color: rgb(255, 128, 0); border-color: rgb(255, 128, 0);">Login</button>
                                        </div>
                                        <div class="form-group text-center">
                                        <small><a href="#" data-toggle="modal" data-target="#modalPassword" style="color: orange;">Registrar cuenta</a></small>
                                        </div>
                                        <div class="form-group text-center">
                                            <small><a href="../pages/recuperarPassword.php"  style="color: orange;">Olvidé mi contraseña</a></small>
                                        </div>
                                    </form>
                                </li>
                            </ul>
                        </li>
                <?php
                    }
                ?>

            </ul>
        </nav>
        
        <div id="modalPassword" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Registro</h3>
                        <button type="button" class="close font-weight-light" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <form class="form" role="form" action="../resources/php/registro.php" onsubmit="return unico()" method="post">
                        <div class="modal-body">
                            <p>Nombre: <input type="text" name="nombre" required> </p>
                            <p>Cuenta: <input type="text" name="cuenta" required> </p>
                            <h6 id="unicaCuenta" style="color:red;"></h6>
                            <p>Correo: <input type="email" name="email" required> </p>
                            <h6 id="unicaEmail" style="color:red;"></h6>
                            
                            <p>Pregunta de seguridad:
                                <select name="pregunta" id="pregunta" onchange="mostrarCampoRespuesta()">
                                    <option value="" selected disabled>Selecciona una pregunta</option>
                                    <option value="mascota">¿Cuál es tu mascota favorita?</option>
                                    <option value="deporte">¿Cuál es tu deporte favorito?</option>
                                    <option value="apodo">¿Cuál era tu apodo de pequeñ@?</option>
                                    <option value="heroe">¿Quién era el héroe de tu infancia?</option>
                                    <option value="amigo">¿Cuál es el nombre de tu mejor amigo?</option>
                                    <option value="vacaciones">¿Dónde fuiste de vacaciones el año pasado?</option>
                                </select>
                            </p>
                            <p id="campoRespuesta" class="oculto">Respuesta: <input type="text" name="respuesta" required></p>
                        
                            <p>Contraseña: <input type="password" id="password" name="contra" required oninput="validarContrasenas()"> </p>
                            <p>Repetir contraseña: <input type="password" id="confirmPassword" required oninput="validarContrasenas()"> </p>
                            <h6 id="mensajeError" style="color:red;"></h6>
                        
                        </div>
                        <div class="modal-footer">                
                            <div class="form-group">                  
                                <button type="submit" id="submitButton" name="submit" class="btn btn-primary btn-block" disabled>Enviar</button>
                           </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div id="hh"></div>


                    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        <script src="../resources/js/header.js"></script>
        <!-- Este Script lo que hace es limpiar los campos del formulario cuando la ventana del modal se cierre  -->
        <script>
            $(document).ready(function(){
            $('#modalPassword').on('hidden.bs.modal', function () {
                $(this).find('input[type=text], input[type=email], input[type=password], select').val(''); //Limpia cada campo
                $('#mensajeError').text(''); //Limpia el mensaje de error
                $('#campoRespuesta').addClass('oculto'); //Oculta el campo respuesta al limpiar el formulario
            });
            });
        </script>



        <script>
                document.addEventListener('DOMContentLoaded', function() {
                const form = document.querySelector('.form');
                const dropdownMenu = document.querySelector('.dropdown-menu');
                const registrarCuentaLink = document.querySelector('a[data-target="#modalPassword"]');

                //Evitar que el dropdown se cierre al hacer clic en él
                dropdownMenu.addEventListener('click', function(event) {
                    event.stopPropagation();
                });

                //Abrir el modal al hacer clic en "Registrar cuenta"
                registrarCuentaLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    $('#modalPassword').modal('show');
                });

                form.addEventListener('submit', function(event) {
                    event.preventDefault();

                    const windowWidth = 400;
                    const windowHeight = 300;
                    const left = (window.screen.width - windowWidth) / 2;
                    const top = (window.screen.height - windowHeight) / 2;

                    const captchaWindow = window.open('../resources/captcha/captcha.php', 'captcha_window', 'width=500,height=320,top=' + top + ',left=' + left + ',resizable=no,toolbar=no,menubar=no,status=no');

                    window.addEventListener('message', function(event) {
                        if (event.data === 'captchaVerified') {
                            form.submit();
                        }
                    });

                    const checkCaptcha = setInterval(function() {
                        if (captchaWindow.closed) {
                            clearInterval(checkCaptcha);
                        }
                    }, 1000);
                });
            });
        </script> 

        <script>
            function unico(){
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if(this.responseText == "true"){
                            return true;
                        }else{
                            document.getElementById("unicaCuenta").innerHTML = this.responseText;
                            return false;
                        }
                    }
                };
                xhttp.open("GET", "resources/php/unico.php", true);
                xhttp.send();
            }
        </script>

    </body>
</html>




  