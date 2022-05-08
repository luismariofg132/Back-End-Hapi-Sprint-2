CREATE DATABASE vehiculos WITH  
OWNER = 'postgres' 
ENCODING = 'UTF8' ;

\c vehiculos

-- Creacion de secuencias
CREATE SEQUENCE id_marca_seq;
CREATE SEQUENCE id_linea_seq;

-- Creacion del tipo
CREATE TYPE activa_enum AS ENUM ('si', 'no');

CREATE TABLE marca(
    id_marca INT4 NOT NULL DEFAULT NEXTVAL('id_marca_seq'),
    marca_activa activa_enum,
    descripcion_marca VARCHAR(100) NOT NULL,
    nombre_marca VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_marca)
);

CREATE TABLE linea(
    id_linea INT4 NOT NULL DEFAULT NEXTVAL('id_linea_seq'),
    linea_activa activa_enum,
    descripcion_linea VARCHAR(100) NOT NULL,
    id_marca INT NOT NULL,
    nombre_linea VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_linea),
    CONSTRAINT fk_linea_marca
    FOREIGN KEY (id_marca) REFERENCES marca (id_marca)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE vehiculo(
    placa VARCHAR(6) NOT NULL,
    modelo INT4 NOT NULL,
    fv_seguro DATE NOT NULL,
    fv_tecnicomecanica DATE NOT NULL,
    id_linea INT NOT NULL,
    url_image VARCHAR(200) NOT NULL,
    CONSTRAINT pk_placa PRIMARY KEY (placa),
    CONSTRAINT fk_id_linea_vehiculo FOREIGN KEY (id_linea) REFERENCES linea(id_linea)
);

-- Insertar Valores Iniciales en marca

INSERT INTO marca (marca_activa, descripcion_marca, nombre_marca) VALUES ('si', 'Chevrolet', 'Chevrolet');
INSERT INTO marca (marca_activa, descripcion_marca, nombre_marca) VALUES ('si', 'Ford Motor Company', 'Ford');
INSERT INTO marca (marca_activa, descripcion_marca, nombre_marca) VALUES ('si', 'Honda Motor Co.', 'Honda');

-- Verificar que los datos fueron correctamente insertados

SELECT * FROM marca;

-- Insertar Valores Iniciales en linea

INSERT INTO linea (linea_activa, descripcion_linea, nombre_linea, id_marca) VALUES ('si', 'Es un automóvil de turismo del segmento B', 'Corsa', 1);
INSERT INTO linea (linea_activa, descripcion_linea, nombre_linea, id_marca) VALUES ('si', 'Láser, tiene dimensiones compactas', 'Laser', 2);
INSERT INTO linea (linea_activa, descripcion_linea, nombre_linea, id_marca) VALUES ('si', 'Es un automóvil del segmento C', 'Civic', 1);

-- Verificar que los datos fueron correctamente insertados

SELECT * FROM linea;

-- Insertar Valores Iniciales en vehiculo

INSERT INTO vehiculo (placa, modelo, fv_seguro, fv_tecnicomecanica, id_linea, url_image) VALUES ('ABC123', 2018, '2023-01-01', '2023-01-01', 1, 'https://www.carrosyclasicos.com/media/k2/items/cache/60468aa82473fd32700d48478784d483_XL.jpg');
INSERT INTO vehiculo (placa, modelo, fv_seguro, fv_tecnicomecanica, id_linea, url_image) VALUES ('ABC456', 2019, '2023-01-01', '2023-01-01', 2, 'https://www.c3carecarcenter.com/wp-content/uploads/2017/11/sincronizacion-ford-laser.jpg?quality=100.3015072922390');
INSERT INTO vehiculo (placa, modelo, fv_seguro, fv_tecnicomecanica, id_linea, url_image) VALUES ('ABC789', 2020, '2023-01-01', '2023-01-01', 3, 'https://upload.wikimedia.org/wikipedia/commons/e/e1/2022_Honda_Civic_LX%2C_Front_Right%2C_06-20-2021.jpg');

-- Verificar que los datos fueron correctamente insertados

SELECT * FROM vehiculo;