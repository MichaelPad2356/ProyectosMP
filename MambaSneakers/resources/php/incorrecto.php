<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Datos Erróneos</title>
    <link rel="stylesheet" href="../css/header.css">
    <style>
        body{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 7%;
            background-color: #e36124;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            color: #231b31;
        }

        .square{
            display: flex;
            justify-content: center;
            align-items: center;

            padding: 250px;
            
             
            height: 100px; 
            background-color: white; 
            border-radius: 15px; 
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5); 
            
        }
        .messg{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            

        }

        .messg img{
            
            width:50%;
            margin-top: 6%;
        }

        .messg a {
            text-decoration: none; 
            color: #231b31; 
            background-color: #F4A261; 
            margin-top: 5%;
            padding: 10px; 
            border-radius: 10px; 
            transition: background-color 0.3s, color 0.3s; 
        }

        .messg a:hover {
            background-color: #E76F51;
            color: #FFFFFF; 
        }

        .datosI{
            margin-top: 10%;
        }
        
        

    </style>
</head>
<body>
    <div class="square">
        <div class="messg">
            <h1>Lo sentimos..</h1>
            <img src="../img/bailey.png" alt="">
            <?php
                if(isset($_GET['error'])){
                    echo '<h1 class="datosI" >El correo ya está registrado</h1>';  
                }else{
                    echo '<h1 class="datosI" >Datos Incorrectos</h1>';
                }
            ?>
            <a href="../../pages/homee.php">Intentar de nuevo</a>
        </div>
    </div> 

</body>
</html>