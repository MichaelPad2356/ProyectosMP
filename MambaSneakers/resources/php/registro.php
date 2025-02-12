<?php


// Conexión a la base de datos
$servidor='localhost';
$cuenta='root';
$password='';
$bd='mamba';

$conexion = new mysqli($servidor,$cuenta,$password,$bd);
    mysqli_set_charset($conexion, "utf8"); //Codificación de caracteres


    if ($conexion->connect_errno){
         die('Error en la conexion');
    }

    else{
         //conexion exitosa

         /*revisar si traemos datos a insertar en la bd  dependiendo
         de que el boton de enviar del formulario se le dio clic*/

            if(isset($_POST['submit'])){
                $preguntas = array(
                    "mascota" => "¿Cual es tu mascota favorita?",
                    "deporte" => "¿Cual es tu deporte favorito?",
                    "apodo" => "¿Cual era tu apodo de pequeñ@?",
                    "heroe" => "¿Quien era el heroe de tu infancia?",
                    "amigo" => "¿Cual es el nombre de tu mejor amigo?",
                    "vacaciones" => "¿Donde fuiste de vacaciones el año pasado?"
                );

                //obtenemos datos del formulario
                $nom_Usuario = $_POST['nombre'];
                $alias_Usuario =$_POST['cuenta'];
                $correo_Usuario = $_POST['email'];
                $preg_Seguridad = $_POST['pregunta'];
                
                //pasamos la respuesta a mayusculas y 
                $resp = $_POST['respuesta'];
                $resp_Pregunta = mb_strtoupper($resp, 'UTF-8');

                //encritamos la respuesta
                $resp_Pregunta = password_hash($resp_Pregunta, PASSWORD_BCRYPT);

                $contra_Usuario =$_POST['contra'];

                //Esto es para colocar como tal la pregunta de seguridad en la DB
                $preguntaSeg = $preguntas[$preg_Seguridad];

                //Para encriptar la contraseña
                $contra_enc = password_hash($contra_Usuario, PASSWORD_BCRYPT);

                $stmt = $conexion->prepare("SELECT * FROM usuario WHERE Correo_Usr = ?");
                $stmt->bind_param('s', $correo_Usuario); 
                $stmt->execute();
                $res = $stmt->get_result();

                if($res->num_rows > 0){
                        header("Location:incorrecto.php?error=1");
                }else{

                
                
                //Hacemos cadena con la sentencia mysql para insertar datos
                $sql = "INSERT INTO usuario (Usuario, Correo_Usr, Password_Usr, PregSeguridad, Nombre_Usr, RespuestaPregSeg) VALUES('$alias_Usuario','$correo_Usuario','$contra_enc','$preguntaSeg','$nom_Usuario','$resp_Pregunta')";
                $conexion->query($sql);  //aplicamos sentencia que inserta datos en la tabla usuarios de la base de datos
                if ($conexion->affected_rows >= 1) { // Revisamos que se insertó un registro
                    // Estilos de la ALERT

                    echo '<style>
                            .custom-alert {
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                padding: 25px;
                                background-color: #f8f9fa; 
                                color: #343a40; 
                                border-radius: 10px;
                                box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                max-width: 400px;
                                text-align: center;
                            }
                            .highlight {
                                color: rgb(255, 128, 0); 
                                font-weight: bold;
                                margin-bottom: 10px;
                            }
                            .close-btn {
                                cursor: pointer;
                                font-size: 24px;
                                font-weight: bold;
                                align-self: flex-end;
                            }

                            .close-btn:hover {
                                color: rgb(255, 50, 0); 
                            }

                          </style>';
                
                    echo '<div class="custom-alert">
                            <span class="highlight">Registro Exitoso</span>
                            <span>¡Tu registro ha sido realizado con éxito!</span>
                            <span class="close-btn" onclick="this.parentElement.style.display=\'none\'">&times;</span>
                          </div>';

                    if ($conexion->affected_rows >= 1) { // Revisamos que se insertó un registro
                        // Estilos de la ALERT

                        echo '<style>
                                .custom-alert {
                                    position: fixed;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    padding: 25px;
                                    background-color: #f8f9fa; 
                                    color: #343a40; 
                                    border-radius: 10px;
                                    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    max-width: 600px;
                                    text-align: center;
                                }
                                .highlight {
                                    color: rgb(255, 128, 0); 
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                }
                                .close-btn {
                                    cursor: pointer;
                                    font-size: 24px;
                                    font-weight: bold;
                                    align-self: flex-end;
                                }

                                .close-btn:hover {
                                    color: rgb(255, 50, 0); 
                                }

                            </style>';
                
                        echo '<div class="custom-alert">
                                <span class="highlight">Registro Exitoso</span>
                                <span>¡Tu registro ha sido realizado con éxito!</span>
                                <span class="close-btn" onclick="this.parentElement.style.display=\'none\'">&times;</span>
                            </div>';
                        
                        echo '<script>
                                 setTimeout(function() {
                                    window.location.href = "../../pages/homee.php";
                                    }, 3000); // 3000 milisegundos = 3 segundos, Despues de 3 segundos se redirige a la pagina principal, despues de hacer el registro
                                </script>';
                          
                    }
                }
            }
         }//fin  
    }
?>
