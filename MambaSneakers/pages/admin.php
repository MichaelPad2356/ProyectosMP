<?php
    ob_start();
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../resources/css/admin.css">
    <title>MAMBA - Admin</title>
    <script src="../resources/js/jquery-3.4.1.min.js"></script>
</head>
<body>

    <?php
        include('../includes/headrAdmin.php');
    ?>

    <br>
    <div class="container">
        <div class="sidebar">
            <h3>Buscar</h3>
            <form class="search-form" method="post" action="#">
                <label for="category">Categoría:</label>
                <select id="category" name="category" >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                </select>
                <br>
                <label for="name">Nombre:</label>
                <input type="text" id="name" name="name" >
                <br><br>
                
            </form><button onclick="enviarFormulario();">Buscar</button>
            <br><br>
            <div class="buttons">
                <button onclick="mostrar('1','1','1');">Mostrar Todos</button>
                <br><br>
                <button onclick="mostrar('2','1','1');">Ordenar por Precio</button>
                <br><br>
                <button onclick="mostrar('3','1','1');">Ordenar por Disponibilidad</button>
                <br><br>
                <a href="a3_registrarProducto.php"><button>Registrar Producto</button></a>
                <br><br>
            </div>
        </div>
        <div class="main-content" id="registros">
            <h1>REGISTROS</h1>
            <hr>
            <!-- Contenido de la columna derecha aquí -->
            <div id="MostrarRespuesta">

            </div>
            


        </div>
    </div>
    <center><a href="graficas.php"><button id="btnGraficas">Acceder a las Estadisticas</button></a></center>
    <br><br><br>
    
    <?php
        include('../includes/footer.html');
    ?>

    <script>
        $(document).ready(function() {
        // Llama a la función mostrar al cargar la página
            mostrar(1);
        });

        function enviarFormulario() {
            var campo1 = $('#category').val();
            var campo2 = $('#name').val();
            mostrar(4, campo1, campo2);
        }

	    function mostrar(opc,campo1,campo2){
            var parametros = 
            {
                "opcion" : opc,
                "campo1" : campo1,
                "campo2" : campo2,
            };

            $.ajax({
                data: parametros,
                url: 'codigo_php.php',
                type: 'POST',
        
                beforesend: function(){
                    $('#MostrarRespuesta').html("Mensaje antes de Enviar");
                },

                success: function(mensaje){
                    $('#MostrarRespuesta').html(mensaje);
                }
            });
        }
</script>


</body>
</html>