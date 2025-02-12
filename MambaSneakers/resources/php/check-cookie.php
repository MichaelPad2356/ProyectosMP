
<?php

// Verificar si la cookie 'popupShown' existe en el lado del servidor
$popupShown = isset($_COOKIE['popupShown']) ? $_COOKIE['popupShown'] : '';

// Devolver la respuesta al cliente
echo $popupShown;

?>
