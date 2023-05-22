import jwt from "jsonwebtoken";
import Cliente from "../modelos/cliente.js";

const checkAuth = async (req, res, next) => {
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.cliente = await Cliente.findById(decoded.id).select(
                "-passwordCliente -isConfirmed -token -createdAt -updatedAt -__v -telefonoCliente -isAdmin -pedidosCliente -direccionCliente -tarjetaCliente"
            );
        } catch (error) {
            
        }
    }

    if(!token){
        const error = new Error("Token de usuario no válido");
        res.status(401).json({
            msg: error.message
        })
    }

    return next();
}

export default checkAuth;
