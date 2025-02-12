
<head>
    <script src="../resources/js/popup.js"></script>
    <style>
        #popup{
          position: fixed;
          bottom: 10px;
          right: 10px;
          margin: 0px;
          padding: 1%;
          font-size: x-small;
          height: 160px;
          width: 300px;
          background-color: white;
          margin-bottom: 230px;
          border: 1px solid grey;
        }
        #divPsub{
          width: 93%;
        }
        #btnSuscribe{
          padding:0px;
          width: 80px;
          border: 0;
          cursor: pointer;
          height: 20px;
          background-color: rgb(244, 152, 61);
        }
        #emailFormStyle{
          height:20px;
          width: 170px;
          padding-top:0px;
        }
    </style>
</head>
<!-- Ventana emergente para la suscripción -->
<div id="popup" class="popup">
  <span class="close" onclick="closePopup()">&times;</span>
  <h6>¡Suscríbete para recibir ofertas exclusivas!</h6>
  <div id="divPsub"><p>Ingresa tu dirección de correo electrónico para estar al tanto de nuestras últimas novedades y ofertas especiales.</p></div>
  <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post" id="subscriptionForm">
    <input type="email" id="emailFormStyle" name="email" placeholder="Tu correo electrónico" required>
    <button type="submit" id="btnSuscribe" name="sub" value="sub">Suscribirse</button>
  </form>
</div>

<!-- Fin de la ventana emergente -->
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../dependencies/PHPMailer-master/src/Exception.php';
require '../dependencies/PHPMailer-master/src/PHPMailer.php';
require '../dependencies/PHPMailer-master/src/SMTP.php';

    if($_SERVER["REQUEST_METHOD"] == "POST") {
      if(isset($_POST["sub"])){
        $email=$_POST["email"];
        $parts = explode("@", $email);
        $name = $parts[0];
        $bandera=1;
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
            $mail->Body = 'Hola ' . $name . ',<br><br>' .
            'Esperamos que este correo te encuentre bien. Queremos agradecerte por ser parte de nuestra comunidad. Como muestra de nuestro aprecio, nos gustaría ofrecerte un descuento exclusivo para tu próxima compra.<br><br>' .
            '<strong>Tu Código de Descuento: MAMBA30</strong><br><br>' .
            'Este código es válido hasta 07/01/24. Aplícalo durante el proceso de pago y disfruta de un 30% de descuento en tu compra.<br><br>' .
            '¡No pierdas esta oportunidad de ahorrar en tus productos favoritos!<br><br>' .
            'Gracias por elegirnos.<br><br>' .
            'Atentamente,<br>' .
            'MAMBA sneakers';
            // Ruta de la imagen a adjuntar
            $imagenCupon = '../resources/img/Cupon_MAMBA30.jpg';
            // Adjuntar la imagen al correo
            $mail->addAttachment($imagenCupon);

            $mail->send();
            //echo 'Message has been sent';
        } catch (Exception $e) { 
            // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            $bandera=0;
        }
        if($bandera==1){
            ?>
            <script>
                closePopup();
            </script>
            <?php
        }else{
            ?>
            <script>
                ocultar();
            </script>
            <?php
        }
        // header("Location: homee.php");
        // exit();
      } 
    } 
?>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('popup');
    var alturaFooter = 0; // Reemplaza con la altura real de tu footer en píxeles

    function ajustarPosicionPopup() {
      var distanciaHastaAbajo = document.body.scrollHeight - window.innerHeight - window.scrollY;
      var margenInicial = 220; // El mismo valor que el margen-bottom en CSS

      if (distanciaHastaAbajo < alturaFooter + margenInicial) {
        var nuevaAltura = Math.max(0, distanciaHastaAbajo - alturaFooter);
        popup.style.bottom = -nuevaAltura + 'px'; // Cambiado a negativo para recorrer hacia arriba
      } else {
        popup.style.bottom = -margenInicial + 'px'; // Cambiado a negativo para recorrer hacia arriba
      }
    }

    window.addEventListener('scroll', ajustarPosicionPopup);
    window.addEventListener('resize', ajustarPosicionPopup);

    // Llama a la función una vez para inicializar la posición
    ajustarPosicionPopup();
  });
</script>


