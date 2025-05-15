create database remoteorder;
use remoteorder;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasenya TEXT NOT NULL  -- Asumiendo que será un hash
);

-- Tabla de empresas
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    sector VARCHAR(100),
    numero_empleados INTEGER,
    descripcion TEXT,
    telefono VARCHAR(15), 
    email VARCHAR(100),
    sitio_web VARCHAR(100),
    ciudad varchar(100),
    pais varchar(100),
    estado VARCHAR(20) ,
    ruta_logo VARCHAR(255),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion_categoria varchar (255),
    color_categoria VARCHAR (50),
    id_empresa INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    fecha_creacion DATE DEFAULT CURRENT_DATE
);

-- Tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo_seguimiento BIGINT NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_categoria INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    ruta_imagen VARCHAR(100),
    precio NUMERIC(10,2) NOT NULL,
    iva NUMERIC(5,2) CHECK (iva >= 0 AND iva <= 100),
    id_empresa INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    eliminado BOOLEAN default false
);


