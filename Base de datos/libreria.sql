DROP DATABASE IF EXISTS libreria;
CREATE DATABASE libreria;
USE libreria;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS autor;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS detalleencargo;
DROP TABLE IF EXISTS detallenc;
DROP TABLE IF EXISTS detallenv;
DROP TABLE IF EXISTS detallena;
DROP TABLE IF EXISTS editorial;
DROP TABLE IF EXISTS encargo;
DROP TABLE IF EXISTS notaapartado;
DROP TABLE IF EXISTS notacompra;
DROP TABLE IF EXISTS notaventa;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS productoautor;
DROP TABLE IF EXISTS productoeditorial;
DROP TABLE IF EXISTS proveedor;
DROP TABLE IF EXISTS usuario;
SET FOREIGN_KEY_CHECKS=1;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-06-2023 a las 00:27:24
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `libreria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor`
--

CREATE TABLE `autor` (
  `id_autor` int(10) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autor`
--

INSERT INTO `autor` (`id_autor`, `nombre`) VALUES
(1, 'María Gripe'),
(2, 'Alfredo Gómez Cerdá');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cte` int(10) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Telefono` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cte`, `Nombre`, `Telefono`) VALUES
(1, 'Gerardo Femat Delgado', 4494122838);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleencargo`
--

CREATE TABLE `detalleencargo` (
  `cantidadProducto` int(10) NOT NULL,
  `impuestoProducto` float NOT NULL,
  `precioProducto` float NOT NULL,
  `productoISBN` varchar(18) NOT NULL,
  `encargoFolioEncargo` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallena`
--

