import nodemailer from 'nodemailer';

async function main() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'logieventsreal@gmail.com',
        pass: 'efad awfk yfyf jspw'
      }
    });

    const info = await transporter.sendMail({
      from: 'logieventsreal@gmail.com',
      to: 'corralesjosh39@gmail.com',
      subject: 'Prueba Nodemailer',
      text: 'Hola desde Nodemailer'
    });

    console.log('Mensaje enviado:', info.messageId);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}

main();
