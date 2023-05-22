import Cliente from "../modelos/cliente.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";

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
        const clienteAlmacenado = await cliente.save();
        res.json(clienteAlmacenado);
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

export { registroCliente,
    autenticacionCliente,
    confirmarCliente,
    olvidePassword,
    comprobarToken,
    nuevoPasswordRec,
    perfil };
