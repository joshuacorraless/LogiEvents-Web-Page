CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    tipo_usuario ENUM('administrador','usuario') NOT NULL,
    rol_organizacion VARCHAR(50),
    id_empleado VARCHAR(6)
);

CREATE TABLE Evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_evento VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    categoria VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255),
    estado ENUM('Agotado','Activo','Proximamente') NOT NULL
);

CREATE TABLE Reservacion (
    id_reservacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL,
    fecha_reservacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_evento) REFERENCES Evento(id_evento)
);


CREATE TABLE ChatBot (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    categoria VARCHAR(50) -- opcional, si se quiere clasificar por temas
);


INSERT INTO Usuario (nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario, rol_organizacion, id_empleado) VALUES
('Joshua Corrales Retana', '2024073529', 'corralesjosh39@gmail.com', '84311955', 'joshuacorraless', 'charlie', 'administrador', 'Administrador Rey', '202407');
