import { pool } from '../db.js';


//?Todo lo relacionado a los usuarios (administradores y clientes):

// *Función para obtener usuarios validando si se desea filtrar por tipo de usuario (administrador o usuario)
export const getUsuarios = async (req, res) => {
    try {
        // *Verificamos si hay un tipo de usuario especificado en los parámetros de la consulta (si se desea filtrar)
        const tipo_usuario = req.query.tipo_usuario;

        // *Si no se especifica ningún tipo de usuario, obtenemos todos los usuarios
        if (!tipo_usuario) {
            const [rows] = await pool.query('SELECT * FROM Usuario');
            return res.status(200).json(rows);  // *Devolvemos todos los usuarios
        }

        // *Si se especifica un tipo de usuario (administrador o usuario), se filtra por tipo
        if (tipo_usuario === 'administrador' || tipo_usuario === 'usuario') {
            const [rows] = await pool.query('SELECT * FROM Usuario WHERE tipo_usuario = ?', [tipo_usuario]);
            return res.status(200).json(rows);  // *Devolvemos los usuarios filtrados
        }

        //* Si el tipo de usuario no es válido, respondemos con un error
        return res.status(400).send('Tipo de usuario inválido. Debe ser "administrador" o "usuario".');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};


//* Función para crear usuarios tipo administradores o clientes con validaciones
export const createUsuarios = async (req, res) => {
    const { 
        nombre_completo, 
        identificacion, 
        correo, 
        telefono, 
        username, 
        password, 
        tipo_usuario, // *'administrador' o 'usuario'
        rol_organizacion, 
        id_empleado
    } = req.body;

    try {
        // *Validaciones por expresiones regulares

        const identificacionRegex = /^[0-9]{9}$/; // *9 dígitos
        const empleadoRegex = /^[A-Za-z]{2}[0-9]{4}$/; // *2 letras + 4 números
        const telefonoRegex = /^[0-9]{8}$/; // *8 dígitos
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // *Correo electrónico básico
        const passwordRegex = /^[A-Za-z]{4}[0-9]{4}$/; //* 4 letras + 4 números

        // *Validar cédula
        if (!identificacion.match(identificacionRegex)) {
            return res.status(400).send('La cédula debe contener 9 dígitos.');
        }

        // *Validar ID de empleado (solo si es administrador)
        if (tipo_usuario === 'administrador' && !id_empleado.match(empleadoRegex)) {
            return res.status(400).send('El ID de empleado debe ser una combinación de 2 letras y 4 números.');
        }

        // *Validar correo electrónico
        if (!correo.match(correoRegex)) {
            return res.status(400).send('El correo electrónico no tiene un formato válido.');
        }

        //* Validar teléfono
        if (!telefono.match(telefonoRegex)) {
            return res.status(400).send('El número de teléfono debe tener 8 dígitos.');
        }

        // *Validar contraseña
        if (!password.match(passwordRegex)) {
            return res.status(400).send('La contraseña debe tener 4 letras seguidas de 4 números.');
        }

        // *Si es administrador, insertamos con rol y id_empleado
        if (tipo_usuario === 'administrador') {
            const [rows] = await pool.query(
                'INSERT INTO Usuario (nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario, rol_organizacion, id_empleado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario, rol_organizacion, id_empleado]
            );
            return res.status(201).send({ message: 'Administrador registrado correctamente', rows });
        }

        // *Si es usuario común, insertamos sin rol_organizacion ni id_empleado
        const [rows] = await pool.query(
            'INSERT INTO Usuario (nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario]
        );
        
        res.status(201).send({ message: 'Usuario registrado correctamente', rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
};


//* Función para actualizar los datos de un usuario

export const updateUsuarios = async (req, res) => {
    const { id_usuario } = req.params; // ID del usuario que se va a actualizar
    const { correo, telefono } = req.body; // Nuevos valores de correo y teléfono

    try {
        // Validaciones
        const telefonoRegex = /^[0-9]{8}$/; // Asegura que el teléfono tenga 8 dígitos
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida el formato del correo

        // Si no se proporciona ningún campo para actualizar
        if (!correo && !telefono) {
            return res.status(400).send('Debes proporcionar al menos el correo electrónico o el teléfono para actualizar.');
        }

        // Validar el correo electrónico si está presente
        if (correo && !correo.match(correoRegex)) {
            return res.status(400).send('El correo electrónico no tiene un formato válido.');
        }

        // Validar el teléfono si está presente
        if (telefono && !telefono.match(telefonoRegex)) {
            return res.status(400).send('El número de teléfono debe tener 8 dígitos.');
        }

        // Construir la consulta dinámica para actualizar los datos
        let updateQuery = 'UPDATE Usuario SET ';
        let values = [];

        if (correo) {
            updateQuery += 'correo = ?, ';
            values.push(correo);
        }
        if (telefono) {
            updateQuery += 'telefono = ?, ';
            values.push(telefono);
        }

        // Eliminar la última coma y espacio
        updateQuery = updateQuery.slice(0, -2);

        // Agregar la condición para identificar al usuario a actualizar
        updateQuery += ' WHERE id_usuario = ?';
        values.push(id_usuario); // ID del usuario a actualizar

        // Ejecutar la consulta
        const [result] = await pool.query(updateQuery, values);

        // Si no se ha encontrado el usuario
        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // Responder con éxito
        res.status(200).send('Datos de usuario actualizados correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el usuario');
    }
};



export const deleteUsuarios = (req, res) => res.send('eliminando usuarios');
