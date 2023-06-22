CREATE DATABASE petshop;

USE petshop;

-- CREANDO USER TABLE
CREATE TABLE users (
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(200) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email varchar(50) NOT NULL,
    estado varchar(15) NOT NULL DEFAULT 'Activo',
    rol varchar(15) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
-- TERMINAMOS USER TABLE

-- CREANDO PRODUCTOS TABLE
CREATE TABLE productos (
    id INT(11) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    cantidad INT(10) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    inicio varchar(5) DEFAULT NULL,
    image varchar(100) DEFAULT NULL
);

ALTER TABLE productos
    ADD PRIMARY KEY (id);

ALTER TABLE productos
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
-- TERMINAMOS PRODUCTOS TABLE

-- CREANDO CARRITO TABLE
CREATE TABLE carrito (
    id INT(11) NOT NULL,
    id_usuario INT(11) NOT NULL,
    id_producto INT(11) NOT NULL,
    cantidad INT(10) NOT NULL,
    CONSTRAINT fk_usercarrito FOREIGN KEY (id_usuario) REFERENCES users(id),
    CONSTRAINT fk_productocarrito FOREIGN KEY (id_producto) REFERENCES productos(id)
);

ALTER TABLE carrito
    ADD PRIMARY KEY (id);

ALTER TABLE carrito
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
-- TERMINAMOS CARRITO TABLE

-- CREANDO PEDIDOS TABLE
CREATE TABLE pedidos (
    id INT(11) NOT NULL,
    id_usuario INT(11),
    costo DECIMAL(11,2) NOT NULL,
    met_pago VARCHAR(20) NOT NULL,
    pago VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    entrega VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    CONSTRAINT fk_userpedido FOREIGN KEY (id_usuario) REFERENCES users(id)
);

ALTER TABLE pedidos
    ADD PRIMARY KEY (id);

ALTER TABLE pedidos
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
-- TERMINAMOS CARRITO TABLE

-- CREANDO DETALLES TABLE
CREATE TABLE detalles (
    id INT(11) NOT NULL,
    id_pedido INT(11),
    id_producto INT(11),
    precio DECIMAL(11,2) NOT NULL,
    cantidad INT(10) NOT NULL,
    CONSTRAINT fk_pedidosdetalles FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    CONSTRAINT fk_productodetalles FOREIGN KEY (id_producto) REFERENCES productos(id)
);

ALTER TABLE detalles
    ADD PRIMARY KEY (id);

ALTER TABLE detalles
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
-- TERMINAMOS DETALLES TABLE

