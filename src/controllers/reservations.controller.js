import { pool } from "../db.js";
import twilio from 'twilio';
import nodemailer from 'nodemailer';


let reservationsFlow = {}; // Almacén temporal de reservas en proceso

// Configuración de Twilio (para enviar SMS)
const twilioClient = twilio('AC4670cf651877445e181e3b1a2cf8e79a', '23a55e16eebc589971d5f7e5c4fd8fda');


// Config nodemailer (correo remitente)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'logieventsreal@gmail.com',
    pass: 'vobc cusb slyf edua' // O la contraseña de aplicación
  }
});

/**
 * Genera un ID temporal para la reserva
 */
function generateTempId() {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Genera una palabra aleatoria que se enviará por SMS (6 caracteres)
 */
function generateRandomWord() {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * 1) startReservation
 *    - Verifica que el evento esté "Activo" y tenga cupos suficientes
 *    - Genera una palabra aleatoria, la envía por SMS usando Twilio
 *    - Guarda los datos en reservationsFlow y retorna un tempReservationId
 */
export const startReservation = async (req, res) => {
  try {
    const {
      id_usuario,
      id_evento,
      nombre_completo,
      correo,
      telefono,
      cantidad
    } = req.body;

    // 1. Verificar que el evento exista y esté "Activo"
    const [rows] = await pool.query('SELECT * FROM Evento WHERE id_evento = ?', [id_evento]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    const event = rows[0];

    if (event.estado !== 'Activo') {
      return res.status(400).json({ message: 'Solo se puede reservar en eventos Activos' });
    }

    // 2. Validar que haya cupos suficientes
    if (event.capacidad < cantidad) {
      return res.status(400).json({
        message: `No hay suficientes espacios. El evento solo tiene ${event.capacidad} disponibles.`
      });
    }

    // 3. Generar la palabra y un ID temporal
    const smsWord = generateRandomWord();
    const tempReservationId = generateTempId();

    // 4. Guardar la información de la reserva en memoria
    reservationsFlow[tempReservationId] = {
      id_usuario,
      id_evento,
      nombre_completo,
      correo,
      telefono,
      cantidad,
      smsWord
    };

    // 5. Preparar el número en formato internacional
    // Si el usuario no incluye el signo '+' se lo agregamos; si ya está, se usa tal cual.
    let phoneNumber = telefono;
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+${phoneNumber}`;
    }

    // 6. Preparar el mensaje de SMS
    const messageText = `La palabra para confirmar tu reserva en "${event.nombre_evento}" es: ${smsWord}`;

    // 7. Enviar SMS usando Twilio
    const twilioResponse = await twilioClient.messages.create({
      body: messageText,
      from:'+13435013067',
      to: phoneNumber
    });
    console.log('Twilio response:', twilioResponse);

    // 8. Responder con el tempReservationId para que se use en la verificación
    return res.json({
      message: 'Se envió la palabra al celular. Use /api/reservations/verify para confirmarla.',
      tempReservationId
    });
  } catch (error) {
    console.error('Error en startReservation:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Error al iniciar la reserva', error });
  }
};

/**
 * 2) verifyReservation
 *    - Recibe tempReservationId y la palabra (SMS) ingresada por el usuario
 *    - Si coincide, inserta la reserva en la tabla Reservacion, actualiza la capacidad del evento y envía un correo de confirmación
 */
export const verifyReservation = async (req, res) => {
  try {
    const { tempReservationId, word } = req.body;

    // 1. Verificar que exista el flujo para ese tempReservationId
    const flow = reservationsFlow[tempReservationId];
    if (!flow) {
      return res.status(400).json({ message: 'No se ha iniciado una reserva con ese ID' });
    }

    // 2. Comparar la palabra ingresada con la generada
    if (flow.smsWord !== word) {
      return res.status(400).json({ message: 'La palabra ingresada no coincide' });
    }

    // 3. Insertar la reserva en la tabla Reservacion
    const sql = `
      INSERT INTO Reservacion 
      (id_usuario, id_evento, nombre_completo, correo, telefono, cantidad)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      flow.id_usuario,
      flow.id_evento,
      flow.nombre_completo,
      flow.correo,
      flow.telefono,
      flow.cantidad
    ]);

    // 4. Actualizar la capacidad del evento restando la cantidad reservada
    await pool.query(
      'UPDATE Evento SET capacidad = capacidad - ? WHERE id_evento = ?',
      [flow.cantidad, flow.id_evento]
    );

    // 5. (Opcional) Si la capacidad llega a 0, cambiar el estado a "Agotado"
    await pool.query(
      'UPDATE Evento SET estado = "Agotado" WHERE id_evento = ? AND capacidad <= 0',
      [flow.id_evento]
    );

    // 6. Enviar correo de confirmación al usuario
    const mailOptions = {
      from: 'logieventsreal@gmail.com',
      to: flow.correo,
      subject: 'Confirmación de Reserva',
      text: `
        ¡Hola, ${flow.nombre_completo}!
        
        Tu reserva para el evento (ID: ${flow.id_evento}) se ha confirmado.
        Cantidad de espacios: ${flow.cantidad}
        
        Gracias por usar LogiEvents.
      `
    };
    await transporter.sendMail(mailOptions);

    // 7. Limpiar la información temporal
    delete reservationsFlow[tempReservationId];

    return res.json({ message: 'Reserva creada exitosamente y correo enviado.' });
  } catch (error) {
    console.error('Error en verifyReservation:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Error al confirmar la reserva', error });
  }
};
