import express from "express";
import { registroCliente,
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
    modificarTarjeta } from "../controllers/clienteController.js";
import checkAuth from "../middleware/checkAuth.js"
const router = express.Router();

// Creación de usuario e inicio de sesión
router.post("/", registroCliente);
router.post("/iniSes", autenticacionCliente);
router.get("/confirmar/:tokenCliente", confirmarCliente);
// Olvidé contraseña
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenCliente", comprobarToken);
router.post("/olvide-password/:tokenCliente", nuevoPasswordRec);
router.get("/perfil", checkAuth, perfil);
// Modificar Datos Personales
router.post("/modificar/password", checkAuth, modificarPassword);
router.post("/modificar/username", checkAuth, modificarUsername);
// router.post("/modificar/email", checkAuth, modificarEmail);
router.post("/modificar/telefono", checkAuth, modificarTelefono);
router.post("/modificar/direccion", checkAuth, modificarDireccion);
router.post("/modificar/tarjeta", checkAuth, modificarTarjeta);

export default router;
