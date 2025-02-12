<?php
ob_start();
session_start();

function create_captcha($text)
{
    $width = 200;
    $height = 100;
    $fontfile = __DIR__ . "/OpenSans-Regular.ttf";
    

    $image = imagecreatetruecolor($width, $height);

    $white = imagecolorallocate($image, 255, 255, 255);
    $black = imagecolorallocate($image, 0, 0, 0);
	

    imagefill($image, 0, 0, $white);
    imagettftext($image, 25, rand(-20, 20), $width / 4, 60, $black, $fontfile, $text);
	

    $warped_image = imagecreatetruecolor($width, $height);
    imagefill($warped_image, 0, 0, imagecolorallocate($warped_image, 255, 255, 255));

    for ($x = 0; $x < $width; $x++) {
        for ($y = 0; $y < $height; $y++) {
            $index = imagecolorat($image, $x, $y);
            $color_comp = imagecolorsforindex($image, $index);

            $color = imagecolorallocate($warped_image, $color_comp['red'], $color_comp['green'], $color_comp['blue']);

            $imageX = $x;
            $imageY = $y + sin($x / 10) * 10;

            imagesetpixel($warped_image, $imageX, $imageY, $color);
        }
    }

    $path = "captcha.jpg";
    imagejpeg($warped_image, $path);
    imagedestroy($warped_image);
    imagedestroy($image);

    return $path;
}

function generateRandomString($length = 5){
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    $max = strlen($characters) - 1;
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $max)];
    }
    return $randomString;
}

$filename = session_id();

if (isset($_POST['number'])) {
    $number = file_get_contents($filename);
    if ($_POST['number'] == $number) {
        echo "<div style='text-align:center;'>
			<h5 style= 'color: green; text-align:center;'>El captcha es Correcto!</h5>
		</div>";
        echo "<script>
                window.opener.postMessage('captchaVerified', '*');
                setTimeout(function() {
                    window.close();
                }, 2000);
              </script>";
    } else {
        echo "<div style='text-align:center;'>
			<h5 style= 'color: red; text-align:center;'>El captcha es Incorrecto!</h5>
		</div>";
        $text = generateRandomString(5);

        $myimage = create_captcha($text);
        file_put_contents($filename, $text);
    }
} else {
    $text = generateRandomString(5);

    $myimage = create_captcha($text);
    file_put_contents($filename, $text);
}

?>


<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <style>
        body {
            background-color: #f0f0f0; /* Color de fondo */
            font-family: Arial, sans-serif; /* Tipo de fuente */
            display: grid;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Altura total de la ventana */
            margin: 0;
        }

        form {
            width: 300px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* Sombra ligera */
            padding: 30px;
            background-color: white; /* Color de fondo del formulario */
            border-radius: 10px; /* Bordes redondeados */
        }

        input[type="text"], input[type="submit"] {
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-top: 10px;
            width: 100%;
            transition: border-color 0.3s ease; /* Transición en el cambio de borde */
        }

        input[type="text"]:focus {
            outline: none;
            border-color: rgb(255, 128, 0); /* Color del borde al enfocar */
        }

        input[type="submit"] {
            background-color: rgb(255, 128, 0); /* Color de fondo del botón */
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease; /* Transición de color al pasar el cursor */
        }

        input[type="submit"]:hover {
            background-color: #ff9933; /* Color al pasar el cursor */
        }

        img {
            width: 90%;
            display: block;
            margin-top: 20px;
        }

		h3{
			text-align: center;
			color: rgb(255, 128, 0);
		}

		form:hover {
    		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2); /* Cambio en la sombra al pasar el cursor sobre el formulario */
		}

    </style>
    <script>
        function reloadCaptcha() {
            var captchaImage = document.getElementById('captchaImg');
            captchaImage.src = 'captcha.jpg?' + new Date().getTime(); // Agrega un parámetro de tiempo para evitar la caché
        }
    </script>
</head>
<body>
<h3>INGRESA EL CAPTCHA</h3>
    <form method="post">
        <input type="text" name="number" placeholder="Captcha">
        <input type="submit" value="Check">
        <img id="captchaImg" src="captcha.jpg"> <!-- ID para identificar la imagen del captcha -->
    </form>
    <script>
        //Llamada a la función para recargar la imagen del captcha si hay un error
        <?php if (isset($_POST['number'])) : ?>
            reloadCaptcha();
        <?php endif; ?>
    </script>
</body>
</html>
