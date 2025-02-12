<?php
    ob_start(); //por si no funciona el header location (activa almacenamiento en buffer de salida)
    session_start(); //inicia sesion
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/0d4c0ee316.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <link rel="stylesheet" href="../resources/css/contacto.css">
    <link rel="icon" href="../resources/img/fav.ico" type="image/x-icon">
    <title>MAMBA - Contacto</title>
</head>
<body>
    <?php
        include('../includes/headr.php');

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    require '../dependencies/PHPMailer-master/src/Exception.php';
    require '../dependencies/PHPMailer-master/src/PHPMailer.php';
    require '../dependencies/PHPMailer-master/src/SMTP.php';

        if($_SERVER["REQUEST_METHOD"] == "POST") {
            $name=$_POST["name"];
            $email=$_POST["email"];
            $message=$_POST["mensaje"];
            $apellido=$_POST["apellido"];
            $asunto=$_POST["asunto"];
            $bandera=true;
            //Create an instance; passing `true` enables exceptions
            $mail = new PHPMailer(true);

            try {
                //Server settings
                $mail->SMTPDebug = 0;                                   //Enable verbose debug output
                $mail->isSMTP();                                        //Send using SMTP
                $mail->Host       = 'smtp.office365.com';               //Set the SMTP server to send through
                $mail->SMTPAuth   = true;                               //Enable SMTP authentication
                $mail->Username   = 'mamba_sneakers@outlook.com';       //SMTP username
                $mail->Password   = '0';                                //SMTP password - deleted
                $mail->SMTPSecure = 'STARTTLS';                         //Enable implicit TLS encryptionS
                $mail->Port       = 587;                                //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS                             //SMTP password

                //Recipients
                $mail->setFrom('mamba_sneakers@outlook.com', 'Mamba Sneakers');
                $mail->addAddress($email, $name);     //Add a recipient
                

                $mail->Subject = 'Respuesta';

                //Content
                $mail->isHTML(true);                                  //Set email format to HTML
                $mail->Body    = 'Hola ' . $name . ' ' .$apellido. ' con email ' .$email . '<br><br>Atendimos tu mensaje con el asunto: ' .$asunto. '<br><br>'. $message . '<br><br>Atenderemos tu solicitud en la brevedad, un saludo cordial!!!' ;


                $mail->send();
                //echo 'Message has been sent';
            } catch (Exception $e) { 
                // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
                $bandera=0;
            }
            if($bandera==1){
                ?>
				<script>
                    swal("Bien!", "Información enviada correctamente:","success");
                </script>
                <?php
            }else{
                ?>
				<script>
                    swal("Error!", "No se pudo enviar el correo:","warning");
                </script>
                <?php
            }
        } 
    ?>
    <div id="space-2"></div>
    <div id="space"><p id="contacto">CONTÁCTANOS</p></div>
    <hr id="hrStyle">
    <div class="seccion-1 seccion">
        <div class="info if3">
            <img src="../resources/img/iconos/email.png" alt="email icon">
            <p class="titulos">PRODUCTOS Y PEDIDOS</p>
            <p>Envíanos un correo electrónico</p>
            <p>Te responderemos en un dia hábil</p>
        </div>
        <div class="contenido">
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                <table id="tablaContacto">
                    <tr>
                        <div class="inputsForm form-group cuadro">
                            <input type="text" class="form-control" placeholder="Asunto" name="asunto" require>
                        </div>
                    </tr>
                    <tr>
                        <div class="nombres">
                            <div class="inputsForm nombre">
                                <input type="text" class="form-control" placeholder="Nombre" name="name" require>
                            </div>
                            <div class="inputsForm apellido">
                                <input type="text" class="form-control" placeholder="Apellido" name="apellido" require>
                            </div>
                        </div>
                    </tr>
                    <tr>
                        <div class="inputsForm form-group emailS ffEE">
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Dirección de correo electrónico" name="email" require style="height: 45px;border-radius: 30px;">
                            <small id="emailHelp" class="form-text text-muted">.    Nunca compartiremos tu correo con alguien más</small>
                        </div>
                    </tr>
                    <tr>
                        <select class="inputsForm custom-select custom-select-sm" id="select1" name="categoria" require>
                            <option selected>Categoría</option>
                            <option value="1">Cambios/Devoluciones</option>
                            <option value="2">Información del producto/Asistencia</option>
                            <option value="3">Información del sitio web/Asistencia</option>
                            <option value="4">Tengo una queja relacionada con mis datos personales</option>
                            <option value="5">Acceder a mis datos personales</option>
                            <option value="6">Otro</option>
                        </select>
                    </tr>
                    <tr>
                        <div class="inputsForm form-group">
                            <textarea class="form-control " id="validationTextarea" placeholder="Pregunta*" name="mensaje" required></textarea>
                        </div>
                    </tr>
                    <div id="botonSubmit">
                        <button type="submit" class="" value="submit" name="submit">Enviar</button>
                    </div>
                </table>
            </form>
        </div>
    </div >
    <hr class="hrStyle2">
    <div class="seccion-2 seccion">
        <div class="contenido-2">
            <div class="pos-rel ratio-3by1">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3132.3313169381145!2d-0.7146654239605397!3d38.27181198337349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd63b7e634db2c0f%3A0x3e29213875c38d45!2sMamba%20Sneakers!5e0!3m2!1ses-419!2smx!4v1700578557475!5m2!1ses-419!2smx" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div> 
        </div>
        <div class="info info-2">
            <i class="fa-solid fa-location-dot fa-2xl logoUbi"></i>
            <p class="titulos">BUSCADOR DE TIENDAS</p>
            <p>Encuentra tu MAMBA sneakers más cercana</p>
        </div>
    </div>
    <hr class="hrStyle2">
    <div class="seccion-3 seccion">
        <div class="info if4">
            <img src="../resources/img/iconos/phone.png" alt="phone icon">
            <p class="titulos">PRODUCTOS Y PEDIDOS</p>
            <p>800-062-4551</p>
            <p>8:00 - 20:00 CT</p>
            <p>7 días a la semana</p>
        </div>
    </div>





    <?php
        include('../includes/footer.html');
    ?>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
</body>
</html>