import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.MASTER_H,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MASTER_EM,
          pass: process.env.MASTER_P
        }
      });

    /*const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4c0d1dd1a6ed41",
          pass: "efdba6d2e156a6"
        }
      }); */

    console.log(email);
    // Información del email
    const info = await transport.sendMail({
        from: '"Florería Ecommerce — Administrador de la Base de Datos" <demian.oder@gmail.com>',
        to: email,
        subject: "Florería Ecommerce — Confirma tu cuenta",
        text: "Comprueba tu cuenta en Florería Ecommerce",
        html: `
        <p>Hola, ${nombre}, comprueba tu cuenta en Florería Ecommerce.</p>
        <p>Tu cuenta está casi lista, sólo debes comprobarla en el siguiente enlace:
        <a href="${process.env.PROJECT_URL}/api/cliente/confirmar/${token}">Comprobar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este email.</p>
        `
    })
}
