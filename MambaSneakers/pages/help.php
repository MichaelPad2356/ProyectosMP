<?php
    ob_start(); //por si no funciona el header location (activa almacenamiento en buffer de salida)
    session_start(); //inicia sesion
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAMBA - Help</title>
    <link rel="icon" href="../resources/img/fav.ico" type="image/x-icon">
    <script src="../resources/js/help.js"></script>
</head>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../resources/css/help.css">
<body>
    <?php
            include('../includes/headr.php');
    ?>
    <!-- Contenedor de las cards -->
    <div class="container">
        <h1 class="header">FAQs</h1>
        <!-- Contenedor cards arriba -->
        <div class="card-container">
            <div class="card">
            <h3>¿Cuáles son las opciones de envío disponibles?</h3>
            <br>
            <p>Ofrecemos tres opciones de envío:
            estándar, exprés y envío internacional.
            En la mayoría de calzado no inlcuye costo por 
            envío.</p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Cuánto tiempo tarda en llegar mi pedido?</h3>
            <br>
            <p>El tiempo de entrega depende de la opción de
            envío seleccionada y de su ubicación. En promedio, los pedidos estándar suelen llegar en 5-7</p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Puedo hacer seguimiento de mi pedido?</h3>
            <br>
            <p>Sí, ofrecemos un sistema de seguimiento de
            pedidos. Tan pronto como tu pedido sea enviado, recibirás un número de seguimiento por
            correo electrónico.</p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Qué sucede si mi pedido llega dañado o incompleto?</h3>
            <br>
            <p>Si tu pedido llega dañado o
            incompleto, contáctanos dentro de los 7 días posteriores a la recepción y resolveremos el
            problema de inmediato. Consulta nuestra política de devoluciones para obtener más detalles.</p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Aceptan devoluciones?</h3>
            <br>
            <p>
            Sí, aceptamos devoluciones dentro de los 30 días posteriores a la
            recepción de tu pedido. Consulta nuestra política de devoluciones para obtener instrucciones
            </p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Puedo cambiar el tamaño o el modelo de mis zapatillas después de hacer el pedido?</h3>
            <br>
            <p> Sí,
            ofrecemos cambios de producto dentro de los 14 días posteriores a la recepción del pedido.
            Consulta nuestra política de cambios para obtener más información.</p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Ofrecen descuentos o promociones especiales?</h3>
            <br>
            <p> Sí, periódicamente ofrecemos descuentos
            y promociones especiales. Mantente informado visitando nuestra página de ofertas o
            suscribiéndote a nuestro boletín informativo.
            </p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Tienen una tienda física o solo operan en línea?</h3>
            <br>
            <p> Actualmente, operamos exclusivamente
            en línea a través de nuestro sitio web.
            </p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Ofrecen garantías en sus productos?</h3>
            <br>
            <p> 
            Sí, ofrecemos una garantía de calidad de 90 días en
            todos nuestros productos. Si experimentas algún problema de calidad, contáctanos y lo resolveremos.
            </p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>

            <div class="card">
            <h3>¿Cuáles son las políticas de devolución en caso de regalos o compras para otras personas?</h3>
            <br>
            <p> 
            Para devoluciones de regalos o compras para otras personas, sigue el mismo
            proceso de devolución estándar. Te ayudaremos a procesar la devolución y a emitir un
            reembolso.</p>
            <button class="btn" onclick="toggleContent(this)">Leer más</button>
            </div>
            
        </div>
    </div>
    
    <script>
        function toggleContent(button) {
            var content = button.previousElementSibling;
            content.classList.toggle("expanded");

            if (content.classList.contains("expanded")) {
                button.textContent = "Leer menos";
            } else {
                button.textContent = "Leer más";
            }
        }
    </script>
    
    
    
    <div class="cardImages">
        <div class="img"><a href="shop.php"><img src="../resources/img/nikeHelp.webp" alt="nikeHelp"></a></div>
        <div class="img"><a href="shop.php"><img src="../resources/img/adidasHelp.webp" alt="adidasHelp"></a></div>
        <div class="img"><a href="shop.php"><img src="../resources/img/newbalanceHelp.webp" alt="newbalanceHelp"></a></div>
        <div class="img"><a href="shop.php"><img src="../resources/img/asicsHelp.webp" alt="asicsHelp"></a></div>
        <!-- <div class="img"><img src="../resources/img/converseHelp.webp" alt="converseHelp"></div>
        <div class="img"><img src="../resources/img/jordanHelp.webp" alt="jordanHelp"></div> -->
    </div>

    <?php
        include('../includes/footer.html');
    ?>  
    
</body>
</html>