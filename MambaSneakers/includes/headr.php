
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <!-- <link rel="stylesheet" href="../resources/css/header.css"> -->
        <script src="https://kit.fontawesome.com/0d4c0ee316.js" crossorigin="anonymous"></script>
        <link rel="icon" href="../resources/img/fav.ico" type="image/x-icon">
        <link rel="stylesheet" href="../resources/css/header.css">
        <style>
            .carrito{
                padding-left:0px;
                margin-left: 0;
                margin-top: 15px;
                padding-right: 0;
                margin-right: 0;
                height: 30px;
            }       


            /* Estilos para el modal */
            .modal2 {
                display: none;
                position: fixed; /* Mantiene el modal fijo en la ventana */
                top: 20px; /* Ajusta la distancia desde la parte superior */
                right: 20px; /* Ajusta la distancia desde la derecha */
                max-width: 380px; /* Establece el ancho máximo del modal */
                background-color: rgba(255, 128, 0, 0.8); /* Color de fondo del modal */
                border-radius: 8px; /* Agrega esquinas redondeadas */
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); /* Agrega sombra al modal */
                z-index: 1000; /* Asegura que esté por encima del resto del contenido */
            }

            /* Estilos para el contenido del modal */
            .modal-content2 {
                padding: 20px; /* Añade espacio alrededor del contenido */
                color: white; /* Cambia el color del texto dentro del modal */
                font-family: Arial, sans-serif; /* Establece la fuente del texto */
            }


            .modal2 {
                /* Otros estilos del modal */
                overflow-y: auto; /* Agrega una barra de desplazamiento vertical cuando sea necesario */
                max-height: 80vh; /* Altura máxima del modal para evitar desbordamiento */
            }

            .modal-content2 {
                padding: 20px;
                width: 90%; /* Ajusta el ancho del contenido */
                margin: 0 auto; /* Centra el contenido horizontalmente */
            }

            .modal-content2 button {
                background-color: #3498db;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease-in-out;
            }

            .modal-content2 button:hover {
                background-color: #2980b9;
            }

            /* Estilo para el icono de cierre "X" */
            .cerrar-modal {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 24px;
                color: #333;
                border: 1px solid #ccc;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s ease;
            }

            .cerrar-modal:hover {
                background-color: #eee;
            }

        </style>
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
                if(isset($_SESSION["usuario"]) && $_SESSION["usuario"]=='admin'){
                    echo '<li class="navL"><a href="admin.php" class="links">Admin</a></li>';
                }

                if(isset($_SESSION["usuario"]) && $_SESSION["usuario"]!='admin'){
                ?>
                
                <li class="navL-2">
                    <div onclick="abrirModal();" class="links">
                        <div class="carrito">
                            <img id="bagShop" src="../resources/img/iconos/bagShop.ico" width="25px" style="float: left; margin-right: 10px; cursor: pointer;" />
                            <p id="numCarrito" style="float: left; margin-right: 10px;">
                                <?php
                                    $servidor = 'localhost';
                                    $cuenta = 'root';
                                    $password = '';
                                    $bd = 'mamba';

                                    $connect = new mysqli($servidor, $cuenta, $password, $bd);

                                    if ($connect->connect_error) {
                                        die("Conexión fallida: " . $connect->connect_error);
                                    }

                                    $idCliente = $_SESSION['ID'];

                                    // Aquí haces la consulta con las condiciones
                                    $consulta = "SELECT * FROM venta WHERE ID_Cte = '$idCliente' AND Cart = 1";
                                    $res = $connect->query($consulta);

                                    if ($res) {
                                        $numRegistros=0;
                                        $numRegistros = $res->num_rows;
                                        echo $numRegistros;
                                    } else {
                                        echo "Error en la consulta: " . $connect->error;
                                    }

                                    $connect->close();
                                ?>
                            </p>
                        </div>
                    </div>
                </li>

                <!-- Modal para mostrar el carrito -->
                <div id="modal2" class="modal2" style="display: none;">
                    <div class="modal-content2">
                        <!-- Contenido del carrito -->
                        <?php include('../resources/php/carrito.php'); ?>
                        <!-- Botón para cerrar el modal -->
                        <!-- <button onclick="cerrarModal();" class="cerrar-modal-btn">Cerrar</button> -->
                        <!-- Icono "X" para cerrar el modal -->
                        <span class="cerrar-modal" onclick="cerrarModal();">&#10006;</span>
                    </div>
                </div>

                <!-- Script para abrir y cerrar el modal -->
                <script>
                    function abrirModal() {
                        document.getElementById('modal2').style.display = 'block';
                    }

                    function cerrarModal() {
                        document.getElementById('modal2').style.display = 'none';
                    }
                </script>


                <?php
                }
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
                                        <?php 
                                            if(isset($_SESSION["usAttempts"]))
                                                $attempt = $_SESSION["usAttempts"];
                                            else
                                                $attempt = "";
                                            if(isset($_COOKIE[$attempt]) && $_COOKIE[$attempt] >= 3){
                                                echo '<small style="color:red; margin-bottom: 10px;">Límite de Intentos.</small><br>';
                                            }else{
                                                ?><div class="form-group">
                                                        <input name="palabra_secreta" <?php if(isset($_COOKIE["email"])){echo "value=".$_COOKIE["password"];}?> id="passwordInput" placeholder="Password" class="form-control form-control-sm" type="password" required="">
                                                    </div>
                                                <?php
                                                //echo $_COOKIE[$attempt];
                                            }
                                        ?>
                                        
                                        <div class="form-group text-center">
                                        <input type="checkbox" name="checkbox"><small style="margin-left: 10px;">Guardar Sesión</small>
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
                    <form class="form" id="formReg" role="form" name="registrationForm" action="../resources/php/registro.php" method="post">
                        <div class="modal-body">
                            <p>Nombre: <input type="text" name="nombre" required> </p>
                            <p>Cuenta: <input type="text" name="cuenta" required> </p>
                            <p>Correo: <input id="correoInput" type="email" name="email" required> </p>
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



        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
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

                    const captchaWindow = window.open('../resources/captcha/captcha.php', 'captcha_window', 'width=500,height=500,top=' + top + ',left=' + left + ',resizable=no,toolbar=no,menubar=no,status=no');

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
        
    </body>
</html>

