import express from "express";
import { registroAdministrador,
    autenticacionAdministrador,
    confirmarAdministrador,
    olvidePassword,
    comprobarToken,
    nuevoPasswordRec,
    perfil,
    modificarPassword,
    modificarUsername,
    modificarTelefono,
    visualizarRegistroCancelaciones,
    visualizarRegistroRembolsos} from "../controllers/administradorController.js";
import checkAuth from "../middleware/checkAuthAdmin.js"
const router = express.Router();

// Creación de usuario e inicio de sesión
router.post("/", registroAdministrador);
router.post("/iniSes", autenticacionAdministrador);
router.get("/confirmar/:tokenAdministrador", confirmarAdministrador);
// Olvidé contraseña
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenAdministrador", comprobarToken);
router.post("/olvide-password/:tokenAdministrador", nuevoPasswordRec);
router.get("/perfil", checkAuth, perfil);
// Modificar Datos Personales
router.post("/modificar/password", checkAuth, modificarPassword);
router.post("/modificar/username", checkAuth, modificarUsername);
router.post("/modificar/telefono", checkAuth, modificarTelefono);
//Visualisar Registros
router.get("/visualizar/RegistroCancelaciones", checkAuth,visualizarRegistroCancelaciones)
router.get("/visualizar/RegistroRembolsos", checkAuth,visualizarRegistroCancelaciones)

export default router;