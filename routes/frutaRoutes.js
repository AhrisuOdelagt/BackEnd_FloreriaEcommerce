import express from "express";
import { crearFruta } from "../controllers/frutaController.js";
const router = express.Router();

// Función crear fruta
router.post("/", crearFruta);

export default router;
