<?php
// Verificar si se ha enviado el valor
if (isset($_POST['valorID'])) {
    // Obtener el valor enviado por la solicitud AJAX
    $valor = $_POST['valorID'];

    // Conexión a la base de datos
    $servidor='localhost';
    $cuenta='root';
    $password='';
    $bd='mamba';

    $conexion = new mysqli($servidor,$cuenta,$password,$bd);

    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    $nombreCarpeta = '../resources/img/shopimages/';
    // Sentencia preparada
    $sql1 = "SELECT Imagen FROM producto WHERE ID_Pto = ?";

    $stmt = $conexion->prepare($sql1);
    $stmt->bind_param("i", $valor);
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

    
    $sql = "DELETE FROM producto WHERE ID_Pto = $valor";
    $result = $conexion->query($sql);

} else {
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
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
        #myModal {
      display: none;
      position: fixed;
      z-index: 7;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
    }

    #modalContent {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 25%;
    }

    #btnContainer {
      text-align: center;
    }

    /* Estilos para el botón de acción */
    #btnContinuar, #btnCancelar {
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
    }

    #btnContinuar {
      background-color: #4CAF50;
      color: white;
      border: none;
    }

    #btnCancelar {
      background-color: #f44336;
      color: white;
      border: none;
    }

    #btnContinuar:hover, #btnCancelar:hover {
      opacity: 0.8;
    }
    form{
        padding-bottom: 50px;
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
    
    $idP = $_GET["idProducto"];
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
        </fieldset>
        
    </form>
    <center><button value="<?php echo htmlspecialchars($data['ID_Pto']); ?>" name="eliminar" class="btn btn-primary btn-danger" onclick="obtenerValor()">Eliminar</button></center>
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
}
?>


    
<div id="myModal">
        <div id="modalContent">
            <center><p>¿Desea continuar con la operación?</p></center>
            <div id="btnContainer">
                <button id="btnContinuar" data-valor="" onclick="continuarOperacion()">Continuar</button>
                <button id="btnCancelar" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
    </div>


<script>
        function mostrarModal(valor) {
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            var btnContinuar = document.getElementById("btnContinuar");
            btnContinuar.setAttribute("data-valor", valor);
        }

        // Función para cerrar el modal
        function cerrarModal() {
            var modal = document.getElementById("myModal");
            modal.style.display = "none";
        }

        // Función para continuar con la operación
        function continuarOperacion() {
            // Obtener el botón
            var btnContinuar = document.getElementById("btnContinuar");

            // Obtener el valor del atributo data-valor
            var valorData = btnContinuar.getAttribute("data-valor");

            // Obtener el valor del atributo data-valor del código AJAX
            var valor = valorData;

            // Crear una instancia de XMLHttpRequest
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log('Solicitud completada con éxito');
                    console.log('Respuesta del servidor:', xhr.responseText);
                    window.location.href = "admin.php";
                } else {
                console.error('Error en la solicitud. Código de estado:', xhr.status);
                }
            }
            };

            // Configurar la solicitud
            xhr.open("POST", "a1_eliminarProducto.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            // Enviar la solicitud con el valor como parámetro
            xhr.send("valorID=" + encodeURIComponent(valor));

            cerrarModal();
        }
        function obtenerValor() {
            // Obtener el elemento del botón por su nombre
            var boton = document.getElementsByName("eliminar")[0];

            // Obtener el valor del botón
            var valor = boton.value;
            mostrarModal(valor);
        }
</script>
    <?php
        include('../includes/footer.html');
    ?>
</body>
</html>