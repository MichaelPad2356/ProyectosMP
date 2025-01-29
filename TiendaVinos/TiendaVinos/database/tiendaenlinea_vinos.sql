-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-12-2024 a las 07:04:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tiendaenlinea`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_estado_pedido` ()   BEGIN
    -- Definir el cursor para obtener los pedidos pendientes
    DECLARE done INT DEFAULT 0;
    DECLARE p_id INT;
    DECLARE p_estado VARCHAR(50);
    
    -- Cursor para obtener los pedidos con estado 'pendiente'
    DECLARE product_cursor CURSOR FOR
        SELECT p.ID_Pedido, p.Estado_Pedido
        FROM pedido p
        WHERE p.Estado_Pedido = 'pendiente';

    -- Controlador para cuando el cursor se queda sin registros
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Abrir el cursor
    OPEN product_cursor;

    -- Comenzar a recorrer los registros
    read_loop: LOOP
        FETCH product_cursor INTO p_id, p_estado;
        
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Aquí actualizamos el estado del pedido a 'enviado'
        UPDATE pedido
        SET Estado_Pedido = 'enviado'
        WHERE ID_Pedido = p_id;

    END LOOP;

    -- Cerrar el cursor
    CLOSE product_cursor;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InformeUnionProductos` ()   BEGIN
    SELECT DISTINCT p.Nombre, c.Nombre_Categoria
    FROM detalle_pedido dp
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto
    INNER JOIN categoria c ON p.ID_Categoria = c.ID_Categoria
    INNER JOIN pedido pd ON dp.ID_Pedido = pd.ID_Pedido
    WHERE pd.Fecha_Pedido BETWEEN FechaInicio AND FechaFin
    
    UNION
    
    SELECT DISTINCT p.Nombre, c.Nombre_Categoria
    FROM detalle_pedido dp
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto
    INNER JOIN categoria c ON p.ID_Categoria = c.ID_Categoria
    INNER JOIN pedido pd ON dp.ID_Pedido = pd.ID_Pedido
    WHERE pd.Fecha_Pedido BETWEEN FechaInicio AND (FechaFin + INTERVAL 7 DAY);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InformeVentasPorCategoria` (IN `FechaInicio` DATE, IN `FechaFin` DATE)   BEGIN
    SELECT 
        c.Nombre_Categoria, 
        SUM(dp.Cantidad * dp.Precio_Unitario) AS TotalVentas,
        AVG(dp.Cantidad * dp.Precio_Unitario) AS PromedioVentasPorPedido
    FROM detalle_pedido dp
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto
    INNER JOIN categoria c ON p.ID_Categoria = c.ID_Categoria
    INNER JOIN pedido pd ON dp.ID_Pedido = pd.ID_Pedido
    WHERE pd.Fecha_Pedido BETWEEN FechaInicio AND FechaFin
    GROUP BY c.Nombre_Categoria;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `calcular_descuento` (`precio` DECIMAL(10,2), `stock` INT) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
  DECLARE descuento DECIMAL(10,2);

  -- Calcular el descuento según el stock
  IF stock > 100 THEN
    SET descuento = precio * 0.10; -- 10% de descuento
  ELSEIF stock >= 50 THEN
    SET descuento = precio * 0.05; -- 5% de descuento
  ELSE
    SET descuento = 0; -- Sin descuento
  END IF;

  -- Retornar el precio con descuento
  RETURN precio - descuento;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `contar_productos_categoria` (`p_ID_Categoria` INT) RETURNS INT(11) DETERMINISTIC BEGIN
    DECLARE cantidad INT;
    
    SELECT COUNT(*) 
    INTO cantidad
    FROM producto
    WHERE ID_Categoria = p_ID_Categoria;
    
    RETURN cantidad;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `ID_Carrito` int(11) NOT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `Fecha_Creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`ID_Carrito`, `ID_Usuario`, `Fecha_Creacion`) VALUES
(1, 1, '2024-12-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `ID_Categoria` int(11) NOT NULL,
  `Nombre_Categoria` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`ID_Categoria`, `Nombre_Categoria`) VALUES
(1, 'Tintos'),
(2, 'Blancos'),
(3, 'Rosados'),
(4, 'Espumosos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_carrito`
--

