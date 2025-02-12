<?php
    ob_start();
    session_start();
    include('../includes/headr.php');
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAMBA - Shop</title>
    <link rel="stylesheet" href="../resources/css/shop.css">
    <script src="https://kit.fontawesome.com/a99fa1f648.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.4/nouislider.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.4/nouislider.min.js"></script>
    <style>
        #precio_range {
            background: #333333; 
            height: 10px; 
        }

        #precio_range .noUi-handle {
            background: white; 
            border: 2px solid #ff6600; 
            border-radius: 50%; 
            width: 18px; 
            height: 18px; 
            cursor: pointer;
            transition: transform 0.2s;
        }
            
        #precio_range .noUi-handle:hover {
            transform: scale(1.2); 
        }
        
        #precio_range .noUi-connect {
            background: #ff6600;
        }
        
        #precio_range .noUi-pips {
            display: none;
        }

        .sliderCont{
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .slider{
            margin-top: 14px;
            width: 300px;
        }

        .filtro{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
        }

        .categoria{
            display: flex;
            flex-direction: row;     
            align-items: center;  
        }
        
        
    </style>
</head>
<body>
    <?php
        // Conexión a la base de datos
        $servidor='localhost';
        $cuenta='root';
        $password='';
        $bd='mamba';

        $conexion = new mysqli($servidor,$cuenta,$password,$bd);

        if ($conexion->connect_error) {
            die("Conexión fallida: " . $conexion->connect_error);
        }

        $sqlMax = "SELECT MAX(precio - Descuento) AS max_precio FROM producto";
        $resultMax = $conexion->query($sqlMax);

        if ($resultMax->num_rows > 0) {
            $rowMax = $resultMax->fetch_assoc();
            $maxPrecio = $rowMax["max_precio"];
            echo "<script>";
            echo "var max = " . $maxPrecio . ";";
            echo "</script>";
        } else {
            echo "Error";
        }

        $sqlMin = "SELECT MIN(precio - Descuento) AS min_precio FROM producto";
        $resultMin = $conexion->query($sqlMin);

        if ($resultMin->num_rows > 0) {
            $rowMin = $resultMin->fetch_assoc();
            $minPrecio = $rowMin["min_precio"];
            echo "<script>";
            echo "var min = " . $minPrecio . ";";
            echo "</script>";
        } else {
            echo "Error";
        }   

        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["filtro"])) {

            $filtro = $_POST["filtro"];
            $precioMin = $_POST["filtro_precio_min"];
            $preciomax = $_POST["filtro_precio_max"];
            $filtro = $conexion->real_escape_string($filtro);
            if($filtro=="Ver todo"){
                $sql = "SELECT * FROM producto WHERE (precio - Descuento) BETWEEN $precioMin AND $preciomax";
            }else{
                $sql = "SELECT * FROM producto WHERE (precio - Descuento) BETWEEN $precioMin AND $preciomax AND Categoria = '$filtro'";
            }

        } else{
            $sql = 'SELECT * FROM producto';
        }

        
        $resultado = $conexion -> query($sql);

        $session=true;
        
        if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["idProducto"])) {
            if(isset($_SESSION['ID'])){
                $idCliente = $_SESSION['ID']; 
                $idProducto = $_GET["idProducto"];
                $cantidad = 1; 
                $cart = 1; 
                
                $session=true;

                $sql = "INSERT INTO venta (ID_Cte, ID_Prod, Cantidad, Cart) VALUES ('$idCliente', '$idProducto', '$cantidad', '$cart')";
            
                if ($conexion->query($sql) === TRUE) {
                    header('refresh:0; url=shop.php');
                } else {
                    echo '<script src="../resources/js/shop.js"></script>';
                    echo '<script>var escenario = "agregarError";</script>';
                }
            }
            else{
                $session=false;
            }
            
            
        }
        

    ?>

    <!-- Filtro de categorias -->
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
        <div class="filtro">
            <div class="categoria">
                <label for="filtro"><i class="fa-solid fa-filter" style="color: #ff7300;"></i> Filtro por categoria:</label>
                <select name="filtro" id="filtro" class="select">
                    <?php
                        $query = "SELECT DISTINCT Categoria FROM producto"; 
                        $result = $conexion->query($query);
        
                        if ($result) {
                            echo '<option value="Ver todo">Ver todo</option>';
                            while ($row = $result->fetch_assoc()) {
                                $categoria = $row['Categoria'];
                                echo '<option value="' . $categoria . '">' . $categoria . '</option>';
                            }
                        }else {
                            echo "Error en la consulta: " . $conexion->error;
                        }
                    ?>
                </select>
            </div>

            <div class="sliderCont">
                <label for="precio_range"><i class="fa-solid fa-filter" style="color: #ff7300;"></i> Filtro por precio:</label>
                <input type="hidden" name="filtro_precio_min" id="filtro_precio_min" value="">
                <input type="hidden" name="filtro_precio_max" id="filtro_precio_max" value="">
                <div class="slider">
                    <div id="precio_range"></div>
                    <div id="precio_values"></div>
                </div>
                
            </div>

        </div>

    <input type="submit" value="Aplicar">
    </form>
    
    
    

    <div>
        <?php
        if($session==false){
            echo '<script src="../resources/js/shop.js"></script>';
            echo '<script>var escenario = "errorSesion";</script>';
        }
        ?>
    </div>


    <div class="card-container">
    <?php
    $item = 0;
    $resultado->data_seek(0);
    if ($resultado->num_rows == 0){
        echo "<h4><strong>No hay resultados disponibles</strong></h4>";
    }
    while( $row = $resultado ->  fetch_assoc()){
        $id = $row['ID_Pto'];
        $nombre = $row['Nombre_Pto'];
        $categoria = $row['Categoria'];
        $descripcion = $row['Descripcion'];
        $existencias = $row['Existencia'];
        $agotado= ($existencias == 0) ? 'text-decoration : line-through ; ' : '';
        $precio = $row['Precio'];
        $imagen_ruta = $row['Imagen'];
        $descuento = $row['Descuento'];
    
    ?>

         <!-- Card del producto -->
        <div>
            <div class="card">
                <div style="text-align: end;">
                    <button>...</button>
                </div>
                <img  src="../resources/img/shopimages/<?php echo $imagen_ruta ?>">
                <center> <p id="nombre" style="<?php echo $agotado; ?>"><?php echo $nombre ?></p></center>
                <p><strong>ID:</strong><?php echo $id; ?></p>
                <p><strong>Categoria:</strong> <?php echo $categoria; ?></p>
                <p><strong>Descripcion:</strong> <?php echo $descripcion; ?></p>
                <p><strong>Existencias:</strong> <?php echo $existencias; ?></p>
                <?php if ($descuento>0) : ?>
                    <p><strong>Precio original: </strong><s style="text-decoration: line-through;">$<?php echo number_format($precio,2); ?></s></p>
                    <p><strong>Precio con descuento: </strong>$<?php echo number_format($precio - $descuento,2); ?></p>
                <?php else: ?>
                    <p><strong>Precio: </strong>$<?php echo number_format($precio,2); ?></p>
                <?php endif; ?>
                <?php if ($existencias>0) : ?>
                    
                <!-- Boton para agregar al carrito -->
                <div style="text-align: center;">
                <button onclick="agregar(<?php echo $id;?>,<?php echo $existencias;?>)" id="<?php echo $item ?>" class="carrote"><img src="../resources/img/shopimages/carrito.jpg" alt="" width="20px" height="20px">    Agregar al carrito</button>
                </div>
                <?php else: ?>
                <p style="color: grey; font-weight:bold;">AGOTADO</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- Script agregar al carrito cuando se de click al boton -->
        <script>
            function agregar(idProducto, existencias){
                if(existencias>0){
                    window.location.href = '?idProducto=' + idProducto;
                }else{
                    alert ('Producto agotado');
                }
            }
        </script>
    
    <?php
            $item = $item+1;
        } ?>
    </div> 
    <?php
        include('../resources/php/suscription.php');
    ?>
    <?php 
        $conexion->close();
    
        include('../includes/footer.html');
    ?>
    <script src="../resources/js/sliderShop.js"></script>
</body>
</html>