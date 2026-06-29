CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    biografia TEXT
);

CREATE TABLE publicaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    likes INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_publicaciones_usuarios
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);