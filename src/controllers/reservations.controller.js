import { pool } from "../db.js";
import axios from 'axios';
import nodemailer from 'nodemailer';

let reservationsFlow = {}; // Almacén temporal de reservas en proceso

// Config nodemailer (correo remitente)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'logieventsreal@gmail.com',
    pass: 'vobc cusb slyf edua' // O la clave directamente
  }
});

/**
 * Genera un ID temporal para la reserva
 */
function generateTempId() {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Genera una palabra aleatoria que se enviará por SMS
 */
function generateRandomWord() {
  return Math.random().toString(36).substring(2, 8); // 6 caracteres alfanuméricos
}

/**
 * 1) startReservation
 *    - Verifica que el evento esté "Activo"
 *    - Genera una palabra aleatoria, la envía por SMS usando Infobip
 *    - Guarda los datos en reservationsFlow
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

    // 4. Guardar en memoria
    reservationsFlow[tempReservationId] = {
      id_usuario,
      id_evento,
      nombre_completo,
      correo,
      telefono,
      cantidad,
      smsWord
    };

    // >>>>> CAMBIOS PRINCIPALES: Envío SMS con Infobip <<<<<
    // Ajusta con tus credenciales y URL base
    const infobipApiKey = '17961e1d190891c0d55c5cfabfeb0d0e-4d70d28a-3190-46f8-ac63-1a60dd18c0f5'; // Reemplaza con tu clave real
    const infobipBaseUrl = 'https://8k39k3.api.infobip.com'; // Ajusta según tu subdominio

    // Si deseas usar el número ingresado por el usuario, ajusta:
    // const phoneNumber = telefono.startsWith('+') ? telefono : `+${telefono}`;
    const phoneNumber = '50684311955'; // fijo para prueba

    const messageText = `La palabra para confirmar tu reserva en "${event.nombre_evento}" es: ${smsWord}`;

    // Llamada a Infobip
    const response = await axios.post(
      `${infobipBaseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            from: "447491163443", // Ajusta el remitente si tu cuenta demo lo permite
            destinations: [
              { to: phoneNumber }
            ],
            text: messageText
          }
        ]
      },
      {
        headers: {
          Authorization: `App ${infobipApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Infobip response:', response.data);

    // 5. Responder
    return res.json({
      message: 'Se envió la palabra al celular. Use /verifyReservation para confirmarla.',
      tempReservationId
    });
  } catch (error) {
    console.error('Error en startReservation:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Error al iniciar la reserva', error });
  }
};

/**
 * 2) verifyReservation
 *    - Recibe tempReservationId y la palabra
 *    - Si coincide, inserta en la tabla Reservacion
 *    - Envía correo de confirmación al usuario
 */
export const verifyReservation = async (req, res) => {
  try {
    const { tempReservationId, word } = req.body;

    // 1. Verificar que tengamos un flujo
    const flow = reservationsFlow[tempReservationId];
    if (!flow) {
      return res.status(400).json({ message: 'No se ha iniciado una reserva con ese ID' });
    }

    // 2. Comparar la palabra
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

    // Restar la capacidad del evento
    await pool.query(
      'UPDATE Evento SET capacidad = capacidad - ? WHERE id_evento = ?',
      [flow.cantidad, flow.id_evento]
    );

    // (Opcional) Si la capacidad llega a 0, cambiar el estado a 'Agotado'
    await pool.query(
      'UPDATE Evento SET estado = "Agotado" WHERE id_evento = ? AND capacidad <= 0',
      [flow.id_evento]
    );

    // 4. Enviar correo de confirmación
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

    // 5. Limpiar la memoria
    delete reservationsFlow[tempReservationId];

    return res.json({ message: 'Reserva creada exitosamente y correo enviado.' });
  } catch (error) {
    console.error('Error en verifyReservation:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Error al confirmar la reserva', error });
  }
};
