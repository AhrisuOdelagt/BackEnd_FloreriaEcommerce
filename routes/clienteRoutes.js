import express from "express";
import { registroCliente,
    autenticacionCliente,
    confirmarCliente,
    olvidePassword,
    comprobarToken,
    nuevoPasswordRec,
    perfil } from "../controllers/clienteController.js";
import checkAuth from "../middleware/checkAuth.js"
const router = express.Router();

router.post("/", registroCliente);
router.post("/iniSes", autenticacionCliente);
router.get("/confirmar/:tokenCliente", confirmarCliente);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenCliente", comprobarToken);
router.post("/olvide-password/:tokenCliente", nuevoPasswordRec);
router.get("/perfil", checkAuth, perfil);

export default router;