CREATE TABLE `detallena` (
  `precioProducto` float NOT NULL,
  `cantidadProducto` int(11) NOT NULL,
  `impuestoProducto` float NOT NULL,
  `productoISBN` varchar(18) NOT NULL,
  `notaApartadoFolioNA` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallenc`
--

CREATE TABLE `detallenc` (
  `productoISBN` varchar(18) NOT NULL,
  `notaCompraFolioNC` int(10) NOT NULL,
  `precioProducto` float NOT NULL,
  `cantidadProducto` int(11) NOT NULL,
  `impuesto` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallenv`
--

CREATE TABLE `detallenv` (
  `precioProducto` float NOT NULL,
  `cantidadProducto` int(10) NOT NULL,
  `impuesto` float NOT NULL,
  `productoISBN` varchar(18) NOT NULL,
  `notaVentaFolioNV` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `editorial`
--

CREATE TABLE `editorial` (
  `id_editorial` int(10) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` bigint(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `editorial`
--

INSERT INTO `editorial` (`id_editorial`, `nombre`, `telefono`) VALUES
(1, 'Ediciones SM', 5510878484),
(2, 'Grupo Planeta', 34934928000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encargo`
--

CREATE TABLE `encargo` (
  `FolioEncargo` int(10) NOT NULL,
  `Abono` float NOT NULL,
  `clienteId_cte` int(10) NOT NULL,
  `estatus` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notaapartado`
--

CREATE TABLE `notaapartado` (
  `FolioNA` int(10) NOT NULL,
  `Abono` float NOT NULL,
  `Fecha` date NOT NULL,
  `clienteId_cte` int(11) NOT NULL,
  `estatus` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notacompra`
--

CREATE TABLE `notacompra` (
  `FolioNC` int(10) NOT NULL,
  `Fecha` date NOT NULL,
  `proveedorId_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notaventa`
--

CREATE TABLE `notaventa` (
  `fechaVenta` date NOT NULL,
  `folioNV` int(10) NOT NULL,
  `clienteId_cte` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ISBN` varchar(18) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` float NOT NULL,
  `existencias` int(11) NOT NULL,
  `impuesto` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ISBN`, `nombre`, `precio`, `existencias`, `impuesto`) VALUES
('978-970-785-446-8', 'La casa de verano', 120.99, 4, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productoautor`
--

CREATE TABLE `productoautor` (
  `autorIdAutor` int(10) NOT NULL,
  `productoISBN` varchar(18) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productoeditorial`
--

CREATE TABLE `productoeditorial` (
  `editorialIdEditorial` int(10) NOT NULL,
  `productoISBN` varchar(18) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(10) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` bigint(13) NOT NULL,
  `RFC` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `usuario` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `vendedor` tinyint(1) NOT NULL,
  `almacenista` tinyint(1) NOT NULL,
  `cajero` tinyint(1) NOT NULL,
  `enccompras` tinyint(1) NOT NULL,
  `administrador` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`usuario`, `nombre`, `contrasena`, `vendedor`, `almacenista`, `cajero`, `enccompras`, `administrador`) VALUES
('Admin', 'Administrador General', '123456789', 1, 1, 1, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autor`
--
ALTER TABLE `autor`
  ADD PRIMARY KEY (`id_autor`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cte`);

--
-- Indices de la tabla `detalleencargo`
--
ALTER TABLE `detalleencargo`
  ADD KEY `productoISBN` (`productoISBN`,`encargoFolioEncargo`),
  ADD KEY `encargoFolioEncargo` (`encargoFolioEncargo`);

--
-- Indices de la tabla `detallena`
--
ALTER TABLE `detallena`
  ADD KEY `productoISBN` (`productoISBN`,`notaApartadoFolioNA`),
  ADD KEY `notaApartadoFolioNA` (`notaApartadoFolioNA`);

--
-- Indices de la tabla `detallenc`
--
ALTER TABLE `detallenc`
  ADD KEY `productoISBN` (`productoISBN`,`notaCompraFolioNC`),
  ADD KEY `notaCompraFolioNC` (`notaCompraFolioNC`);

--
-- Indices de la tabla `detallenv`
--
ALTER TABLE `detallenv`
  ADD KEY `productoISBN` (`productoISBN`,`notaVentaFolioNV`),
  ADD KEY `notaVentaFolioNV` (`notaVentaFolioNV`);

--
-- Indices de la tabla `editorial`
--
ALTER TABLE `editorial`
  ADD PRIMARY KEY (`id_editorial`);

--
-- Indices de la tabla `encargo`
--
ALTER TABLE `encargo`
  ADD PRIMARY KEY (`FolioEncargo`),
  ADD KEY `clienteId_cte` (`clienteId_cte`);

--
-- Indices de la tabla `notaapartado`
--
ALTER TABLE `notaapartado`
  ADD PRIMARY KEY (`FolioNA`),
  ADD KEY `clienteId_cte` (`clienteId_cte`);

--
-- Indices de la tabla `notacompra`
--
ALTER TABLE `notacompra`
  ADD PRIMARY KEY (`FolioNC`),
  ADD KEY `proveedorId_proveedor` (`proveedorId_proveedor`);

--
-- Indices de la tabla `notaventa`
--
ALTER TABLE `notaventa`
  ADD PRIMARY KEY (`folioNV`),
  ADD KEY `clienteId_cte` (`clienteId_cte`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ISBN`);

--
-- Indices de la tabla `productoautor`
--
ALTER TABLE `productoautor`
  ADD KEY `autorIdAutor` (`autorIdAutor`,`productoISBN`),
  ADD KEY `productoISBN` (`productoISBN`);

--
-- Indices de la tabla `productoeditorial`
--
ALTER TABLE `productoeditorial`
  ADD KEY `editorialIdEditorial` (`editorialIdEditorial`,`productoISBN`),
  ADD KEY `productoISBN` (`productoISBN`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autor`
--
ALTER TABLE `autor`
  MODIFY `id_autor` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cte` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `editorial`
--
ALTER TABLE `editorial`
  MODIFY `id_editorial` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `encargo`
--
ALTER TABLE `encargo`
  MODIFY `FolioEncargo` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notaapartado`
--
ALTER TABLE `notaapartado`
  MODIFY `FolioNA` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notacompra`
--
ALTER TABLE `notacompra`
  MODIFY `FolioNC` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notaventa`
--
ALTER TABLE `notaventa`
  MODIFY `folioNV` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(10) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla 'producto'
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_existencias` CHECK (existencias >= 0);
--
-- Filtros para la tabla `detalleencargo`
--
ALTER TABLE `detalleencargo`
  ADD CONSTRAINT `detalleencargo_ibfk_1` FOREIGN KEY (`encargoFolioEncargo`) REFERENCES `encargo` (`FolioEncargo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `detalleencargo_ibfk_2` FOREIGN KEY (`productoISBN`) REFERENCES `producto` (`ISBN`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detallena`
--
ALTER TABLE `detallena`
  ADD CONSTRAINT `detallena_ibfk_1` FOREIGN KEY (`notaApartadoFolioNA`) REFERENCES `notaapartado` (`FolioNA`) ON UPDATE CASCADE,
  ADD CONSTRAINT `detallena_ibfk_2` FOREIGN KEY (`productoISBN`) REFERENCES `producto` (`ISBN`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detallenc`
--
ALTER TABLE `detallenc`
  ADD CONSTRAINT `detallenc_ibfk_1` FOREIGN KEY (`notaCompraFolioNC`) REFERENCES `notacompra` (`FolioNC`) ON UPDATE CASCADE,
  ADD CONSTRAINT `detallenc_ibfk_2` FOREIGN KEY (`productoISBN`) REFERENCES `producto` (`ISBN`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detallenv`
--
ALTER TABLE `detallenv`
  ADD CONSTRAINT `detallenv_ibfk_1` FOREIGN KEY (`notaVentaFolioNV`) REFERENCES `notaventa` (`folioNV`) ON UPDATE CASCADE,
  ADD CONSTRAINT `detallenv_ibfk_2` FOREIGN KEY (`productoISBN`) REFERENCES `producto` (`ISBN`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `encargo`
--
ALTER TABLE `encargo`
  ADD CONSTRAINT `encargo_ibfk_1` FOREIGN KEY (`clienteId_cte`) REFERENCES `cliente` (`id_cte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `encargo_rev_estatus` CHECK (estatus IN ('ei', 'ec', 'er', 'ee'));
--
-- Filtros para la tabla `notaapartado`
--
ALTER TABLE `notaapartado`
  ADD CONSTRAINT `notaapartado_ibfk_1` FOREIGN KEY (`clienteId_cte`) REFERENCES `cliente` (`id_cte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `apartado_rev_estatus` CHECK (estatus IN ('ai', 'ae'));
--
-- Filtros para la tabla `notacompra`
--
ALTER TABLE `notacompra`
  ADD CONSTRAINT `notacompra_ibfk_1` FOREIGN KEY (`proveedorId_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `notaventa`
--
ALTER TABLE `notaventa`
  ADD CONSTRAINT `notaventa_ibfk_1` FOREIGN KEY (`clienteId_cte`) REFERENCES `cliente` (`id_cte`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productoautor`
--
ALTER TABLE `productoautor`
  ADD CONSTRAINT `productoautor_ibfk_1` FOREIGN KEY (`autorIdAutor`) REFERENCES `autor` (`id_autor`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productoautor_ibfk_2` FOREIGN KEY (`productoISBN`) REFERENCES `producto` (`ISBN`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productoeditorial`
--
ALTER TABLE `productoeditorial`
  ADD CONSTRAINT `productoeditorial_ibfk_1` FOREIGN KEY (`productoISBN`) REFERENCES `producto` (`ISBN`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productoeditorial_ibfk_2` FOREIGN KEY (`editorialIdEditorial`) REFERENCES `editorial` (`id_editorial`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--
-- Triggers para la alta, actualización y baja de ventas
--
DELIMITER //
CREATE TRIGGER inserta_venta BEFORE INSERT ON detallenv
	FOR EACH ROW
	BEGIN
		UPDATE producto SET existencias=producto.existencias - new.cantidadProducto 
        WHERE producto.ISBN = NEW.productoISBN;
	END;
//

DELIMITER //
CREATE TRIGGER actualiza_venta BEFORE UPDATE ON detallenv
	FOR EACH ROW
	BEGIN
		UPDATE producto SET existencias=producto.existencias - new.cantidadProducto + old.cantidadProducto
        WHERE producto.ISBN = NEW.productoISBN;
	END;
//

DELIMITER //
CREATE TRIGGER elimina_venta BEFORE DELETE ON detallenv
	FOR EACH ROW
	BEGIN
		UPDATE producto SET existencias=producto.existencias + old.cantidadProducto
        WHERE producto.ISBN = old.productoISBN;
	END;
//

--
-- Triggers para la alta, actualización y baja de compras
--
DELIMITER //
CREATE TRIGGER inserta_compra BEFORE INSERT ON detallenc
	FOR EACH ROW
	BEGIN
		UPDATE producto SET existencias=producto.existencias + new.cantidadProducto 
        WHERE producto.ISBN = NEW.productoISBN;
	END;
//

DELIMITER //
CREATE TRIGGER actualiza_compra BEFORE UPDATE ON detallenc
	FOR EACH ROW
	BEGIN
		UPDATE producto SET existencias=producto.existencias + new.cantidadProducto - old.cantidadProducto
        WHERE producto.ISBN = NEW.productoISBN;
	END;
//

DELIMITER //
CREATE TRIGGER elimina_compra BEFORE DELETE ON detallenc
	FOR EACH ROW
	BEGIN
		UPDATE producto SET existencias=producto.existencias - old.cantidadProducto
        WHERE producto.ISBN = old.productoISBN;
	END;
//

--
-- Trigger que mueve una nota de apartado a nota de venta una vez el abono completa el pago
-- y su estado es entregado
--
DELIMITER //
CREATE TRIGGER post_delete_detallena
AFTER DELETE ON detallena
FOR EACH ROW
  BEGIN
    DECLARE v_estatus VARCHAR(2);
    SELECT  estatus
    INTO v_estatus
    FROM notaapartado
    WHERE notaapartado.FolioNA = old.notaApartadoFolioNA;
    if v_estatus = 'ae' then
      SIGNAL SQLSTATE '42003'
      SET MESSAGE_TEXT = 'Error: No se puede eliminar una nota de apartado entregada, elimine la nota de venta';
    else
      UPDATE producto SET existencias = existencias + old.cantidadProducto WHERE ISBN=old.productoISBN;
    end if;
  END;
//

DELIMITER //
CREATE TRIGGER prev_inserta_detallena
AFTER INSERT ON detallena
FOR EACH ROW
  BEGIN
    DECLARE v_total FLOAT;
    DECLARE v_abono FLOAT;
    DECLARE v_estatus VARCHAR(2);
    SELECT round(sum((precioProducto+impuestoProducto) * cantidadProducto), 2)
    INTO v_total
    FROM detallena
    WHERE new.notaApartadoFolioNA = detallena.notaApartadoFolioNA
    GROUP BY detallena.notaApartadoFolioNA;

    SELECT abono, estatus
    INTO v_abono, v_estatus
    FROM notaapartado
    WHERE notaapartado.FolioNA = new.notaApartadoFolioNA;
    IF v_estatus = 'ae' THEN
      SIGNAL SQLSTATE '42002'
      SET MESSAGE_TEXT = 'Error: No se puede entregar el producto al crear la nota de apartado';
    ELSEIF v_total < v_abono THEN
      SIGNAL SQLSTATE '42001'
      SET MESSAGE_TEXT = 'Error: El monto abonado es mayor al precio total';
    ELSE
      UPDATE producto SET existencias = existencias - new.cantidadProducto WHERE producto.ISBN = new.productoISBN;
    END IF;
  END;
//

DELIMITER //
CREATE TRIGGER prev_actualiza_apartado
BEFORE UPDATE ON notaapartado
FOR EACH ROW
  BEGIN
    DECLARE v_total FLOAT;
    SELECT round(sum((precioProducto+impuestoProducto) * cantidadProducto), 2)
    INTO v_total
    FROM detallena
    WHERE new.FolioNA = detallena.notaApartadoFolioNA
    GROUP BY detallena.notaApartadoFolioNA;
    IF v_total > new.abono AND new.estatus = 'ae' THEN
      SIGNAL SQLSTATE '42000'
      SET MESSAGE_TEXT = 'Error: No se puede entregar el producto sin que este completamente pagado';
    ELSEIF v_total < new.abono THEN
      SIGNAL SQLSTATE '42001'
      SET MESSAGE_TEXT = 'Error: El monto abonado es mayor al precio total';
    END IF;
  END;
//

DELIMITER //
CREATE TRIGGER actualiza_apartado 
AFTER UPDATE ON notaapartado
FOR EACH ROW
  BEGIN
    DECLARE Idnv VARCHAR(18);
    DECLARE v_total FLOAT;
    DECLARE v_cant_prod INT(11);
    DECLARE v_prod_ISBN VARCHAR(18);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cursor_detalles CURSOR FOR
    SELECT cantidadProducto, productoISBN
    FROM detallena
    WHERE new.FolioNA = detallena.notaApartadoFolioNA;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Obtener el total del costo, para compararlo con el abono
    SELECT round(sum((precioProducto+impuestoProducto) * cantidadProducto), 2)
    INTO v_total
    FROM detallena
    WHERE new.FolioNA = detallena.notaApartadoFolioNA
    GROUP BY detallena.notaApartadoFolioNA;

    -- Compara que el costo sea menor o igual al abono total, por si hay problemas de redondeo con JS
    IF v_total = new.abono AND new.estatus = 'ae' THEN
      -- Obtener folioNV
      INSERT INTO notaventa(fechaVenta, clienteId_cte)
      VALUES (CURRENT_DATE(), NEW.clienteId_cte);
      SELECT LAST_INSERT_ID() INTO Idnv;
      -- Se regresan la cantidad a existencias para que al insertarlo en los detalles
      -- de venta, se vuelvan a quitar
      OPEN cursor_detalles;
      recorrer: LOOP
        FETCH cursor_detalles INTO v_cant_prod, v_prod_ISBN;
        IF done THEN
          LEAVE recorrer;
        END IF;
        UPDATE producto 
        SET existencias = existencias + v_cant_prod 
        WHERE ISBN = v_prod_ISBN COLLATE utf8mb4_general_ci;
      END LOOP recorrer;
      CLOSE cursor_detalles;
      -- Se traspasan todos los detalles de la nota de apartado a una nota de venta
      INSERT INTO detallenv(precioProducto, cantidadProducto, impuesto, productoISBN, notaVentaFolioNV)
      SELECT precioProducto, cantidadProducto, impuestoProducto, productoISBN, Idnv
      FROM detallena
      WHERE NEW.FolioNA = detallena.notaApartadoFolioNA;
	  END IF;
  END;
//

--
-- Trigger que mueve un encargo a nota de venta una vez el abono completa el pago
-- y su estado es entregado
--
DELIMITER //
CREATE TRIGGER post_delete_detalleencargo
AFTER DELETE ON detalleencargo
FOR EACH ROW
  BEGIN
    DECLARE v_estatus VARCHAR(2);
    SELECT  estatus
    INTO v_estatus
    FROM encargo
    WHERE encargo.FolioEncargo = old.encargoFolioEncargo;
    if v_estatus = 'ee' then
      SIGNAL SQLSTATE '42003'
      SET MESSAGE_TEXT = 'Error: No se puede eliminar un encargo entregado, elimine la nota de venta';
    end if;
  END;
//

DELIMITER //
CREATE TRIGGER prev_inserta_detalleencargo
AFTER INSERT ON detalleencargo
FOR EACH ROW
  BEGIN
    DECLARE v_total FLOAT;
    DECLARE v_abono FLOAT;
    DECLARE v_estatus VARCHAR(2);
    SELECT round(sum((precioProducto+impuestoProducto) * cantidadProducto), 2)
    INTO v_total
    FROM detalleencargo
    WHERE new.encargoFolioEncargo = detalleencargo.encargoFolioEncargo
    GROUP BY detalleencargo.encargoFolioEncargo;

    SELECT abono, estatus
    INTO v_abono, v_estatus
    FROM encargo
    WHERE encargo.FolioEncargo = new.encargoFolioEncargo;
    IF v_estatus = 'ee' THEN
      SIGNAL SQLSTATE '42000'
      SET MESSAGE_TEXT = 'Error: No se puede entregar el producto al crear el encargo';
    ELSEIF v_total < v_abono THEN
      SIGNAL SQLSTATE '42001'
      SET MESSAGE_TEXT = 'Error: El monto abonado es mayor al precio total';
    END IF;
  END;
//

DELIMITER //
CREATE TRIGGER prev_actualiza_encargo
BEFORE UPDATE ON encargo
FOR EACH ROW
  BEGIN
    DECLARE v_total FLOAT;
    SELECT round(sum((precioProducto+impuestoProducto) * cantidadProducto), 2)
    INTO v_total
    FROM detalleencargo
    WHERE new.FolioEncargo = detalleencargo.encargoFolioEncargo
    GROUP BY detalleencargo.encargoFolioEncargo;
    IF v_total > new.abono AND new.estatus = 'ee' THEN
      SIGNAL SQLSTATE '42000'
      SET MESSAGE_TEXT = 'Error: No se puede entregar el producto sin que este completamente pagado';
    ELSEIF v_total < new.abono THEN
      SIGNAL SQLSTATE '42001'
      SET MESSAGE_TEXT = 'Error: El monto abonado es mayor al precio total';
    END IF;
  END;
//

DELIMITER //
CREATE TRIGGER actualiza_encargo
AFTER UPDATE ON encargo
FOR EACH ROW
  BEGIN
    DECLARE Idnv VARCHAR(18);
    DECLARE v_total FLOAT;

    -- Obtener el total del costo, para compararlo con el abono
    SELECT round(sum((precioProducto+impuestoProducto) * cantidadProducto), 2)
    INTO v_total
    FROM detalleencargo
    WHERE new.FolioEncargo = detalleencargo.encargoFolioEncargo
    GROUP BY detalleencargo.encargoFolioEncargo;

    -- Compara que el costo sea menor o igual al abono total, por si hay problemas de redondeo con JS
    IF v_total = new.abono AND new.estatus = 'ee' THEN
      -- Obtener folioNV
      INSERT INTO notaventa(fechaVenta, clienteId_cte)
      VALUES (CURRENT_DATE(), NEW.clienteId_cte);
      SELECT LAST_INSERT_ID() INTO Idnv;
      -- Se traspasan todos los detalles del encargo a una nota de venta
      INSERT INTO detallenv(precioProducto, cantidadProducto, impuesto, productoISBN, notaVentaFolioNV)
      SELECT precioProducto, cantidadProducto, impuestoProducto, productoISBN, Idnv
      FROM detalleencargo
      WHERE NEW.FolioEncargo = detalleencargo.encargoFolioEncargo;
	  END IF;
  END;
//