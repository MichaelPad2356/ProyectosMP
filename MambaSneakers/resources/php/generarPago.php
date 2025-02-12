<?php

ob_start();
session_start();

require('../../dependencies/fpdf/fpdf.php');

$servidor = 'localhost';
$cuenta = 'root';
$password = '';
$bd = 'mamba';

$conexion = new mysqli($servidor, $cuenta, $password, $bd);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$usuarioID = $_SESSION["ID"];
$consulta = "SELECT Correo_Usr FROM usuario WHERE ID = '$usuarioID'";
$res = $conexion->query($consulta);
$usuario = $res->fetch_assoc();
// Obtener la dirección de correo electrónico del usuario
$correoUsuario = $usuario['Correo_Usr'];

$usuarioID = $_SESSION["ID"];

$stmt = $conexion->prepare(
    "UPDATE venta
    SET Cart=0
    WHERE ID_Cte = ?");
$stmt->bind_param('s', $usuarioID);
$stmt->execute();
$res = $stmt->get_result();
$stmt->close();
$conexion->close();

// Datos de la compra
$cantidadArray = $_SESSION["cantidadArray"];
$precioArray = $_SESSION["precioArray"];
$nombreArray = $_SESSION["nombreArray"];
$subtotal = $_SESSION["subtotal"];
$tax = $_SESSION["tax"];
$envio = $_SESSION["envio"];
$cupon = $_SESSION["cupon"];
$total = $_SESSION["total"];

$calle = isset($_SESSION["calle"]) ? $_SESSION["calle"] : '';
$colonia = isset($_SESSION["colonia"]) ? $_SESSION["colonia"] : '';
$ciudad = isset($_SESSION["ciudad"]) ? $_SESSION["ciudad"] : '';
$CP = isset($_SESSION["CP"]) ? $_SESSION["CP"] : '';

$pais_codigo = isset($_SESSION["pais"]) ? $_SESSION["pais"] : '';
$paises = array(
    '0' =>'Mexico',
    '1' => 'Estados Unidos',
    '2' => 'Canada',
    // Agrega más países según sea necesario
);
$pais = isset($paises[$pais_codigo]) ? $paises[$pais_codigo] : '';


$direccion = $calle . ', ' . $colonia . ', ' . $ciudad . ', ' . $CP . ', ' . $pais;

if (!empty($_SESSION["numTarje"])) {
    // Pago con tarjeta
    $metodoPago = 'Tarjeta de crédito (**** **** **** ' . substr($_SESSION["numTarje"], -4) . ')';
} else {
    // Pago con OXXO (código QR)
    $metodoPago = 'OXXO (Codigo QR - Pagar en las siguientes 24 horas)';
}

// Crear PDF
$pdf = new FPDF();

$pdf->AddPage();

$pdf->Image('../img/logoMAMBA.png', 95, 10, 0, 22,); // Ajusta la ruta y las dimensiones del logo según sea necesario

// Espaciado después del logo
$pdf->Ln(21);
$pdf->SetFont('Arial', 'B', 16);
$pdf->SetFillColor(255, 255, 255); 
$pdf->SetTextColor(255, 165, 0); 
$pdf->Cell(0, 10, 'MAMBAsneakers', 0, 1, 'C', true); // Centrado

// Estilo para el título
$pdf->SetFont('Arial', 'B', 16);
$pdf->SetFillColor(255, 165, 0); // Color naranja
$pdf->SetTextColor(255, 255, 255); // Texto blanco
$pdf->Cell(0, 10, 'Resumen de Compra', 0, 1, 'C', true); // Centrado

// Tabla de productos

$pdf->SetFont('Arial', 'B', 12);
$pdf->SetTextColor(0, 0, 0); 
$pdf->Cell(0, 10, 'Lista de Productos', 0, 1, 'L');

// Encabezados de la tabla de productos
$pdf->SetFillColor(255, 165, 0); // Color naranja
$pdf->SetTextColor(255, 255, 255); // Texto blanco
$pdf->Cell(110, 10, 'Producto', 1, 0, 'C', true);
$pdf->Cell(30, 10, 'Precio', 1, 0, 'C', true);
$pdf->Cell(20, 10, 'Cantidad', 1, 0, 'C', true);
$pdf->Cell(30, 10, 'Total', 1, 1, 'C', true);

// Contenido de la tabla de productos
if (is_array($nombreArray)) {
    
    foreach ($nombreArray as $id => $nombre) {
        $pdf->SetTextColor(0, 0, 0); // Cambia el color del texto a negro
        $pdf->Cell(110, 10, $nombre, 1);
        $pdf->Cell(30, 10, "$" . number_format($precioArray[$id], 2, '.', ','), 1);
        $pdf->Cell(20, 10, $cantidadArray[$id], 1);
        $pdf->Cell(30, 10, "$" . number_format($precioArray[$id] * $cantidadArray[$id], 2, '.', ','), 1);
        $pdf->Ln();
    }
} else {
    $pdf->Cell(0, 10, 'No hay productos en la compra', 0, 1, 'C');
}

// Tabla de resumen
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, 'Total del Cart', 0, 1, 'L');

