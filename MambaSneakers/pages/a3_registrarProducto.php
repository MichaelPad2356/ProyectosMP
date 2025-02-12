
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <title>MAMBA - Registrar Producto</title>
    <style>
        #contenedor{
            margin-top: 0px;
            margin-right: 100px;
            margin-left: 100px;
            margin-bottom: 100px;
            padding-right:20%;
            padding-left:20%;
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

    if(isset($_POST['submit2'])){
        $targetDir = "../resources/img/shopimages/";  // Directorio donde se guardarán las imágenes
        $targetFile = $targetDir . basename($_FILES["file"]["name"]);

        // Verificar si el archivo es una imagen real
        $check = getimagesize($_FILES["file"]["tmp_name"]);
        if ($check !== false) {
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) { 
                // Registro en la base de datos
                $nombre = $_POST["nombre"];
                $categoria = $_POST["categoria"];
                $texto = $_POST["texto"];
                $existencia = $_POST["existencia"];
                $precio = $_POST["precio"];
                $descuento = $_POST["descuento"];
                $file = $_FILES["file"]["name"];

                $sql = "INSERT INTO producto (Nombre_Pto, Categoria, Descripcion, Existencia, Precio, Descuento, Imagen) VALUES ('$nombre', '$categoria', '$texto', '$existencia','$precio','$descuento','$file')";

                if ($conexion->query($sql) === TRUE) {
                    ?>
                    <script>
                        swal("Registro Completo", "Información enviada correctamente", "success");
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
        } else { ?>
            <!-- <div class="alert alert-warning" role="alert">
                <strong>El archivo </strong> no es una imagen válida.
            </div> -->
        <?php
        }
    }
?>

    <?php
        include('../includes/headrAdmin.php');
    ?>

    <div id="name"><p>Registro de producto</p></div>
    <div id="contenedor">
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"  enctype="multipart/form-data">
        <fieldset disabled>
            <div class="mb-3">
                <label for="disabledTextInput" class="form-label">ID del producto</label>
                <input type="number" id="disabledTextInput" class="form-control" placeholder="Generado automáticamente" required>
            </div>
        </fieldset>
        <div class="row">
            <div class="col mb-3">
                <label for="formGroupExampleInput" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="formGroupExampleInput" name="nombre" placeholder="Nombre del producto" required>
            </div>
            <div class="col-3">
                <label for="select" class="form-label">Categoría</label>
                <select class="form-select" aria-label="Default select example" id="select" name="categoria" required>
                    <option selected value ="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Descripción</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="texto" required></textarea>
        </div>
        <div class="row">
            <div class="col">
                <label for="" class="form-label">Existencia</label>
                <input type="number" class="form-control" placeholder="Existencia" name="existencia" required>
            </div>
            <div class="col">
                <label for="" class="form-label">Precio</label>
                <input type="number" class="form-control" placeholder="Precio" name="precio" required>
            </div>
            <div class="col">
                <label for="" class="form-label">Descuento</label>
                <input type="number" class="form-control" placeholder="Descuento" name="descuento" required>
            </div>
        </div>
        <div class="mb-3">
            <label for="file" class="form-label">Imagen del producto</label>
            <input class="form-control form-control-sm" id="file" type="file" name="file" required>
        </div>
        <center><button type="submit" value="submit2" name="submit2" class="btn btn-primary" style="background-color: rgb(255,128,0); border-color:rgb(255,128,0);">Añadir</button></center>
    </form>
    <a href="admin.php"><button class="btn btn-primary" style="background-color: rgb(255,128,0); border-color:rgb(255,128,0);">Regresar</button></a>
    </div>
    <?php
        include('../includes/footer.html');
    ?>
</body>
</html>