<?php
    ob_start(); //por si no funciona el header location (activa almacenamiento en buffer de salida)
    session_start(); //inicia sesion
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="../resources/img/fav.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="../resources/css/homeBlock3.css">
    <link rel="stylesheet" href="../resources/css/estilosInicioRuben.css">
    <link rel="stylesheet" href="../resources/css/popUpHome.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;500;800&family=PT+Serif&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>MAMBA - Home</title>
</head>
<body>
    <?php
        include('../includes/headr.php');

        if(isset($_GET["error"])){
            ?>
            <script>
                Swal.fire({
                    title: 'Datos Erróneos',
                    imageUrl: "../resources/img/bailey.png",
                    imageHeight: 100,
                    confirmButtonColor: '#e36124',
                });
            </script>
            <?php
            
                        

        }

    ?>
    <br><br>
    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
            <img class="d-block w-100" src="../resources/img/car2.jpg" width="50%" alt="First slide">
            </div>
            <div class="carousel-item">
            <img class="d-block w-100" src="../resources/img/car1.jpg" alt="Second slide">
            </div>
            <div class="carousel-item">
            <img class="d-block w-100" src="../resources/img/car4.jpg" alt="Third slide">
            </div>
            <div class="carousel-item">
            <img class="d-block w-100" src="../resources/img/car3.jpg" alt="Third slide">
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>
    <div class="slogan">
        <h1>DESATA TU VELOCIDAD, ABRAZA TU ESTILO</h1>
        <h2> Donde la potencia de la serpiente se encuentra con la moda en cada paso</h2>
        <h3> ¡Deslízate hacia la grandeza con nosotros!</h3>
        <div>
            <a href="shop.php"><button class="slBtn">Comprar</button></a>
            <a href="about.php"><button class="slBtn">Descubre Más</button></a>
        </div>
    </div>
    <br><br>
    <div id="dvLinkCupon">
        <p class="animate__animated animate__heartBeat"><a href="#" onclick="openPopup(); return false;" id="lnkCupon">¡Haz click para recibir un cupón de descuento!</a></p>
    </div>
    <div id="popup-container">
        <div id="popup-content">
            <span id="close-btn" onclick="closePopup()">&times;</span>
            <img src="../resources/img/Cupon_SNAKE232_NUEVO.jpg" alt="" width="300">
        </div>
    </div>
    <script>
        function openPopup() {
            document.getElementById("popup-container").style.display = "flex";
        }

        function closePopup() {
            console.log('Cerrando el popup');
            document.getElementById("popup-container").style.display = "none";
        }
    </script>
    
    <br><br>
    <center>
        <div class="contenedor">
            <div id="imagen1"><img src="../resources/img/imgRuben/imgGrande.png" alt="" id="imgIzquierda"></div>
            <div id="imagen2"><img src="../resources/img/imgRuben/img11.jpeg" alt="" id="imgDerecha"></div>
            <div id="imagen3"><img src="../resources/img/imgRuben/img3.jpg" alt="" class="imgAbajo"></div>
            <div id="imagen4"><img src="../resources/img/imgRuben/img4.jpg" alt="" class="imgAbajo"></div>
            <div id="imagen5"><img src="../resources/img/imgRuben/img5.jpg" alt="" class="imgAbajo"></div>
            <div id="imagen6"><img src="../resources/img/imgRuben/img6.jpg" alt="" class="imgAbajo"></div>
            <div id="imagen7"><img src="../resources/img/imgRuben/img7.jpg" alt="" class="imgAbajo"></div>
        </div>
    </center>

    <br><br><br>
    <div id="secDiv">
        <table>
            <tr>
                <td class="tsecDiv"><h1>THE CURRENT <br> CULTURE <br> MARKETPLACE</h1></td>
                <td rowspan="2"><img src="../resources/img/imgRuben/CONEJO.png" alt=""></td>
            </tr>
            <tr>
                <td class="tsecDiv"><p>En Mamba Sneakers, nuestra misión es simple pero poderosa: ofrecerte tenis de alta calidad que no solo cumplan, sino que superen tus expectativas. Cada par que llevas no es solo moda, es una declaración de estilo y calidad. Camina con confianza, camina con Mamba</p></td>
            </tr>
        </table>
        <div class="flexContenedor">
            <div class="recDiv">
                Verificacion  ++++
            </div>
            <div class="recDiv">
                Compradores +++++
            </div>
            <div class="recDiv">
                Vendedores  ++++
            </div>
        </div>
    </div>
    <div class="thirdBlock">
        <div class="title">
            <p>El poder esta en tus manos</p>
        </div>
        <div class="tresItems">
            <div class="buying">
                <p class="subs">Comprar con Mamba</p>
                <p class="textoDesc">Nosotros no determinamos los precios, tú lo haces. Mamba es una mercado en vivo. Mamba te da el poder de proponer un precio y comprar con precios en vivo reflejados por la demanda.</p>
                <p class="Mas">Aprende mas acerca de Comprar + +</p>
            </div>
            <div class="image">
                <img class="tenisA" src="../resources/img/orangeSneakersHomeBlock3.webp" alt="">
            </div>
            <div class="selling">
                <p class="subs">Vender con Mamba</p>
                <p class="textoDesc">Tenemos las herramientas para ayudarte a conseguir efectivo o un negocio de venta en línea a traves de la venta de sneakers con precios en vivo.</p>
                <p class="Mas">Aprende mas acerca de Vender + +</p>
            </div>

        </div>
    </div>
    
    
    <?php
        include('../includes/footer.html');
    ?>
</body>
</html>