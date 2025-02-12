<?php
ob_start();
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../resources/img/fav.ico" type="image/x-icon">
    <title>MAMBA - Graficas</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <?php
    include('../includes/headrAdmin.php');

    // Conexión a la base de datos
    $servidor = 'localhost';
    $cuenta = 'root';
    $password = '';
    $bd = 'mamba';

    $conexion = new mysqli($servidor, $cuenta, $password, $bd);

    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    // Consulta para obtener los productos más vendidos
    $queryProductos = "SELECT p.ID_Pto, p.Nombre_Pto, SUM(v.Cantidad) as TotalVendido
        FROM venta v
        JOIN producto p ON v.Id_Prod = p.ID_Pto
        WHERE v.Cart = 0
        GROUP BY p.ID_Pto
        ORDER BY TotalVendido DESC
        LIMIT 10";

    $resultProductos = $conexion->query($queryProductos);

    // Convertir el resultado a un array asociativo
    $dataProductos = array();
    while ($rowProductos = $resultProductos->fetch_assoc()) {
        $dataProductos[] = $rowProductos;
    }

    // Consulta para obtener el top 5 de usuarios que más han comprado
    $queryUsuarios = "SELECT u.Usuario, SUM(v.Cantidad) as TotalCompras
        FROM venta v
        JOIN usuario u ON v.ID_Cte = u.ID
        WHERE v.Cart = 0
        GROUP BY u.ID
        ORDER BY TotalCompras DESC
        LIMIT 5";

    $resultUsuarios = $conexion->query($queryUsuarios);

    // Convertir el resultado a un array asociativo
    $dataUsuarios = array();
    while ($rowUsuarios = $resultUsuarios->fetch_assoc()) {
        $dataUsuarios[] = $rowUsuarios;
    }

    // Cerrar conexión
    $conexion->close();

    // Obtenemos etiquetas y datos para la gráfica de productos
    $labelsProductos = array();
    $valuesProductos = array();
    foreach ($dataProductos as $itemProductos) {
        $labelsProductos[] = $itemProductos['Nombre_Pto'];
        $valuesProductos[] = $itemProductos['TotalVendido'];
    }

    // Obtener etiquetas y datos para la gráfica de usuarios
    $labelsUsuarios = array();
    $valuesUsuarios = array();
    foreach ($dataUsuarios as $itemUsuarios) {
        $labelsUsuarios[] = $itemUsuarios['Usuario'];
        $valuesUsuarios[] = $itemUsuarios['TotalCompras'];
    }
    ?>

    <center><h1>Top Sneakers Más Vendidos</h1></center>
    <br>
    <center>
        <div style="width: 500px; height: 500px;">
            <canvas id="myPieChart"></canvas>
        </div>
    </center>
    <br><br><br><br>
    <center><h1>Top Usuarios que Más Sneakers Han Comprado</h1></center>
    <br>
    <center>
        <div style="width: 500px; height: 500px;">
            <canvas id="myBarChart"></canvas>
        </div>
    </center>

    <script>
    // Obtenemos el contexto del lienzo para la gráfica de pastel
    var ctxPie = document.getElementById('myPieChart').getContext('2d');

    // Configuramos los datos para la gráfica de pastel
    var dataPie = {
        labels: <?php echo json_encode($labelsProductos); ?>,
        datasets: [{
            data: <?php echo json_encode($valuesProductos); ?>,
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(241, 196, 15, 0.7)'
            ],
        }]
    };

    // Configura las opciones de la gráfica de pastel
    var optionsPie = {
        responsive: true,
        maintainAspectRatio: false,
    };

    // Crea la gráfica de pastel
    var myPieChart = new Chart(ctxPie, {
        type: 'pie',
        data: dataPie,
        options: optionsPie
    });

    // Obtenemos el contexto del lienzo para la gráfica de barras
    var ctxBar = document.getElementById('myBarChart').getContext('2d');

    // Configura los datos para la gráfica de barras
    var dataBar = {
        labels: <?php echo json_encode($labelsUsuarios); ?>,
        datasets: [{
            label: 'Total de Compras',
            data: <?php echo json_encode($valuesUsuarios); ?>,
            backgroundColor: 'rgba(255, 165, 0, 0.7)',
            borderColor: 'orange',
            borderWidth: 1
        }]
    };

    // Configuramos las opciones de la gráfica de barras
    var optionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Creamos la gráfica de barras
    var myBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: dataBar,
        options: optionsBar
    });
    </script>

    <?php
    include('../includes/footer.html');
    ?>
</body>
</html>
