import express from "express";
import { registroCliente,
    autenticacionCliente,
    confirmarCliente } from "../controllers/clienteController.js";
const router = express.Router();

router.post("/", registroCliente);
router.post("/iniSes", autenticacionCliente);
router.get("/confirmar/:tokenCliente", confirmarCliente);

export default router;