CREATE TABLE `detalle_carrito` (
  `ID_Carrito` int(11) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_carrito`
--

INSERT INTO `detalle_carrito` (`ID_Carrito`, `ID_Producto`, `Cantidad`) VALUES
(1, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `ID_Pedido` int(11) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Precio_Unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`ID_Pedido`, `ID_Producto`, `Cantidad`, `Precio_Unitario`) VALUES
(3, 1, 6, 490.00),
(3, 15, 20, 460.00),
(45, 1, 3, 490.00),
(46, 7, 5, 300.00),
(47, 8, 2, 500.00),
(48, 9, 4, 520.00),
(49, 10, 6, 470.00),
(50, 11, 1, 430.00),
(51, 13, 7, 530.00),
(52, 14, 3, 480.00),
(53, 15, 2, 460.00),
(54, 1, 4, 490.00),
(55, 7, 6, 300.00),
(56, 8, 5, 500.00),
(57, 9, 2, 520.00),
(58, 10, 7, 470.00),
(59, 11, 3, 430.00),
(60, 13, 1, 530.00),
(61, 14, 4, 480.00),
(62, 15, 6, 460.00),
(63, 1, 2, 490.00),
(64, 7, 5, 300.00);

--
-- Disparadores `detalle_pedido`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_producto` BEFORE INSERT ON `detalle_pedido` FOR EACH ROW BEGIN
    DECLARE stock_actual INT;
    
    -- Stock actual del producto
    SELECT Stock INTO stock_actual 
    FROM producto 
    WHERE ID_Producto = NEW.ID_Producto;
    
    -- Se verifica si hay suficiente stock
    IF stock_actual < NEW.Cantidad THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No hay suficiente stock para realizar el pedido';
    ELSE
        -- Se actualiza el stock del producto
        UPDATE producto 
        SET Stock = Stock - NEW.Cantidad 
        WHERE ID_Producto = NEW.ID_Producto;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio`
--

CREATE TABLE `envio` (
  `ID_Envio` int(11) NOT NULL,
  `ID_Pedido` int(11) DEFAULT NULL,
  `Dirección_Envio` varchar(255) NOT NULL,
  `Estado_Envio` enum('en preparación','enviado','entregado') NOT NULL,
  `Fecha_Envio` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envio`
--

INSERT INTO `envio` (`ID_Envio`, `ID_Pedido`, `Dirección_Envio`, `Estado_Envio`, `Fecha_Envio`) VALUES
(4, 45, 'Avenida Reforma, CDMX', 'en preparación', '2024-12-01'),
(5, 46, 'Calle 15, Monterrey, Nuevo León', 'enviado', '2024-12-02'),
(6, 47, 'Boulevard Kukulcán, Cancún, Quintana Roo', 'entregado', '2024-12-03'),
(7, 48, 'Avenida Constitución, Guadalajara, Jalisco', 'en preparación', '2024-12-04'),
(8, 49, 'Calle Juárez, Tijuana, Baja California', 'enviado', '2024-12-05'),
(9, 50, 'Avenida 16 de Septiembre, León, Guanajuato', 'entregado', '2024-12-06'),
(10, 51, 'Calle Hidalgo, Puebla, Puebla', 'en preparación', '2024-12-07'),
(11, 52, 'Calle Madero, Mérida, Yucatán', 'enviado', '2024-12-08'),
(12, 53, 'Calle de la Reforma, Oaxaca, Oaxaca', 'entregado', '2024-12-09'),
(13, 54, 'Avenida Juárez, Monterrey, Nuevo León', 'en preparación', '2024-12-10'),
(14, 55, 'Calle 5, Mazatlán, Sinaloa', 'enviado', '2024-12-11'),
(15, 56, 'Boulevard Díaz Ordaz, Hermosillo, Sonora', 'entregado', '2024-12-12'),
(16, 57, 'Avenida Morelos, Culiacán, Sinaloa', 'en preparación', '2024-12-13'),
(17, 58, 'Avenida Vallarta, Guadalajara, Jalisco', 'enviado', '2024-12-14'),
(18, 59, 'Calle Reforma, Veracruz, Veracruz', 'entregado', '2024-12-15'),
(19, 60, 'Calle del Sol, San Luis Potosí, San Luis Potosí', 'en preparación', '2024-12-16'),
(20, 61, 'Avenida Independencia, Durango, Durango', 'enviado', '2024-12-17'),
(21, 62, 'Calle 20 de Noviembre, Puebla, Puebla', 'entregado', '2024-12-18'),
(22, 63, 'Avenida del Parque, Aguascalientes, Aguascalientes', 'en preparación', '2024-12-19'),
(23, 64, 'Calle de la Libertad, Querétaro, Querétaro', 'enviado', '2024-12-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `ID_EstadoDirc` int(11) NOT NULL,
  `Nombre_EstadoDirc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`ID_EstadoDirc`, `Nombre_EstadoDirc`) VALUES
(1, 'Ciudad de México'),
(2, 'Nuevo León'),
(3, 'Baja California'),
(5, 'Aguascalientes'),
(7, 'Baja California Sur'),
(8, 'Campeche'),
(9, 'Chiapas'),
(10, 'Chihuahua'),
(11, 'Coahuila'),
(12, 'Colima'),
(13, 'Durango'),
(14, 'Guanajuato'),
(15, 'Guerrero'),
(16, 'Hidalgo'),
(17, 'Jalisco'),
(18, 'Michoacán'),
(19, 'Morelos'),
(20, 'Nayarit'),
(21, 'Oaxaca'),
(22, 'Puebla'),
(23, 'Querétaro'),
(24, 'San Luis Potosí'),
(25, 'Sinaloa'),
(26, 'Sonora');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipio`
--

CREATE TABLE `municipio` (
  `ID_Municipio` int(11) NOT NULL,
  `Nombre_Municipio` varchar(50) NOT NULL,
  `ID_EstadoDirc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipio`
--

INSERT INTO `municipio` (`ID_Municipio`, `Nombre_Municipio`, `ID_EstadoDirc`) VALUES
(1, 'Coyoacán', 3),
(2, 'Mexicali', 3),
(5, 'nose', 2),
(7, 'La Paz', 7),
(8, 'Campeche', 8),
(9, 'Tuxtla Gutiérrez', 9),
(10, 'Chihuahua', 10),
(11, 'Saltillo', 11),
(12, 'Colima', 12),
(13, 'Durango', 13),
(14, 'Guanajuato', 14),
(15, 'Acapulco', 15),
(16, 'Pachuca', 16),
(17, 'Guadalajara', 17),
(18, 'Morelia', 18),
(19, 'Cuernavaca', 19),
(20, 'Tepic', 20),
(21, 'Oaxaca', 21),
(22, 'Puebla', 22),
(23, 'Querétaro', 23),
(24, 'San Luis Potosí', 24),
(25, 'Culiacán', 25),
(26, 'Hermosillo', 26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_stock`
--

CREATE TABLE `notificaciones_stock` (
  `ID_Notificacion` int(11) NOT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `Nombre_Producto` varchar(100) DEFAULT NULL,
  `Stock_Actual` int(11) DEFAULT NULL,
  `Fecha_Alerta` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones_stock`
--

INSERT INTO `notificaciones_stock` (`ID_Notificacion`, `ID_Producto`, `Nombre_Producto`, `Stock_Actual`, `Fecha_Alerta`) VALUES
(2, 15, 'Vino Rosado Tempranillo', 0, '2024-12-15 01:14:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `ID_Pago` int(11) NOT NULL,
  `ID_Pedido` int(11) DEFAULT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Metodo_Pago` enum('tarjeta','PayPal','transferencia') NOT NULL,
  `Fecha_Pago` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`ID_Pago`, `ID_Pedido`, `Monto`, `Metodo_Pago`, `Fecha_Pago`) VALUES
(3, 3, 6900.00, 'PayPal', '2024-12-18'),
(5, 45, 1470.00, 'tarjeta', '2024-12-01'),
(6, 46, 1500.00, 'PayPal', '2024-12-02'),
(7, 47, 1000.00, 'transferencia', '2024-12-03'),
(8, 48, 2080.00, 'tarjeta', '2024-12-04'),
(9, 49, 2820.00, 'PayPal', '2024-12-05'),
(10, 50, 430.00, 'transferencia', '2024-12-06'),
(11, 51, 3710.00, 'tarjeta', '2024-12-07'),
(12, 52, 1440.00, 'PayPal', '2024-12-08'),
(13, 53, 920.00, 'transferencia', '2024-12-09'),
(14, 54, 1960.00, 'tarjeta', '2024-12-10'),
(15, 55, 1800.00, 'PayPal', '2024-12-11'),
(16, 56, 2500.00, 'transferencia', '2024-12-12'),
(17, 57, 1040.00, 'tarjeta', '2024-12-13'),
(18, 58, 3290.00, 'PayPal', '2024-12-14'),
(19, 59, 1290.00, 'transferencia', '2024-12-15'),
(20, 60, 530.00, 'tarjeta', '2024-12-16'),
(21, 61, 1920.00, 'PayPal', '2024-12-17'),
(22, 62, 2760.00, 'transferencia', '2024-12-18'),
(23, 63, 980.00, 'tarjeta', '2024-12-19'),
(24, 64, 1500.00, 'PayPal', '2024-12-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID_Pedido` int(11) NOT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `Fecha_Pedido` date NOT NULL,
  `Estado_Pedido` enum('pendiente','procesado','enviado','entregado','cancelado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`ID_Pedido`, `ID_Usuario`, `Fecha_Pedido`, `Estado_Pedido`) VALUES
(3, 3, '2024-12-10', 'procesado'),
(45, 34, '2024-12-01', 'pendiente'),
(46, 35, '2024-12-02', 'procesado'),
(47, 36, '2024-12-03', 'enviado'),
(48, 37, '2024-12-04', 'pendiente'),
(49, 38, '2024-12-05', 'procesado'),
(50, 39, '2024-12-06', 'enviado'),
(51, 40, '2024-12-07', 'pendiente'),
(52, 41, '2024-12-08', 'procesado'),
(53, 42, '2024-12-09', 'enviado'),
(54, 43, '2024-12-10', 'pendiente'),
(55, 44, '2024-12-11', 'procesado'),
(56, 45, '2024-12-12', 'enviado'),
(57, 46, '2024-12-13', 'pendiente'),
(58, 47, '2024-12-14', 'procesado'),
(59, 48, '2024-12-15', 'enviado'),
(60, 49, '2024-12-16', 'pendiente'),
(61, 50, '2024-12-17', 'procesado'),
(62, 51, '2024-12-18', 'enviado'),
(63, 52, '2024-12-19', 'pendiente'),
(64, 53, '2024-12-20', 'procesado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_Producto` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Stock` int(11) NOT NULL,
  `ID_Categoria` int(11) DEFAULT NULL,
  `URL_Imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Descripcion`, `Precio`, `Stock`, `ID_Categoria`, `URL_Imagen`) VALUES
(1, 'Vino Tinto Syrah Reserva', 'Sabores a frutas negras y especias.', 490.00, 41, 1, 'v1.jpg'),
(7, 'Vino Rosado Zinfandel', 'Vino rosado con sabores frutales y florales.', 300.00, 34, 3, 'vino_rosado_inv.webp'),
(8, 'Vino Espumoso Brut', 'Vino espumoso italiano, ideal para celebraciones.', 500.00, 43, 4, 'vino_espumoso_inv.webp'),
(9, 'Vino Tinto Merlot', 'Vino tinto suave con notas de ciruela y especias.', 520.00, 44, 1, 'vino_tinto_merlot.webp'),
(10, 'Vino Blanco Sauvignon Blanc', 'Vino blanco fresco con sabores cítricos y herbales.', 470.00, 37, 2, 'vino_blanco_sauvignon.jpg'),
(11, 'Vino Rosado Provence', 'Vino rosado de la región de Provenza, ligero y afrutado.', 430.00, 46, 3, 'vino_rosado_provence.jpg'),
(13, 'Vino Tinto Malbec', 'Vino tinto argentino con sabores intensos de frutos oscuros.', 530.00, 42, 1, 'vino_tinto_malbec.jpg'),
(14, 'Vino Blanco Riesling', 'Vino blanco aromático con notas de manzana y miel.', 480.00, 43, 2, 'vino_blanco_riesling.jpg'),
(15, 'Vino Rosado Tempranillo', 'Vino rosado español con notas florales y frutales.', 460.00, 42, 3, 'vino_rosado_tempranillo.jpg');

--
-- Disparadores `producto`
--
DELIMITER $$
CREATE TRIGGER `alertar_stock_bajo` AFTER UPDATE ON `producto` FOR EACH ROW BEGIN
    DECLARE mensaje VARCHAR(255);
    
    -- Aqui se checasi el stock está por debajo del 10% del stock inicial
    IF NEW.Stock <= (SELECT FLOOR(COUNT(*) * 0.1) FROM producto) THEN
        -- Se prepara el mensaje de alerta
        SET mensaje = CONCAT(
            'ALERTA DE STOCK BAJO: ', 
            NEW.Nombre, 
            ' - Stock actual: ', 
            NEW.Stock,
            ' unidades'
        );
        
        -- Se inserta laa alerta en una tabla de notificaciones
        INSERT INTO notificaciones_stock (
            ID_Producto, 
            Nombre_Producto, 
            Stock_Actual, 
            Fecha_Alerta
        ) VALUES (
            NEW.ID_Producto,
            NEW.Nombre,
            NEW.Stock,
            NOW()
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `productos_mas_vendidos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `productos_mas_vendidos` (
`ID_Producto` int(11)
,`Nombre` varchar(100)
,`Descripcion` text
,`Precio` decimal(10,2)
,`URL_Imagen` varchar(255)
,`Total_Vendido` decimal(32,0)
,`Nombre_Categoria` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `Contra` varchar(100) NOT NULL,
  `Tipo` enum('Cliente','Administrador') NOT NULL,
  `ID_Municipio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre`, `Apellido`, `Correo`, `Contra`, `Tipo`, `ID_Municipio`) VALUES
(3, 'Ana', 'Gómez', 'ana.gomez@example.com', 'securePass456', 'Cliente', 2),
(5, 'Admin', 'admin', 'admin@gmail.com', 'admin1234', 'Administrador', 1),
(6, 'pepe', 'ave', 'pp@gmail.com', 'ab12345', 'Cliente', 1),
(34, 'Juan', 'Pérez', 'juan.perez@example.com', 'contra123', 'Cliente', 7),
(35, 'Anabel', 'Gómez', 'anab.gomez@example.com', 'contra123', 'Cliente', 8),
(36, 'Carlos', 'López', 'carlos.lopez@example.com', 'contra123', 'Cliente', 9),
(37, 'María', 'Rodríguez', 'maria.rodriguez@example.com', 'contra123', 'Cliente', 10),
(38, 'Luis', 'Hernández', 'luis.hernandez@example.com', 'contra123', 'Cliente', 11),
(39, 'Patricia', 'Martínez', 'patricia.martinez@example.com', 'contra123', 'Cliente', 12),
(40, 'Javier', 'Díaz', 'javier.diaz@example.com', 'contra123', 'Cliente', 13),
(41, 'Laura', 'Jiménez', 'laura.jimenez@example.com', 'contra123', 'Cliente', 14),
(42, 'Ricardo', 'García', 'ricardo.garcia@example.com', 'contra123', 'Cliente', 15),
(43, 'Sofía', 'Morales', 'sofia.morales@example.com', 'contra123', 'Cliente', 16),
(44, 'Pedro', 'Torres', 'pedro.torres@example.com', 'contra123', 'Cliente', 17),
(45, 'Daniela', 'Vázquez', 'daniela.vazquez@example.com', 'contra123', 'Cliente', 18),
(46, 'Raúl', 'Mendoza', 'raul.mendoza@example.com', 'contra123', 'Cliente', 19),
(47, 'Elena', 'Fernández', 'elena.fernandez@example.com', 'contra123', 'Cliente', 20),
(48, 'José', 'Ramírez', 'jose.ramirez@example.com', 'contra123', 'Cliente', 21),
(49, 'Felipe', 'Gutiérrez', 'felipe.gutierrez@example.com', 'contra123', 'Cliente', 22),
(50, 'Carmen', 'Castillo', 'carmen.castillo@example.com', 'contra123', 'Cliente', 23),
(51, 'Iván', 'Ríos', 'ivan.rios@example.com', 'contra123', 'Cliente', 24),
(52, 'Santiago', 'Luna', 'santiago.luna@example.com', 'contra123', 'Cliente', 25),
(53, 'Verónica', 'Sánchez', 'veronica.sanchez@example.com', 'contra123', 'Cliente', 26);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_pedidos_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_pedidos_completa` (
`Nombre_Usuario` varchar(50)
,`Correo_Usuario` varchar(100)
,`Fecha_Pedido` date
,`Estado_Pedido` enum('pendiente','procesado','enviado','entregado','cancelado')
,`Cantidad` int(11)
,`Producto_Nombre` varchar(100)
,`Producto_Descripcion` text
,`Producto_Precio` decimal(10,2)
,`Pago_Monto` decimal(10,2)
,`Metodo_Pago` enum('tarjeta','PayPal','transferencia')
,`Dirección_Envio` varchar(255)
,`Estado_Envio` enum('en preparación','enviado','entregado')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_stock_categoria`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_stock_categoria` (
`Nombre_Categoria` varchar(50)
,`Total_Productos` bigint(21)
,`Stock_Total` decimal(32,0)
,`Valor_Total_Stock` decimal(42,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `productos_mas_vendidos`
--
DROP TABLE IF EXISTS `productos_mas_vendidos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `productos_mas_vendidos`  AS SELECT `p`.`ID_Producto` AS `ID_Producto`, `p`.`Nombre` AS `Nombre`, `p`.`Descripcion` AS `Descripcion`, `p`.`Precio` AS `Precio`, `p`.`URL_Imagen` AS `URL_Imagen`, sum(`dp`.`Cantidad`) AS `Total_Vendido`, `c`.`Nombre_Categoria` AS `Nombre_Categoria` FROM (((`producto` `p` join `detalle_pedido` `dp` on(`p`.`ID_Producto` = `dp`.`ID_Producto`)) join `pedido` `ped` on(`dp`.`ID_Pedido` = `ped`.`ID_Pedido`)) join `categoria` `c` on(`p`.`ID_Categoria` = `c`.`ID_Categoria`)) WHERE `ped`.`Fecha_Pedido` between '2024-12-01' and '2024-12-15' AND `ped`.`Estado_Pedido` = 'procesado' GROUP BY `p`.`ID_Producto`, `p`.`Nombre`, `p`.`Descripcion`, `p`.`Precio`, `p`.`URL_Imagen`, `c`.`Nombre_Categoria` ORDER BY sum(`dp`.`Cantidad`) DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_pedidos_completa`
--
DROP TABLE IF EXISTS `vista_pedidos_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_pedidos_completa`  AS SELECT `u`.`Nombre` AS `Nombre_Usuario`, `u`.`Correo` AS `Correo_Usuario`, `p`.`Fecha_Pedido` AS `Fecha_Pedido`, `p`.`Estado_Pedido` AS `Estado_Pedido`, `dp`.`Cantidad` AS `Cantidad`, `pr`.`Nombre` AS `Producto_Nombre`, `pr`.`Descripcion` AS `Producto_Descripcion`, `pr`.`Precio` AS `Producto_Precio`, `pa`.`Monto` AS `Pago_Monto`, `pa`.`Metodo_Pago` AS `Metodo_Pago`, `e`.`Dirección_Envio` AS `Dirección_Envio`, `e`.`Estado_Envio` AS `Estado_Envio` FROM (((((`pedido` `p` join `usuario` `u` on(`p`.`ID_Usuario` = `u`.`ID_Usuario`)) join `detalle_pedido` `dp` on(`p`.`ID_Pedido` = `dp`.`ID_Pedido`)) join `producto` `pr` on(`dp`.`ID_Producto` = `pr`.`ID_Producto`)) join `pago` `pa` on(`p`.`ID_Pedido` = `pa`.`ID_Pedido`)) join `envio` `e` on(`p`.`ID_Pedido` = `e`.`ID_Pedido`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_stock_categoria`
--
DROP TABLE IF EXISTS `vista_stock_categoria`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_stock_categoria`  AS SELECT `c`.`Nombre_Categoria` AS `Nombre_Categoria`, count(`p`.`ID_Producto`) AS `Total_Productos`, sum(`p`.`Stock`) AS `Stock_Total`, sum(`p`.`Stock` * `p`.`Precio`) AS `Valor_Total_Stock` FROM (`categoria` `c` join `producto` `p` on(`c`.`ID_Categoria` = `p`.`ID_Categoria`)) GROUP BY `c`.`ID_Categoria`, `c`.`Nombre_Categoria` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`ID_Carrito`),
  ADD KEY `FK_Usuario_Carrito` (`ID_Usuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID_Categoria`);

--
-- Indices de la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD PRIMARY KEY (`ID_Carrito`,`ID_Producto`),
  ADD KEY `FK_Producto_DetalleCarrito` (`ID_Producto`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`ID_Pedido`,`ID_Producto`),
  ADD KEY `FK_Producto_DetallePedido` (`ID_Producto`),
  ADD KEY `idx_detalle_pedido_rango` (`ID_Pedido`);

--
-- Indices de la tabla `envio`
--
ALTER TABLE `envio`
  ADD PRIMARY KEY (`ID_Envio`),
  ADD KEY `FK_Pedido_Envio` (`ID_Pedido`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`ID_EstadoDirc`);

--
-- Indices de la tabla `municipio`
--
ALTER TABLE `municipio`
  ADD PRIMARY KEY (`ID_Municipio`),
  ADD KEY `FK_Estado_Municipio` (`ID_EstadoDirc`);

--
-- Indices de la tabla `notificaciones_stock`
--
ALTER TABLE `notificaciones_stock`
  ADD PRIMARY KEY (`ID_Notificacion`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`ID_Pago`),
  ADD KEY `FK_Pedido_Pago` (`ID_Pedido`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ID_Pedido`),
  ADD KEY `FK_Usuario_Pedido` (`ID_Usuario`),
  ADD KEY `idx_pedido_usuario` (`ID_Usuario`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Producto`),
  ADD KEY `FK_Categoria_Producto` (`ID_Categoria`),
  ADD KEY `idx_producto_categoria` (`ID_Categoria`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `FK_Municipio_Usuario` (`ID_Municipio`),
  ADD KEY `idx_usuario_correo` (`Correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `ID_Carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID_Categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `envio`
--
ALTER TABLE `envio`
  MODIFY `ID_Envio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `ID_EstadoDirc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `municipio`
--
ALTER TABLE `municipio`
  MODIFY `ID_Municipio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `notificaciones_stock`
--
ALTER TABLE `notificaciones_stock`
  MODIFY `ID_Notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `ID_Pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_Pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD CONSTRAINT `FK_Carrito_DetalleCarrito` FOREIGN KEY (`ID_Carrito`) REFERENCES `carrito` (`ID_Carrito`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Producto_DetalleCarrito` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `FK_Pedido_DetallePedido` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Producto_DetallePedido` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `envio`
--
ALTER TABLE `envio`
  ADD CONSTRAINT `FK_Pedido_Envio` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON DELETE CASCADE;

--
-- Filtros para la tabla `municipio`
--
ALTER TABLE `municipio`
  ADD CONSTRAINT `FK_Estado_Municipio` FOREIGN KEY (`ID_EstadoDirc`) REFERENCES `estado` (`ID_EstadoDirc`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FK_Pedido_Pago` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_Usuario_Pedido` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `FK_Categoria_Producto` FOREIGN KEY (`ID_Categoria`) REFERENCES `categoria` (`ID_Categoria`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_Municipio_Usuario` FOREIGN KEY (`ID_Municipio`) REFERENCES `municipio` (`ID_Municipio`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
