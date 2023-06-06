import Administrador from "../modelos/administrador.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";

// Registro del administrador en la base de datos
const registroAdministrador = async (req, res) => {
    // Evitar administradores duplicados sin lanzar errores en la consola
    const { emailAdministrador } = req.body;
    const existeAdministrador = await Administrador.findOne({ emailAdministrador });

    // Validamos que el administrador no exista ya
    if(existeAdministrador){
        const error = new Error("Correo asociado a una cuenta");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const administrador = new Administrador(req.body);
        administrador.usernameAdministrador = `${administrador.nombreAdministrador} ${administrador.apellidoAdministrador}`;
        administrador.tokenAdministrador = generarID();
        await administrador.save();

        // Enviamos el email de confirmación
        emailRegistro({
            email: administrador.emailAdministrador,
            nombre: administrador.usernameAdministrador,
            token: administrador.tokenAdministrador
        })

        res.json({
            msg: "Cuenta creada con éxito"
        });
    } catch (error) {
        console.log(error);
    }
};

// Autenticación del Usuario
const autenticacionAdministrador = async (req, res) => {
    const { emailAdministrador, passwordAdministrador } = req.body;
    // Comprobamos si el usuario existe
    const administrador = await Administrador.findOne({ emailAdministrador });
    if(!administrador){
        const error = new Error("Correo o contraseña incorrectos");
        return res.status(404).json({msg: error.message});
    }
    // Comprobamos is el usuario está confirmado
    if(!administrador.isConfirmed){
        const error = new Error("Usuario sin confirmar");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }
    // Confirmamos la password
    if(await administrador.comprobarPassword(passwordAdministrador)){
        res.json({_id: administrador._id,
            username: administrador.usernameAdministrador,
            email: administrador.emailAdministrador,
            token: generarJWT(administrador._id)});
    }
    else{
        const error = new Error("Correo o contraseña incorrectos");
        return res.status(403).json({msg: error.message});
    }
}

// Uso de Token para confirmar administrador
const confirmarAdministrador = async (req, res) => {
    const { tokenAdministrador } = req.params;
    const administradorConfirmar = await Administrador.findOne({ tokenAdministrador });
    if(!administradorConfirmar) {
        const error = new Error("Código de verificación inválido");
        return res.status(403).json({msg: error.message});
    }
    try {
        administradorConfirmar.isConfirmed = true;
        administradorConfirmar.isAdmin = true;
        administradorConfirmar.tokenAdministrador = undefined;
        await administradorConfirmar.save();
        res.json({msg: "Cuenta confirmada con éxito"})  /* Mensaje faltante */
    } catch (error) {
        console.log(error);
    }
}

// Olvidé mi contraseña
const olvidePassword = async (req, res) => {
    const { emailAdministrador } = req.body;
    // Comprobamos si el usuario existe
    const administrador = await Administrador.findOne({ emailAdministrador });
    if(!administrador){
        const error = new Error("El correo no está registrado");   /* Mensaje faltante */
        return res.status(404).json({msg: error.message});
    }
    try {
        administrador.tokenAdministrador = generarID();
        await administrador.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: administrador.emailAdministrador,
            nombre: administrador.usernameAdministrador,
            token: administrador.tokenAdministrador
        })
        res.json({
            msg: "Se ha enviado un correo con las instrucciones a seguir"   /* Mensaje faltante */
        });
    } catch (error) {
        console.log(error);
    }
}

// Uso de Token para confirmar administrador
const comprobarToken = async (req, res) => {
    const { tokenAdministrador } = req.params;
    const tokenValido = await Administrador.findOne({ tokenAdministrador });
    if(!tokenValido) {
        const error = new Error("Código de verificación inválido");
        return res.status(403).json({msg: error.message});
    }
    try {
        res.json({msg: "Código de verificación correcto"})
    } catch (error) {
        console.log(error);
    }
}

// Reestablecer contraseña
const nuevoPasswordRec = async (req, res) => {
    const { tokenAdministrador } = req.params;
    const { nuevaPassword } = req.body;

    const administrador = await Administrador.findOne({ tokenAdministrador });
    if(!administrador) {
        const error = new Error("Código de verificación inválido");
        return res.status(403).json({msg: error.message});
    }
    try {
        administrador.passwordAdministrador = nuevaPassword;
        administrador.tokenAdministrador = undefined;
        administrador.save();
        res.json({msg: "Cambio guardado exitosamente"})
    } catch (error) {
        console.log(error);
    }
}

// Perfil
const perfil = async (req, res) => {
    const { administrador } = req;
    res.json(administrador);
}

// Modificar password
const modificarPassword = async (req, res) => {
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const { newPassword } = req.body;
    // Encontramos el documento del administrador que está realizando la operación
    const administradorAModificar = await Administrador.findOne({ emailAdministrador });
    if(!administradorAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        administradorAModificar.passwordAdministrador = newPassword;
        administradorAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// Modificar username
const modificarUsername = async (req, res) => {
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const { nombre, apellido } = req.body;
    // Encontramos el documento del administrador que está realizando la operación
    const administradorAModificar = await Administrador.findOne({ emailAdministrador });
    if(!administradorAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        administradorAModificar.nombreAdministrador = nombre;
        administradorAModificar.apellidoAdministrador = apellido;
        administradorAModificar.usernameAdministrador = `${administradorAModificar.nombreAdministrador} ${administradorAModificar.apellidoAdministrador}`;
        administradorAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// Modificar teléfono
const modificarTelefono = async (req, res) => {
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const { telefono } = req.body;
    // Encontramos el documento del administrador que está realizando la operación
    const administradorAModificar = await Administrador.findOne({ emailAdministrador });
    if(!administradorAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        administradorAModificar.telefonoAdministrador = telefono;
        administradorAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

export { registroAdministrador,
    autenticacionAdministrador,
    confirmarAdministrador,
    olvidePassword,
    comprobarToken,
    nuevoPasswordRec,
    perfil,
    modificarPassword,
    modificarUsername,
    modificarTelefono};