// Detalles de la compra
$pdf->SetFillColor(255, 165, 0); // Color naranja
$pdf->SetTextColor(255, 255, 255); // Texto blanco
$pdf->Cell(60, 10, 'Subtotal', 1, 0, 'C', true);
$pdf->Cell(35, 10, 'Cupon', 1, 0, 'C', true);
$pdf->Cell(35, 10, 'Envio', 1, 0, 'C', true);
$pdf->Cell(30, 10, 'Impuesto', 1, 1, 'C', true);

// Valores de la compra
$pdf->SetTextColor(0, 0, 0); 
$pdf->Cell(60, 10, "$" . number_format($subtotal, 2, '.', ','), 1);
$descuentoCupon = $subtotal * $cupon;
$pdf->Cell(35, 10, "-$" . number_format($descuentoCupon, 2, '.', ','), 1);
$pdf->Cell(35, 10, "$" . number_format($envio, 2, '.', ','), 1);
$pdf->Cell(30, 10, "$" . number_format($subtotal * $tax, 2, '.', ','), 1);


// Total a pagar
$pdf->Ln(10);
$pdf->SetFillColor(255, 165, 0); // Color naranja
$pdf->SetTextColor(0, 0, 0); // Texto blanco
$pdf->Cell(0, 10, 'Total a Pagar', 0, 1, 'L');
$pdf->SetTextColor(0, 0, 0); // Cambia el color del texto a negro

$totalConDescuento = $subtotal - $descuentoCupon;
$totalConEnvioEImpuesto = $totalConDescuento + $envio + ($subtotal * $tax);
$pdf->Cell(0, 10, "$" . number_format($totalConEnvioEImpuesto, 2, '.', ','), 0, 1);

// Modo de pago y dirección de envío
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, 'Detalles Adicionales', 0, 1, 'L');
$pdf->Cell(0, 10, 'Direccion de envio: ' . utf8_decode($direccion), 0, 1);
$pdf->Cell(0, 10, 'Metodo de pago: ' . utf8_decode($metodoPago), 0, 1);
$pdf->Cell(0, 10, 'Correo: ' . utf8_decode($correoUsuario), 0, 1);

if (empty($_SESSION["numTarje"])) {
    $pdf->Image('../img/qr.png', 80, $pdf->GetY() + 5, 50);
}

// Salida del PDF
$pdf->Output('I', 'resumen_compra.pdf'); 
$_SESSION['carrito'] = array(); // Vaciar el carrito


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../../dependencies/PHPMailer-master/src/Exception.php';
require '../../dependencies/PHPMailer-master/src/PHPMailer.php';
require '../../dependencies/PHPMailer-master/src/SMTP.php';

    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 0;                                   //Enable verbose debug output
    $mail->isSMTP();                                        //Send using SMTP
    $mail->Host       = 'smtp.office365.com';               //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                               //Enable SMTP authentication
    $mail->Username   = 'mamba_sneakers@outlook.com';       //SMTP username
    $mail->Password   = '0';                                //SMTP password - deleted
    $mail->SMTPSecure = 'STARTTLS';                         //Enable implicit TLS encryptionS
    $mail->Port       = 587;                                //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS                             //SMTP password
    $mail->setFrom('mamba_sneakers@outlook.com', 'Mamba Sneakers');
    $mail->addAddress($correoUsuario);     //Add a recipient
    $mail->Subject = 'Respuesta';
    //Content
    $mail->isHTML(true);  
    $mail->CharSet = 'UTF-8'; 
    $mail->Body = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #ffa500;
                border-radius: 10px;
            }
            h2 {
                color: #ffa500;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            table, th, td {
                border: 1px solid #ffa500;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>MAMBAsneakers - Resumen de Compra</h2>
            
            <h3>Lista de Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>';
                  
                    foreach ($nombreArray as $id => $nombre) {
                        $mail->Body .= '<tr>';
                        $mail->Body .= '<td>' . $nombre . '</td>';
                        $mail->Body .= '<td>$' . number_format($precioArray[$id], 2, '.', ',') . '</td>';
                        $mail->Body .= '<td>' . $cantidadArray[$id] . '</td>';
                        $mail->Body .= '<td>$' . number_format($precioArray[$id] * $cantidadArray[$id], 2, '.', ',') . '</td>';
                        $mail->Body .= '</tr>';
                    }
                
                $mail->Body .= '
                </tbody>
            </table>
    
            <h3>Resumen</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>$' . number_format($subtotal, 2, '.', ',') . '</td>
                    </tr>
                    <tr>
                        <td>Cupón</td>
                        <td>-$' . number_format($descuentoCupon, 2, '.', ',') . '</td>
                    </tr>
                    <tr>
                        <td>Envío</td>
                        <td>$' . number_format($envio, 2, '.', ',') . '</td>
                    </tr>
                    <tr>
                        <td>Impuesto</td>
                        <td>$' . number_format($subtotal * $tax, 2, '.', ',') . '</td>
                    </tr>
                    <tr>
                        <td>Total a Pagar</td>
                        <td>$' . number_format($totalConEnvioEImpuesto, 2, '.', ',') . '</td>
                    </tr>
                </tbody>
            </table>
    
            <h3>Detalles Adicionales</h3>
            <p>Dirección de envío: ' . utf8_decode($direccion) . '</p>
            <p>Método de pago: ' . utf8_decode($metodoPago) . '</p>
    
            <p>¡Gracias por tu compra en MAMBAsneakers!</p>
        </div>
    </body>
    </html>';
    
    $mail->send();
    
?>