
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <title>MAMBA - Modificar Producto</title>
    <style>
        #contenedor{
            margin-top: 0px;
            padding-right:5%;
            padding-left:10%;
        }
        #name{
            width:100%;
            height: 100px;
            display:flex;
            justify-content: center;
            align-items: center;
        }
        #name p{
            font-size: 35px;
        }
        input[type="submit"]{
            
        }
        #contenedor-2{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 80px;
        }
        #bloque{
            display: flex;
            margin-bottom:100px;
        }
    </style>
</head>
<body>
<?php
        include('../includes/headrAdmin.php');
    ?>
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

    if(isset($_POST['submit3'])){
        $targetDir = "../resources/img/shopimages/";  // Directorio donde se guardarán las imágenes
        $targetFile = $targetDir . basename($_FILES["file"]["name"]);

        // Verificar si el archivo es una imagen real
        if(isset($_FILES['file']) && $_FILES['file']['size'] > 0){
            $check = getimagesize($_FILES["file"]["tmp_name"]);
        }else{
            $check = false;
        }
        
        if ($check !== false) {
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) { 

                $idProducto = $_POST["idProducto"];
                $nombre = $_POST["nombre"];
                $categoria = $_POST["categoria"];
                $texto = $_POST["texto"];
                $existencia = $_POST["existencia"];
                $precio = $_POST["precio"];
                $descuento = $_POST["descuento"];
                $file = $_FILES["file"]["name"];

                //Eliminación local de la imagen de manera local
                $nombreCarpeta = '../resources/img/productos/';
                // Sentencia preparada
                $sql1 = "SELECT Imagen FROM producto WHERE ID_Pto = ?";

                $stmt = $conexion->prepare($sql1);
                $stmt->bind_param("i", $idProducto);
                $stmt->execute();
                $stmt->bind_result($imagen);
                $stmt->fetch();
                $stmt->close();

                $nombreArchivo = $nombreCarpeta . $imagen;

                if (file_exists($nombreArchivo)) {
                    if (unlink($nombreArchivo)) {
                        //  echo 'La imagen ha sido eliminada correctamente.';
                    } else {
                    //  echo 'No se pudo eliminar la imagen.';
                    }
                } else {
                    //  echo 'La imagen no existe en la carpeta especificada.';
                }
                // Actualización en la base de datos
                $sql = "UPDATE producto SET Nombre_Pto = '$nombre', Categoria = '$categoria', Descripcion = '$texto', Existencia = '$existencia', Precio = '$precio', Descuento = '$descuento', Imagen = '$file' WHERE ID_Pto = '$idProducto'";

                if ($conexion->query($sql) === TRUE) {
                    ?>
                    <script>
                        swal("Actualización Completada", "Información enviada correctamente", "success");
                    </script>
                    <?php
                } else {
                    ?>
                    <script>
                        swal("Error!", "No se pudo completar el registro","warning");
                    </script>
                    <?php
                }
            } else {
                // echo "Hubo un problema al subir el archivo.";
            }
        } else { 
            $idProducto = $_POST["idProducto"];
                $nombre = $_POST["nombre"];
                $categoria = $_POST["categoria"];
                $texto = $_POST["texto"];
                $existencia = $_POST["existencia"];
                $precio = $_POST["precio"];
                $descuento = $_POST["descuento"];

                $sql = "UPDATE producto SET Nombre_Pto = '$nombre', Categoria = '$categoria', Descripcion = '$texto', Existencia = '$existencia', Precio = '$precio', Descuento = '$descuento' WHERE ID_Pto = '$idProducto'";

                if ($conexion->query($sql) === TRUE) {
                    ?>
                    <script>
                        swal("Actualización Completada", "Información enviada correctamente", "success");
                    </script>
                    <?php
                } else {
                    ?>
                    <script>
                        swal("Error!", "No se pudo completar el registro","warning");
                    </script>
                    <?php
                }

        }
    }
    if(isset($_POST['submit3'])){
        $idP = $_POST["idProducto"];
    }else{
        $idP = $_GET["idProducto"];
    }
    //Select para poner los datos en el formulario
    $sql = "SELECT * FROM producto WHERE ID_Pto = '$idP'";

    $result = $conexion->query($sql);
    // Verificar si hay resultados
    if ($result->num_rows > 0) {
        // Obtener los datos del producto
        $data = $result->fetch_assoc();
        ?>
        <div id="name"><p>Editar producto</p></div>
        <div id="bloque">
    <div id="contenedor">
    <form method="post" action="a2_modificarProducto.php"  enctype="multipart/form-data">
        <fieldset disabled>
            <div class="mb-3">
                <label for="disabledTextInput" class="form-label">ID del producto</label>
                <input type="number" id="disabledTextInput" class="form-control" placeholder="Generado automáticamente" name="id" value="<?php echo htmlspecialchars($data['ID_Pto']); ?>" required>
            </div>
        </fieldset>
        <input type="hidden" name="idProducto" value="<?php echo htmlspecialchars($data['ID_Pto']); ?>">
        <div class="row">
            <div class="col mb-3">
                <label for="formGroupExampleInput" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="formGroupExampleInput" name="nombre" placeholder="Nombre del producto" value="<?php echo htmlspecialchars($data['Nombre_Pto']); ?>" required>
            </div>
            <div class="col-3">
                <label for="select" class="form-label">Categoría</label>
                <select class="form-select" aria-label="Default select example" id="select" name="categoria" required>
                    <?php
                        if($data['Categoria'] == 'Hombre'){
                            ?>
                                <option selected value ="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                            <?php
                        }else{
                            ?>
                                <option value ="Hombre">Hombre</option>
                                <option selected value="Mujer">Mujer</option>
                            <?php
                        }
                    ?>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Descripción</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="texto" required><?php echo htmlspecialchars($data['Descripcion']); ?></textarea>
        </div>
        <div class="row">
            <div class="col">
                <label for="" class="form-label">Existencia</label>
                <input type="number" class="form-control" placeholder="Existencia" name="existencia" value="<?php echo htmlspecialchars($data['Existencia']); ?>" required>
            </div>
            <div class="col">
                <label for="" class="form-label">Precio</label>
                <input type="number" class="form-control" placeholder="Precio" name="precio" step="0.0001" value="<?php echo htmlspecialchars($data['Precio']); ?>" required>
            </div>
            <div class="col">
                <label for="" class="form-label">Descuento</label>
                <input type="number" class="form-control" placeholder="Descuento" name="descuento" step="0.0001" value="<?php echo htmlspecialchars($data['Descuento']); ?>" required>
            </div>
        </div>
        <div class="mb-3">
            <label for="file" class="form-label">Imagen del producto (opcional)</label>
            <input class="form-control form-control-sm" id="file" type="file" name="file">
        </div>
        <center><button type="submit" value="submit3" name="submit3" class="btn btn-primary">Añadir</button></center>
    </form>
    <a href="admin.php"><button class="btn btn-primary">Regresar</button></a>
    </div>
    <div id="contenedor-2">
        <div>
            <img src="../resources/img/shopimages/<?php echo htmlspecialchars($data['Imagen']); ?>" alt="imagen de producto">
        </div>
    </div>
    </div>

    <?php
} else {
        echo 'Producto no encontrado';
    }
?>
    <?php
        include('../includes/footer.html');
    ?>
</body>
</html>