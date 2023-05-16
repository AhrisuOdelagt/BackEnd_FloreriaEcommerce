import express from "express";
import { registroCliente, autenticacionCliente } from "../controllers/clienteController.js";
const router = express.Router();

router.post("/", registroCliente);
router.post("/iniSes", autenticacionCliente);

export default router;
