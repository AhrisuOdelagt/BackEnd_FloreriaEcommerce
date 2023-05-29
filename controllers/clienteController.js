import Cliente from "../modelos/cliente.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";

// Registro del cliente en la base de datos
const registroCliente = async (req, res) => {
    // Evitar clientes duplicados sin lanzar errores en la consola
    const { emailCliente } = req.body;
    const existeCliente = await Cliente.findOne({ emailCliente });

    // Validamos que el cliente no exista ya
    if(existeCliente){
        const error = new Error("El usuario ya está registrado.");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const cliente = new Cliente(req.body);
        cliente.tokenCliente = generarID();
        await cliente.save();

        // Enviamos el email de confirmación
        emailRegistro({
            email: cliente.emailCliente,
            nombre: cliente.nombreCliente,
            token: cliente.tokenCliente
        })

        res.json({
            msg: "Usuario Creado exitosamente. Revise su email para confirmar su cuenta."
        });
    } catch (error) {
        console.log(error);
    }
};

// Autenticación del Usuario
const autenticacionCliente = async (req, res) => {
    const { email, passwordCliente } = req.body;
    // Comprobamos si el usuario existe
    const cliente = await Cliente.findOne({ email });
    if(!cliente){
        const error = new Error("El usuario no existe.");
        return res.status(404).json({msg: error.message});
    }
    // Comprobamos is el usuario está confirmado
    if(!cliente.isConfirmed){
        const error = new Error("El usuario no está confirmado.");
        return res.status(403).json({msg: error.message});
    }
    // Confirmamos la password
    if(await cliente.comprobarPassword(passwordCliente)){
        res.json({_id: cliente._id,
            nombre: cliente.nombreCliente,
            email: cliente.emailCliente,
            token: generarJWT(cliente._id)});
    }
    else{
        const error = new Error("El password es incorrecto.");
        return res.status(403).json({msg: error.message});
    }
}

// Uso de Token para confirmar cliente
const confirmarCliente = async (req, res) => {
    const { tokenCliente } = req.params;
    const clienteConfirmar = await Cliente.findOne({ tokenCliente });
    if(!clienteConfirmar) {
        const error = new Error("Token inválido.");
        return res.status(403).json({msg: error.message});
    }
    try {
        clienteConfirmar.isConfirmed = true;
        clienteConfirmar.tokenCliente = undefined;
        await clienteConfirmar.save();
        res.json({msg: "Cuenta confirmada correctamente."})
    } catch (error) {
        console.log(error);
    }
}

// Olvidé mi contraseña
const olvidePassword = async (req, res) => {
    const { emailCliente } = req.body;
    // Comprobamos si el usuario existe
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("El usuario no existe.");
        return res.status(404).json({msg: error.message});
    }
    try {
        cliente.tokenCliente = generarID();
        await cliente.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: cliente.emailCliente,
            nombre: cliente.nombreCliente,
            token: cliente.tokenCliente
        })
        res.json({
            msg: "Hemos enviado un email con las instrucciones."
        });
    } catch (error) {
        console.log(error);
    }
}

// Uso de Token para confirmar cliente
const comprobarToken = async (req, res) => {
    const { tokenCliente } = req.params;
    const tokenValido = await Cliente.findOne({ tokenCliente });
    if(!tokenValido) {
        const error = new Error("Token inválido.");
        return res.status(403).json({msg: error.message});
    }
    try {
        res.json({msg: "Token válido y el usuario existe."})
    } catch (error) {
        console.log(error);
    }
}

// Reestablecer contraseña
const nuevoPasswordRec = async (req, res) => {
    const { tokenCliente } = req.params;
    const { nuevaPassword } = req.body;

    const cliente = await Cliente.findOne({ tokenCliente });
    if(!cliente) {
        const error = new Error("Token inválido.");
        return res.status(403).json({msg: error.message});
    }
    try {
        cliente.passwordCliente = nuevaPassword;
        cliente.tokenCliente = undefined;
        cliente.save();
        res.json({msg: "Password modificado correctamente."})
    } catch (error) {
        console.log(error);
    }
}

// Perfil
const perfil = async (req, res) => {
    const { cliente } = req;
    res.json(cliente);
}

// Modificar password
const modificarPassword = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { newPassword } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        clienteAModificar.passwordCliente = newPassword;
        clienteAModificar.save();
        res.json({msg: "Contraseña modificada exitosamente."});
    } catch (error) {
        console.log(error);
    }
}

// Modificar username
const modificarUsername = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { nombre, apellido } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        let username;
        username = `${nombre} ${apellido}`;
        clienteAModificar.nombreCliente = username;
        clienteAModificar.save();
        res.json({msg: "Nombre de usuario modificado exitosamente."});
    } catch (error) {
        console.log(error);
    }
}

// // Modificar email
// const modificarEmail = async (req, res) => {
//     const { newEmail } = req.body;
//     // Verificamos que el Email que quiere colocar el cliente no exista
//     const cliente = await Cliente.findOne({ newEmail });
//     if(cliente){
//         const error = new Error("El email ya está ocupado.");
//         return res.status(404).json({msg: error.message});
//     }
//     let emailCliente;
//     emailCliente = req.cliente.emailCliente;
//     // Encontramos el documento del cliente que está realizando la operación
//     const clienteAModificar = await Cliente.findOne({ emailCliente });
//     if(!clienteAModificar.isConfirmed){
//         const error = new Error("Ocurrió un error.");
//         return res.status(403).json({msg: error.message});
//     }
//     // Realizamos la operación
//     try {
//         clienteAModificar.emailCliente = newEmail;
//         clienteAModificar.save();
//         res.json({msg: "Email modificado exitosamente."});
//     } catch (error) {
//         console.log(error);
//     }
// }

// Modificar teléfono
const modificarTelefono = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { telefono } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        clienteAModificar.telefonoCliente = telefono;
        clienteAModificar.save();
        res.json({msg: "Teléfono modificado exitosamente."});
    } catch (error) {
        console.log(error);
    }
}

// Modificar direccion
const modificarDireccion = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { col,
            cal,
            cp,
            nInt,
            nExt,
            calle1,
            calle2,
            adicionales } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        const direccion = {
            codigoPostal: cp,
            colonia: col,
            calle: cal,
            numInt: nInt,
            numExt: nExt,
            referencia1: calle1,
            referencia2: calle2,
            indicacionesAd: adicionales
        };
        clienteAModificar.direccionCliente.push(direccion);
        clienteAModificar.save();
        res.json({msg: "Dirección modificada exitosamente."});
    } catch (error) {
        console.log(error);
    }
}

// Modificar Tarjeta
const modificarTarjeta = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { tipo,
            num,
            fecha,
            c,
            titular } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        const direccion = {
            tipoTarjeta: tipo,
            numeroTarjeta: num,
            fechaVencimiento: fecha,
            cvv: c,
            titularTarjeta: titular
        };
        clienteAModificar.direccionCliente.push(direccion);
        clienteAModificar.save();
        res.json({msg: "Tarjeta modificada exitosamente."});
    } catch (error) {
        console.log(error);
    }
}

export { registroCliente,
    autenticacionCliente,
    confirmarCliente,
    olvidePassword,
    comprobarToken,
    nuevoPasswordRec,
    perfil,
    modificarPassword,
    modificarUsername,
    /*modificarEmail,*/
    modificarTelefono,
    modificarDireccion,
    modificarTarjeta };
