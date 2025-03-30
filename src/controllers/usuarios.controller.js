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
        return res.status(400).json( {message : 'Tipo de usuario inválido. Debe ser "administrador" o "usuario".'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios'});
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
            return res.status(400).json({ message: 'La cédula debe contener 9 dígitos.'});
        }

        // *Validar ID de empleado (solo si es administrador)
        if (tipo_usuario === 'administrador' && !id_empleado.match(empleadoRegex)) {
            return res.status(400).json({ message: 'El ID de empleado debe ser una combinación de 2 letras y 4 números.'});
        }

        // *Validar correo electrónico
        if (!correo.match(correoRegex)) {
            return res.status(400).json({ message :'El correo electrónico no tiene un formato válido.'});
        }

        //* Validar teléfono
        if (!telefono.match(telefonoRegex)) {
            return res.status(400).json({ message: 'El número de teléfono debe tener 8 dígitos.'});
        }

        // *Validar contraseña
        if (!password.match(passwordRegex)) {
            return res.status(400).json({message: 'La contraseña debe tener 4 letras seguidas de 4 números.'});
        }

        // *Si es administrador, insertamos con rol y id_empleado
        if (tipo_usuario === 'administrador') {
            const [rows] = await pool.query(
                'INSERT INTO Usuario (nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario, rol_organizacion, id_empleado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario, rol_organizacion, id_empleado]
            );
            return res.status(201).json({ message: 'Administrador registrado correctamente', rows });
        }

        // *Si es usuario común, insertamos sin rol_organizacion ni id_empleado
        const [rows] = await pool.query(
            'INSERT INTO Usuario (nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [nombre_completo, identificacion, correo, telefono, username, password, tipo_usuario]
        );
        
        res.status(201).json({ message: 'Usuario registrado correctamente', rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario'});
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
            return res.status(400).json({message: 'Debes proporcionar al menos el correo electrónico o el teléfono para actualizar.'});
        }

        // Validar el correo electrónico si está presente
        if (correo && !correo.match(correoRegex)) {
            return res.status(400).json({ message: 'El correo electrónico no tiene un formato válido.'});
        }

        // Validar el teléfono si está presente
        if (telefono && !telefono.match(telefonoRegex)) {
            return res.status(400).json({message: 'El número de teléfono debe tener 8 dígitos.'});
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
            return res.status(404).json({message: 'Usuario no encontrado.'});
        }

        // Responder con éxito
        res.status(200).json({message: 'Datos de usuario actualizados correctamente.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error al actualizar el usuario'});
    }
};


//* no se usa
export const deleteUsuarios = (req, res) => res.send('eliminando usuarios');




//!Daniela type shi

/**
 ** FUNCION 1: Login
 * *Ruta: POST /api/Login
 * *Data recibida: { username, password }
 * *Función:
 * * - Busca el usuario por username.
 * *- Si no existe o la contraseña no coincide, retorna error.
 * * - Si coincide, retorna el id y el tipo de usuario.
 */
export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ error: "Username y password son requeridos." });
      }
  
      //* Busca el usuario por username
      const [rows] = await pool.query("SELECT * FROM Usuario WHERE username = ?", [username]);
      if (rows.length === 0) {
        return res.status(401).json({ error: "El usuario y la contraseña no coinciden." });
      }
  
      const user = rows[0];
      //* Aquí se compara directamente; en producción usa hash y bcrypt.compare
      if (user.password !== password) {
        return res.status(401).json({ error: "El usuario y la contraseña no coinciden." });
      }
  
      // *Retorna id y tipo de usuario (ajusta los nombres de columnas según tu BD)
      return res.json({ id: user.id_usuario, tipo: user.tipo_usuario });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ error: "Error en el servidor." });
    }
  };
  
  /**
   ** FUNCION 2: Validar datos de Usuario
   ** Ruta: POST /api/Usuario/ValidateData
   * *Data recibida: { username, correo }
   ** Función:
   * * - Verifica si ya existe un usuario con el mismo username.
   * * - Verifica si ya existe un usuario con el mismo correo.
   *  *- Retorna error en caso de que alguno ya exista.
   *  *- Si no existen, indica que los datos se pueden usar.
   */
  export const validateUserData = async (req, res) => {
    try {
      const { username, correo } = req.body;
  
      if (!username || !correo) {
        return res.status(400).json({ error: "Username y correo son requeridos." });
      }
  
      // *Verifica si ya existe un usuario con ese username
      const [userRows] = await pool.query("SELECT * FROM Usuario WHERE username = ?", [username]);
      if (userRows.length > 0) {
        return res.status(400).json({ error: "El usuario ya existe." });
      }
  
      //* Verifica si ya existe un usuario con ese correo
      const [emailRows] = await pool.query("SELECT * FROM Usuario WHERE correo = ?", [correo]);
      if (emailRows.length > 0) {
        return res.status(400).json({ error: "El correo ya existe." });
      }
  
      return res.json({ message: "Los datos se pueden usar." });
    } catch (error) {
      console.error("Error en validateUserData:", error);
      return res.status(500).json({ error: "Error en el servidor." });
    }
  };


  
/**
 * *FUNCTION 1: Top5
 * *Ruta: GET /api/Top5
 * 
 * *Función:
 * *  - Cuenta las reservaciones de los eventos y retorna los 5 eventos con más reservaciones.
 ** Retorna:
 * *  Caso 1: Array de objetos con { id_evento, nombre_evento, totalReservaciones }
 * *  Caso 2: Si no hay reservaciones, retorna un mensaje "No hay bro".
 */
export const getTop5Events = async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.id_evento, e.nombre_evento, COUNT(*) AS totalReservaciones
        FROM Reservacion r
        JOIN Evento e ON r.id_evento = e.id_evento
        GROUP BY r.id_evento, e.nombre_evento
        ORDER BY totalReservaciones DESC
        LIMIT 5
      `);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "No hay bro" });
      }
  
      return res.json(rows);
    } catch (error) {
      console.error("Error en getTop5Events:", error);
      return res.status(500).json({ message: "Error en el servidor", error });
    }
  };
  
  /**
   **FUNCTION 2: DistribucionEvento
   * *Ruta: GET /api/DistribucionEvento
   * 
   * *Función:
   * *  - Cuenta los eventos por estado (Activos, Agotados, Próximos)
   * *Retorna:
   *  * Caso 1: Array de objetos con { estado, cantidad }
   * *  Caso 2: Si no hay eventos, retorna "No hay bro".
   */
  export const getEventDistribution = async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT estado, COUNT(*) AS cantidad
        FROM Evento
        GROUP BY estado
      `);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "No hay" });
      }
  
      return res.json(rows);
    } catch (error) {
      console.error("Error en getEventDistribution:", error);
      return res.status(500).json({ message: "Error en el servidor", error });
    }
  };