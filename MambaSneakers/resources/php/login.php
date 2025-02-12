<?php
ob_start(); //por si no funciona el header location (activa almacenamiento en buffer de salida)
session_start();
$config['base_url'] = 'http://' . $_SERVER["SERVER_NAME"]; //nombre del servidor(dominio) en el que estas actualmente
//require 'formulario.php';  ARCHIVO HEADER???



    $usuario = $_POST["email"];
    $palabra = $_POST["palabra_secreta"];

    $palabra_secreta = password_hash($palabra, PASSWORD_BCRYPT);

    $servidor='localhost';
    $cuenta='root';
    $password='';
    $bd='mamba';
     
    //conexion a la base de datos
    $conexion = new mysqli($servidor,$cuenta,$password,$bd);

    if ($conexion->connect_errno){
         die('Error en la conexion');
    }
    
   $stmt = $conexion->prepare("SELECT * FROM usuario WHERE Correo_Usr = ?");
   $stmt->bind_param('s', $usuario); 
   $stmt->execute();
   $res = $stmt->get_result();

    if($res->num_rows > 0){
        $fila=$res->fetch_assoc();
        $contra=$fila['Password_Usr'];


        if(password_verify($palabra, $contra)){
            $usuario=$fila['Usuario'];
            $ID=$fila['ID'];
            $Nombre_Usr=$fila['Nombre_Usr'];
            $correo=$fila['Correo_Usr'];
            $pregSeguridad=$fila['PregSeguridad'];

            //si el usuario tiene intentos fallidos, los reseteamos
            $cookieKey = md5($usuario);
            if(isset($_COOKIE[$cookieKey])){
                setcookie($cookieKey, 0, time() - 3600, '/');
            }

            if(!isset($_COOKIE["email"]) && !isset($_COOKIE["password"]) && isset($_POST["checkbox"])){
                setcookie("email", $correo, time() + 3600, "/");
                setcookie("password", $palabra, time() + 3600, "/");
            }
            
            $stmt->close();
            $conexion->close();

            session_start();
            $_SESSION["usuario"] = $usuario;
            $_SESSION["ID"] = $ID;
            $_SESSION["Nombre_Usr"] = $Nombre_Usr;
            $_SESSION["correo"] = $correo;
            $_SESSION["pregSeguridad"] = $pregSeguridad;

            
            

            # Luego redireccionamos a la pagina "Secreta"
            # redireccionamiento con php
            header("Location: ../../pages/homee.php");
            //header("Location:".$base_url."secreta.php");

            # redireccionamiento con javascript   
            //echo '<script>window.location="'.$base_url.'secreta.php"</script>';
        
        } else {
            # No coinciden, asi  que simplemente imprimimos un
            # mensaje diciendo que es incorrecto
            
            $cookieKey = md5($usuario);

            //Incrementamos los intentos fallidos del usuario en su cookie
            if(isset($_COOKIE[$cookieKey])){
                $intentos = $_COOKIE[$cookieKey] + 1;
                setcookie($cookieKey, $intentos, time() + 3600, '/');
            } else {
                $_SESSION["usAttempts"] = $cookieKey;
                setcookie($cookieKey, 1, time() + 3600, '/');
            }


            
            $stmt->close();
            $conexion->close();
            //header("Location: incorrecto.php");
            header("Location: ../../pages/homee.php?error=1");
            

        }
    }
        $stmt->close();
        $conexion->close();
        
        header("Location: ../../pages/homee.php?error=1");

    ?>