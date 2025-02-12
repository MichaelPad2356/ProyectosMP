<?php
    ob_start();
    session_start();
    include("../includes/headr.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mamba Sneakers</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="../resources/css/pago.css">
    <script src="https://kit.fontawesome.com/26749c556a.js" crossorigin="anonymous"></script>
</head>
<body >

    <?php
        $servidor='localhost';
        $cuenta='root';
        $password='';
        $bd='mamba';
         
        //conexion a la base de datos
        $conexion = new mysqli($servidor,$cuenta,$password,$bd);
    
        if ($conexion->connect_errno){
             die('Error en la conexion');
        }
        
        $usuarioID = $_SESSION["ID"];
        //Calcular total de productos

       $stmt = $conexion->prepare(
        "SELECT Id_Prod, Cantidad 
        FROM venta 
        WHERE ID_Cte = ? AND Cart=1");
       $stmt->bind_param('s', $usuarioID); 
       $stmt->execute();
       $res = $stmt->get_result();
    
       $total=0;
        if($res->num_rows > 0){
            while($fila=$res->fetch_assoc()){
                $idProd=$fila['Id_Prod'];
                $cantidad=$fila['Cantidad'];
                if(isset($cantidadArray[$idProd])){
                    $cantidadArray[$idProd]+=$cantidad;
                }else{
                    $cantidadArray[$idProd]=$cantidad;
                }
                
                if(!isset($precioArray[$idProd])){
                    $stmt2 = $conexion->prepare(
                        "SELECT Precio, Nombre_Pto, Imagen 
                        FROM producto 
                        WHERE ID_Pto = ?");
                    $stmt2->bind_param('s', $idProd);
                    $stmt2->execute();
                    $res2 = $stmt2->get_result();
                    $fila2=$res2->fetch_assoc();
                    $precio=$fila2['Precio'];
                    $precioArray[$idProd]=$precio;
                    $nombreArray[$idProd]=$fila2['Nombre_Pto'];
                    $imagenArray[$idProd]=$fila2['Imagen'];
                }
                
                $total=$total+($precioArray[$idProd]*$cantidad);
            }
            $stmt2->close();

        }
        $stmt->close();

        //ID es la llave 
        $_SESSION["cantidadArray"]=$cantidadArray;
        $_SESSION["precioArray"]=$precioArray;
        $_SESSION["nombreArray"]=$nombreArray;
        $_SESSION["imagenArray"]=$imagenArray;

        $_SESSION["subtotal"]=$total;
        $_SESSION["tax"]=0;
        $_SESSION["envio"]=0;
        $_SESSION["cupon"]=0;
        $_SESSION["total"]=0;
    

        if(isset($_POST["submit"])){
            $_SESSION["calle"]=$_POST["calle"];
            $_SESSION["colonia"]=$_POST["colonia"];
            $_SESSION["ciudad"]=$_POST["ciudad"];
            $_SESSION["CP"]=$_POST["CP"];
            $_SESSION["pais"]=$_POST["pais"];
            if(isset($_POST["numTarje"])){
                $_SESSION["numTarje"]=substr($_POST["numTarje"], -4);
            }

    ?>
            <div class="total bodyPago">
                <div class="tituloPago">
                    <h1 class="titlePay">Resumen</h1>
                </div>
                <div class="tablePrices">
                    <table class="tabTotal">
                        <tr>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>

                        </tr>        
                        <?php
                            foreach($nombreArray as $id => $nombre){
                                echo "<tr>
                                    <td class='c'><img src='../resources/img/shopimages/$imagenArray[$id]' width='200px' alt=''></td>
                                    <td class='c'>$nombre</td>
                                    <td class='c '>$" . number_format($precioArray[$id], 2, '.', ',')."</td>
                                    <td class='c '>$cantidadArray[$id]</td>
                                    <td class='c '>$" . number_format($precioArray[$id]*$cantidadArray[$id], 2, '.', ',')."</td>
                                </tr>";
                            }
                        ?>
                            
                        
                        
                    </table>
                </div>
                <div class="cifras">
                    <table class="tabEnd">
                        <tr><th colspan="2">Total del Cart</th></tr>
                        
                        <tr >
                            <td class="left bottom" >Subtotal</td>
                            <td class="right bottom"><p><?php echo "$".number_format($total, 2, '.', ','); ?></p></td>
                        </tr>
                        <tr >
                            <td class="left bottom" >Cupón</td>
                            <td class="right bottom">
                                <p>
                                    <?php 
                                        if(isset($_POST["cupon"])){
                                            $cupon=$_POST["cupon"];
                                            if($cupon=="MAMBA30" || $cupon=="SNAKE232" || $cupon=="CHICKENLITTLE"){
                                                echo "$-".number_format($total*.3, 2, '.', ',')."(-30%)";
                                                $_SESSION["cupon"]=0.3;
                                                $total*=(0.7);
                                            }
                                            else{
                                                echo "0%";
                                                $_SESSION["cupon"]=0;
                                            }
                                                
                                                
                                        }   
                                    ?>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td class="left bottom top"  >
                                <p>Envío</p>
                            </td>
                            <td class="right bottom top">
                                <p> 
                                    <?php 
                                        if($_POST["envio"]=="envio1"){
                                            echo "$0.00";
                                            $_SESSION["envio"]=0;
                                        }else{ 
                                            echo "$110.00";
                                            $_SESSION["envio"]=110;
                                            $total+=110;
                                        }
                                    ?>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td class="left top" >
                                <p>Impuesto ( 
                                    <?php 
                                        if($_POST["pais"]=="1"){ 
                                            echo "0%"; // MERICA BABYYY
                                            $tax=0;
                                            $_SESSION["tax"]=0;

                                        }else if($_POST["pais"]=="2"){
                                            echo "20%";
                                            $tax=0.2;
                                            $_SESSION["tax"]=0.2;
                                        }else if($_POST["pais"]=="0"){
                                            echo "16%";
                                            $tax=0.16;
                                            $_SESSION["tax"]=0.16;
                                        }
                                    ?>)
                                </p>
                            </td>
                            <td class="right top "> <?php echo "$".number_format($total*$tax, 2, '.', ','); $total*=(1+$tax); ?></td>
                        </tr>
                        <tr class="end">
                            <td  class="left  end" >

                                <p>Total</p>

                            </td>
                            <td class="right  end">
                                <?php 
                                echo number_format($total, 2, '.', ','); $_SESSION["total"]; ?>    
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"><div>
                            <p>Dirección de Envío:<?php echo " ".$_POST["calle"].", ".$_POST["colonia"].", ".$_POST["ciudad"].", "
                            .$_POST["CP"] ?></p>
                            <p>Método de pago:
                                <?php 
                                    if($_POST["numTarje"]!=""){
                                        echo "Tarjeta que termina en: ".substr($_POST["numTarje"], -4);
                                        
                                    }else{
                                        echo "Código QR OXXO (Pagar en las siguientes 24 horas)";
                                    }
                                ?>
                            </p>  
                        </div> </td>
                        </tr>
                       
                    </table>
                    <div class="finish">
                                     
                        <a style="text-decoration: none;" onclick="showSweetAlert()" class="continuar continuarEnd" href="#">Finalizar Compra  <i class="fa-solid fa-arrow-right icono"></i></a>

                    </div>
                </div>
                
                
            </div>

    <?php
        }else{

        
    ?>
    <form class="bodyPago" action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post">
        <div class="tituloPago">
            <h1 class="titlePay">Proceder al Pago</h1>
        </div>

        <div class="pago">
            <div class="t">
                <p class="pasos">1 Método de pago</p>
            </div>
            <div class="opciones">
                    <button id="v" class="visa" onclick="card('m')"><img src="../resources/img/MasterCard_Logo.svg.png" width="100px" alt=""></button>
                    <button id="m" class="mastercard" onclick="card('v')"><img src="../resources/img/visa.png" width="100px" alt=""></button>
                    <button id="o" class="OXXO" onclick="oxxo()"><img src="../resources/img/Oxxo_Logo.svg.png" width="100px" alt=""></button>
                    <button id="b" class="back" onclick="back()">Back</button>
            </div>
            <div class="datos">
                
                <div id="oxxo">
                    <img width="200px" src="../resources/img/qr.png" alt="">
                </div>
                <div id="card">
                    <div class="formDos">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Numero de tarjeta</label>
                            <input type="text" name="numTarje" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Nombre en la tarjeta</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" id="phoneNumber" name="nomTarj"  >                
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Fecha de vencimiento</label>
                            <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" id="phoneNumber" name="year" min="2023" max="2030" placeholder="Año" >
                            <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" id="phoneNumber" name="mes" min="1" max="12" placeholder="Mes" >                
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="direccion">
            <div class="direccionEnvio">
                <p class="pasos">2 Dirección de envío</p>
            </div>
            <div class="formDireccion">
                <div class="formUno">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Nombre Completo</label>
                        <input type="text" name="nombre" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Calle</label>
                        <input type="text" name="calle" class="form-control" id="exampleInputPassword1" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Colonia</label>
                        <input type="text" name="colonia" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Código Postal</label>
                        <input type="text" name="CP" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
                    </div>
                </div>
                <div class="formDos">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Ciudad</label>
                        <input type="text" name="ciudad" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Teléfono</label>
                        <input type="tel" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" id="phoneNumber" name="telefono"  required>                
                    </div>
                    <div class="mb-3 paisS">
                        <label for="country" class="form-label">País</label>                    
                        <select class="form-select" id="country" name="pais" aria-label="Default select example" required>
                            <option value="0" selected>México</option>
                            <option value="1">USA</option>
                            <option value="2">Canada</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        
        <div class="cupon">
            <div class="t">
                <p class="pasos">3 Código en Cupón</p>
            </div>
            <div class="inputCupon">
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Ingresa el código en tu cupón si tienes uno:</label>
                    <input type="text" name="cupon" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                </div>
            </div>
            
        </div>

        <div class="velocidad">
            <div class="t">
                <p class="pasos">4 Velocidad de envío</p>
            </div>
            <div class="opciones">
                <label class="labOpciones labOpcionesUno" for="envio" id="u">
                    <input type="radio" name="envio" id="envio" value="envio1" onclick="changeColor('u')">
                    <div class="info">
                        <p>Envío GRATIS</p>
                        <small id="sma">Recíbelo antes de:
                        <?php
                            $timezone = new DateTimeZone('America/Mexico_City');
                            $currentDate = new DateTime('now', $timezone);
                            $futureDate = $currentDate->add(new DateInterval('P5D'));
                            $formattedDate = $futureDate->format('d-m-Y'); 
                            echo " $formattedDate";
                        ?>
                        </small>
                    </div>
                </label>
                <label class="labOpciones labOpcionesDos" for="envioE" id="d">
                    <input type="radio" name="envio" id="envioE" value="envio2" onclick="changeColor('d')">
                    <div class="info">
                        <p>$110 Entrega estándar</p>
                        <small id="smaTwo">Recíbelo antes de:
                        <?php
                        
                            $timezone = new DateTimeZone('America/Mexico_City');
                            $currentDate = new DateTime('now', $timezone);
                            $futureDate = $currentDate->add(new DateInterval('P2D'));
                            $formattedDate = $futureDate->format('d-m-Y'); 
                            echo " $formattedDate";
                        ?>
                        </small>
                    </div>
                </label>
            </div>
        </div>

        <button class="continuar"  type="submit" name="submit">Continuar</button>
    </form>
           
    <?php
        }
    
        include('../includes/footer.html');
    ?>
     
</body>
<script>
    function card(d){
        document.getElementById("card").style.display = "block";
        document.getElementById("oxxo").style.display = "none";
        document.getElementById(d).style.display = "none";
        document.getElementById("o").style.display = "none";
        document.getElementById("b").style.display = "block";
    }
    function oxxo(){
        document.getElementById("card").style.display = "none";
        document.getElementById("oxxo").style.display = "block";
        document.getElementById("v").style.display = "none";
        document.getElementById("m").style.display = "none";
        document.getElementById("b").style.display = "block";
    }
    function back(){
        document.getElementById("card").style.display = "none";
        document.getElementById("oxxo").style.display = "none";
        document.getElementById("v").style.display = "block";
        document.getElementById("m").style.display = "block";
        document.getElementById("o").style.display = "block";
        document.getElementById("b").style.display = "none";
    }

    function changeColor(d){
        if(d=="u"){
            var a=document.getElementById(d)
            a.style.backgroundColor = "rgb(255, 128, 0)";
            a.style.color = "white";
            document.getElementById("sma").style.color = "white";
            document.getElementById("d").style.backgroundColor = "white";
            document.getElementById("d").style.color = "black";
            document.getElementById("smaTwo").style.color = "black";

        }else{
            var a=document.getElementById(d)
            a.style.backgroundColor = "rgb(255, 128, 0)";
            a.style.color = "white";
            document.getElementById("smaTwo").style.color = "white";
            document.getElementById("u").style.backgroundColor = "white";
            document.getElementById("u").style.color = "black";
            document.getElementById("sma").style.color = "black";
        }
    }

    function showSweetAlert() {
        Swal.fire({
            title: "Aprobado",
            text: "Tu compra se ha realizado con éxito, ¡Gracias por tu preferencia!",
            icon: "success",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../resources/php/generarPago.php'; 
            }
        });
        
        return false;
    }

    

</script>
</html>