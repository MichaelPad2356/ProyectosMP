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

    $opc = $_POST["opcion"];

    switch ($opc) {
        case 1: {
            $sql = "SELECT * FROM producto";
            break;
        }
        case 2: {
            $sql = "SELECT * FROM producto ORDER BY Precio ASC";
            break;
        }
        case 3: {
            $sql = "SELECT * FROM producto ORDER BY Existencia ASC";
            break;
        }
        case 4: {
            $palabra1 = $_POST["campo1"];
            $palabra2 = $_POST["campo2"];
            $sql = "SELECT * FROM producto WHERE Categoria LIKE '%$palabra1%' AND Nombre_Pto LIKE '%$palabra2%'";
            break;
        }
        default: {
            echo "Opción no válida\n";
        }
    }
    $result = $conexion->query($sql);
?>
<head>
    <script src="https://kit.fontawesome.com/0d4c0ee316.js" crossorigin="anonymous"></script>
    <style>
    /* Estilos para el modal */
    body {
      font-family: Arial, sans-serif;
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
  </style>
</head>

<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Nombre</th>
      <th scope="col">Categoria</th>
      <th scope="col">Descripción</th>
      <th scope="col">Existencia</th>
      <th scope="col">Precio</th>
      <th scope="col">Descuento</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody class="table-group-divider">
  <?php
    // Mostrar resultados en la tabla
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<th scope='row'>" . $row["ID_Pto"] . "</th>";
            echo "<td>" . $row["Nombre_Pto"] . "</td>";
            echo "<td>" . $row["Categoria"] . "</td>";
            echo "<td>" . $row["Descripcion"] . "</td>";
            echo "<td>" . $row["Existencia"] . "</td>";
            echo "<td>$" . $row["Precio"] . "</td>";
            echo "<td>$" . $row["Descuento"] . "</td>";
            echo "<td><a href='a2_modificarProducto.php?idProducto=" . urlencode($row["ID_Pto"]) . "' class='btn btn-small btn-warning'><i class='fa-solid fa-pen-to-square'></i></a></td>";
            echo "<td><a href='a1_eliminarProducto.php?idProducto=" . urlencode($row["ID_Pto"]) . "' class='btn btn-small btn-danger'><i class='fa-solid fa-trash-can' data-valor=".$row["ID_Pto"]."></i></a></td>";
            echo "</tr>";
        }
    }else {
        echo "<tr><td colspan='3'>No hay resultados</td></tr>";
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
        function obtenerValor(icono) {
          console.log('Función obtenerValor ejecutada.');
            // Obtener el valor del atributo data-valor del codigo AJAX
            var valor = icono.getAttribute('data-valor');

            console.log('Valor:', valor);
            mostrarModal(valor);
        }
</script>

  </tbody>
</table>