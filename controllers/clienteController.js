import Cliente from "../modelos/cliente.js";
import generarID from "../helpers/generarID.js";

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
            email: cliente.emailCliente});
    }
    else{
        const error = new Error("El password es incorrecto.");
        return res.status(403).json({msg: error.message});
    }
}

export { registroCliente, autenticacionCliente };
