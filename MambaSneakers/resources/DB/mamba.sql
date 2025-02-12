-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2023 at 10:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mamba`
--

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `ID_Pto` int(11) NOT NULL,
  `Nombre_Pto` varchar(50) NOT NULL,
  `Categoria` varchar(100) NOT NULL,
  `Descripcion` varchar(200) NOT NULL,
  `Existencia` int(11) NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Imagen` varchar(50) NOT NULL,
  `Descuento` decimal(10,2) NOT NULL,
  `imagenA` varchar(120) NOT NULL,
  `imagenB` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`ID_Pto`, `Nombre_Pto`, `Categoria`, `Descripcion`, `Existencia`, `Precio`, `Imagen`, `Descuento`, `imagenA`, `imagenB`) VALUES
(1, 'AMIRI tenis MA-1', 'Hombre', 'Blanco/negro, piel de becerro, diseño a paneles, placa del logo, logo en relieve en el lateral', 15, 18120.00, 'item1.png', 0.00, '', ''),
(2, 'Converse tenis Chuck 70 Hi', 'Hombre', 'Tenis Chuck 70 Hi de color rojo de Converse.\nComposición\nSuela: Goma 100%\nExterior: Lona 100%\n', 10, 14460.00, 'item2.png', 1000.00, '', ''),
(3, 'Dolce & Gabbana tenis Portofino', 'Hombre', 'Piel de becerro, parche del logo a un lado, logo en relieve en la parte posterior, puntera redonda', 20, 13890.00, 'item3.png', 2300.00, '', ''),
(4, 'Adidas Forum Low x Bad Bunny', 'Hombre', 'Azul, gamuza, cuero, detalle característico de 3 franjas, puntera redonda, cierre con agujetas', 5, 8876.00, 'item4.png', 0.00, '', ''),
(5, 'Jordan Air Jordan 1 Mid French Blue', 'Hombre', 'Blanco, azul claro, piel de becerro, cierre con agujetas en la parte delantera, plantilla con logo', 9, 5889.00, 'item5.png', 1200.00, '', ''),
(6, 'Nike\r\ntenis SB Dunk Low Jarritos', 'Hombre', 'Beige, verde, blanco, piel de becerro, lona, cierre con agujetas en la parte delantera', 3, 12772.00, 'item6.png', 0.00, '', ''),
(7, 'Jordan Air Jordan 1 Low OG SP X Travis Scott', 'Hombre', 'Tenis Air Jordan 1 Low OG SP de Jordan x Travis Scott en cuero de color negro, blanco, beige y azul', 30, 38192.00, 'item7.png', 0.00, '', ''),
(8, 'Adidas Yeezy Boost 700 Wave Runner', 'Hombre', 'multicolor, cuero y gamuza, agujetas en la parte delantera, suela gruesa , detalles color naranja', 10, 10564.00, 'item8.png', 0.00, '', ''),
(9, 'Dolce & Gabbana tenis bajos', 'Mujer', 'Rosa claro, piel de becerro, diseño a paneles, parche del logo en la lengüeta, cierre con agujetas', 24, 14640.00, 'item9.png', 3000.00, '', ''),
(10, 'Jordan Air Jordan 1 Mid SE \"Sesame\"', 'Mujer', 'Tenis Air Jordan 1 Mid SE \"Sesame\" en cuero de color blanco, naranja y beige de Jordan con logo Air ', 0, 3811.00, 'item10.png', 0.00, '', ''),
(11, 'Adidas Yeezy Boost 350 V2 triple White', 'Mujer', 'Blanco, puntera redonda, cierre con agujetas en la parte delantera', 18, 9370.00, 'item11.png', 0.00, '', ''),
(12, 'Nike Air Force 1 x Olivia Kim W', 'Mujer', 'Tenis Air Force 1 07 de Nike x Olivia Kim W en cuero de color blanco de Nike con logo Nike', 3, 93387.00, 'item12.png', 0.00, '', ''),
(13, 'Alexander McQueen bajos Oversized', 'Mujer', 'Puntera redonda, cierre con agujetas en la parte delantera, detalle de perforaciones', 16, 22212.00, 'item13.png', 0.00, '', ''),
(14, 'Valentino Garavani One Stud XL', 'Mujer', 'Tenis One Stud XL de color rosa PP de Valentino Garavani con cuero, detalles Rockstud', 9, 21950.00, 'item14.png', 5400.00, '', ''),
(15, 'Philipp Plein bajos hexagonal', 'Mujer', 'Blanco/negro, plateado, cuero, logo en relieve en el lateral, placa del logo en la lengüeta', 12, 79314.00, 'item15.png', 0.00, '', ''),
(16, 'Prada bajos Double Wheel', 'Mujer', 'Negro, poliéster reciclado, triángulo del logo esmaltado, puntera redonda, cierre con agujetas', 23, 25100.00, 'item16.png', 2399.00, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Correo_Usr` varchar(50) NOT NULL,
  `Password_Usr` varchar(150) NOT NULL,
  `PregSeguridad` varchar(120) NOT NULL,
  `Nombre_Usr` varchar(50) NOT NULL,
  `RespuestaPregSeg` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`ID`, `Usuario`, `Correo_Usr`, `Password_Usr`, `PregSeguridad`, `Nombre_Usr`, `RespuestaPregSeg`) VALUES
(1, 'rob13', 'robertfillingham@hotmail.com', '$2y$10$O74fiZdda5kU3QCK40NS8u7tNy9BFECyD.809RPk60V3YNHXKiDTq', '¿Cual es tu mascota favorita?', 'Robert', 'Perro'),
(2, 'admin', 'mamba_sneakers@outlook.com', '$2y$10$RE3h20IgZx5FTFfGXheCSuHK5EaAR5I05bL7/bLkkO1mQGx/8EqX2', '¿Cual es tu mascota favorita?', 'admin', 'perro');

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE `venta` (
  `ID_Cte` int(11) NOT NULL,
  `Id_Prod` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Cart` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Pto`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PregSeguridad` (`PregSeguridad`);

--
-- Indexes for table `venta`
--
ALTER TABLE `venta`
  ADD KEY `ID_Cte` (`ID_Cte`),
  ADD KEY `Id_Prod` (`Id_Prod`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Pto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`ID_Cte`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`Id_Prod`) REFERENCES `producto` (`ID_Pto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
